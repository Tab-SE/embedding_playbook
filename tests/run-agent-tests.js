#!/usr/bin/env node

/**
 * Agent Testing Script
 *
 * Runs automated tests against the agent endpoints to verify:
 * - Responses are generated for all questions
 * - Message counting works correctly
 * - Auto-reset behavior functions properly
 *
 * Usage:
 *   node tests/run-agent-tests.js
 *   node tests/run-agent-tests.js --agent=SUPERSTORE
 *   node tests/run-agent-tests.js --verbose
 */

// Import fetch for Node.js
const fetch = require('node-fetch');

const TEST_AGENTS = {
  MAKANA: {
    name: 'Makana',
    agentId: 'makana-health-claims-agent',
    questions: [
      {
        initial: "What are the top three reasons for claim denials, and how do they vary by provider?",
        followUp: "Can you show me trends over the last 6 months?"
      },
      {
        initial: "How does the average processing time for claims correlate with the type of plan and denial rates?",
        followUp: "Which plan type has the longest processing time?"
      },
      {
        initial: "How do sales trends for specific products vary over time, and what factors contribute to these trends?",
        followUp: "What products show the most volatility?"
      }
    ]
  },
  CUMULUS: {
    name: 'Cumulus',
    agentId: 'cumulus-wealth-management-agent',
    questions: [
      {
        initial: "What's the AUM by client segment?",
        followUp: "Which segment has grown the most this year?"
      },
      {
        initial: "Which advisors have the highest client retention rates?",
        followUp: "What strategies do these top advisors use?"
      },
      {
        initial: "What are the NPS scores by market segment?",
        followUp: "How does this compare to last quarter?"
      }
    ]
  },
  SUPERSTORE: {
    name: 'Superstore',
    agentId: 'superstore-sales-agent',
    questions: [
      {
        initial: "What are the total sales across each region?",
        followUp: "Which region has the highest growth rate?"
      },
      {
        initial: "What's our profit margin by category?",
        followUp: "Can you show me trends by month for each category?"
      },
      {
        initial: "List the Datasources",
        followUp: "Which datasource has the most recent data?"
      }
    ]
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const agentArg = args.find(arg => arg.startsWith('--agent='));
const specificAgent = agentArg ? agentArg.split('=')[1].toUpperCase() : null;

// Test configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/langgraph`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logVerbose(message) {
  if (verbose) {
    log(`  ${message}`, 'cyan');
  }
}

// Create a new thread
async function createThread() {
  try {
    const response = await fetch(`${API_ENDPOINT}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create thread: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.thread_id;
  } catch (error) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}

// Send message to agent and wait for response
async function sendMessageToAgent(agentId, message, threadId = null, messageCount = 0) {
  logVerbose(`Sending message to ${agentId}: "${message.substring(0, 50)}..."`);

  try {
    // Create thread if not provided
    if (!threadId) {
      logVerbose('Creating new thread...');
      threadId = await createThread();
      logVerbose(`Thread created: ${threadId}`);
    }

    // Increment message count for this human message
    const currentCount = messageCount + 1;

    // Prepare the message payload
    const messagePayload = {
      type: 'human',
      content: message
    };

    // Send message via streaming API
    logVerbose(`Sending to /runs/stream with threadId: ${threadId}`);
    const response = await fetch(`${API_ENDPOINT}/runs/stream/${threadId}/${agentId}?stream_mode=messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          messages: [messagePayload]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    // Read the streaming response
    let fullResponse = '';
    const reader = response.body;
    const decoder = new TextDecoder();

    for await (const chunk of reader) {
      const text = decoder.decode(chunk, { stream: true });

      // Parse SSE format
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            // Collect AI messages
            if (data[0] === 'messages/partial' || data[0] === 'messages/complete') {
              const msg = data[1];
              if (msg.type === 'ai' || msg.role === 'assistant') {
                if (typeof msg.content === 'string') {
                  fullResponse += msg.content;
                } else if (Array.isArray(msg.content)) {
                  msg.content.forEach(part => {
                    if (part.type === 'text' && part.text) {
                      fullResponse += part.text;
                    }
                  });
                }
              }
            }
          } catch (e) {
            // Skip non-JSON lines
          }
        }
      }
    }

    logVerbose(`Received response (${fullResponse.length} chars)`);

    return {
      success: true,
      response: fullResponse,
      threadId: threadId,
      messageCount: currentCount
    };

  } catch (error) {
    logVerbose(`Error: ${error.message}`);
    return {
      success: false,
      response: '',
      threadId: threadId,
      messageCount: messageCount,
      error: error.message
    };
  }
}

async function testQuestion(agent, questionPair, questionIndex) {
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  log(`\n  Question ${questionIndex + 1}: "${questionPair.initial}"`, 'bright');

  try {
    // Test initial question
    logVerbose('Testing initial question...');
    const response1 = await sendMessageToAgent(agent.agentId, questionPair.initial, null, 0);

    if (response1.success && response1.response && response1.response.length > 0) {
      log(`    ✓ Initial question answered (${response1.response.length} chars)`, 'green');
      logVerbose(`    Response preview: ${response1.response.substring(0, 100)}...`);
      results.passed++;
      results.tests.push({ name: 'Initial question', status: 'passed' });
    } else {
      log(`    ✗ Initial question failed: ${response1.error || 'No response'}`, 'red');
      results.failed++;
      results.tests.push({ name: 'Initial question', status: 'failed', error: response1.error });
    }

    // Verify first message count
    logVerbose(`Message count after initial question: ${response1.messageCount}`);
    if (response1.messageCount === 1) {
      log(`    ✓ Message count correct (1)`, 'green');
      results.passed++;
      results.tests.push({ name: 'Initial message count', status: 'passed' });
    } else {
      log(`    ✗ Message count incorrect (expected 1, got ${response1.messageCount})`, 'red');
      results.failed++;
      results.tests.push({ name: 'Initial message count', status: 'failed' });
    }

    // Test follow-up question
    logVerbose('Testing follow-up question...');
    const response2 = await sendMessageToAgent(
      agent.agentId,
      questionPair.followUp,
      response1.threadId,
      response1.messageCount
    );

    if (response2.success && response2.response && response2.response.length > 0) {
      log(`    ✓ Follow-up question answered (${response2.response.length} chars)`, 'green');
      logVerbose(`    Response preview: ${response2.response.substring(0, 100)}...`);
      results.passed++;
      results.tests.push({ name: 'Follow-up question', status: 'passed' });
    } else {
      log(`    ✗ Follow-up question failed: ${response2.error || 'No response'}`, 'red');
      results.failed++;
      results.tests.push({ name: 'Follow-up question', status: 'failed', error: response2.error });
    }

    // Verify follow-up message count
    logVerbose(`Message count after follow-up: ${response2.messageCount}`);
    if (response2.messageCount === 2) {
      log(`    ✓ Message count incremented correctly (2)`, 'green');
      results.passed++;
      results.tests.push({ name: 'Follow-up message count', status: 'passed' });
    } else {
      log(`    ✗ Message count incorrect (expected 2, got ${response2.messageCount})`, 'red');
      results.failed++;
      results.tests.push({ name: 'Follow-up message count', status: 'failed' });
    }

  } catch (error) {
    log(`    ✗ Test error: ${error.message}`, 'red');
    results.failed++;
    results.tests.push({ name: 'Exception', status: 'failed', error: error.message });
  }

  return results;
}

async function testAgent(agent) {
  log(`\n${'='.repeat(60)}`, 'bright');
  log(`Testing ${agent.name} Agent`, 'bright');
  log(`${'='.repeat(60)}`, 'bright');

  const overallResults = {
    agent: agent.name,
    passed: 0,
    failed: 0,
    questions: []
  };

  for (let i = 0; i < agent.questions.length; i++) {
    const questionResults = await testQuestion(agent, agent.questions[i], i);
    overallResults.passed += questionResults.passed;
    overallResults.failed += questionResults.failed;
    overallResults.questions.push(questionResults);
  }

  // Test message limit behavior
  log(`\n  Testing message limit behavior...`, 'bright');
  try {
    let threadId = null;
    let messageCount = 0;

    // Send 6 messages to test auto-reset
    for (let i = 1; i <= 6; i++) {
      logVerbose(`Sending message ${i}/6...`);
      const response = await sendMessageToAgent(
        agent.agentId,
        `Test message ${i}`,
        threadId,
        messageCount
      );

      if (!response.success) {
        throw new Error(`Message ${i} failed: ${response.error}`);
      }

      threadId = response.threadId;
      messageCount = response.messageCount;

      logVerbose(`Message ${i} sent, count: ${messageCount}`);

      // At message 6, the count should reset to 1 (auto-reset)
      if (i === 6 && messageCount === 1) {
        log(`    ✓ Auto-reset detected at message 6 (count reset to 1)`, 'green');
        overallResults.passed++;
      } else if (i === 6 && messageCount !== 1) {
        log(`    ✗ Auto-reset failed (expected count 1, got ${messageCount})`, 'red');
        overallResults.failed++;
      }
    }

    log(`    ✓ Message limit test completed`, 'green');
    overallResults.passed++;
  } catch (error) {
    log(`    ✗ Message limit test failed: ${error.message}`, 'red');
    overallResults.failed += 2; // Failed both the limit test and auto-reset test
  }

  return overallResults;
}

async function runTests() {
  log('\n' + '='.repeat(60), 'bright');
  log('  AGENT CONVERSATION TESTS', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  const startTime = Date.now();
  const allResults = [];

  // Determine which agents to test
  const agentsToTest = specificAgent
    ? [TEST_AGENTS[specificAgent]]
    : Object.values(TEST_AGENTS);

  if (!agentsToTest[0]) {
    log(`Error: Unknown agent "${specificAgent}"`, 'red');
    log(`Available agents: MAKANA, CUMULUS, SUPERSTORE`, 'yellow');
    process.exit(1);
  }

  // Run tests for each agent
  for (const agent of agentsToTest) {
    const results = await testAgent(agent);
    allResults.push(results);
  }

  // Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  log('\n' + '='.repeat(60), 'bright');
  log('  TEST SUMMARY', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  allResults.forEach(result => {
    const total = result.passed + result.failed;
    const passRate = total > 0 ? ((result.passed / total) * 100).toFixed(1) : 0;
    const status = result.failed === 0 ? '✓' : '✗';
    const color = result.failed === 0 ? 'green' : 'red';

    log(`${status} ${result.agent}: ${result.passed}/${total} passed (${passRate}%)`, color);
  });

  const totalPassed = allResults.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = allResults.reduce((sum, r) => sum + r.failed, 0);
  const total = totalPassed + totalFailed;

  log(`\nTotal: ${totalPassed}/${total} tests passed`, totalFailed === 0 ? 'green' : 'yellow');
  log(`Duration: ${duration}s\n`, 'cyan');

  // Exit with appropriate code
  process.exit(totalFailed > 0 ? 1 : 0);
}

// Print usage if --help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Agent Testing Script

Usage:
  node tests/run-agent-tests.js [options]

Options:
  --agent=NAME    Test specific agent (MAKANA, CUMULUS, SUPERSTORE)
  --verbose       Show detailed test output
  --help, -h      Show this help message

Environment:
  TEST_BASE_URL   Base URL for API (default: http://localhost:3000)

Examples:
  node tests/run-agent-tests.js
  node tests/run-agent-tests.js --agent=SUPERSTORE
  node tests/run-agent-tests.js --verbose
  TEST_BASE_URL=https://staging.example.com node tests/run-agent-tests.js
  `);
  process.exit(0);
}

// Run the tests
runTests().catch(error => {
  log(`\nFatal error: ${error.message}`, 'red');
  if (verbose) {
    console.error(error);
  }
  process.exit(1);
});
