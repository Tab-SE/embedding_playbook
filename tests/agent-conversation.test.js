/**
 * Agent Conversation Tests
 *
 * Tests the chat functionality for Makana, Cumulus, and Superstore agents.
 * Verifies:
 * - Agents respond to initial questions
 * - Follow-up questions work correctly
 * - Message counting increments properly
 * - Chat memory limits are enforced
 */

const AGENTS = {
  MAKANA: {
    name: 'Makana',
    agentId: 'makana-agent-id',
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
    agentId: 'cumulus-agent-id',
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
    agentId: 'superstore-agent-id',
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

// Test utilities
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendMessage = async (message, agentId) => {
  // This would call your actual API endpoint
  const response = await fetch('/api/langgraph/runs/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agentId,
      message,
    }),
  });
  return response;
};

const getMessageCount = () => {
  // Get the message count from the UI
  const countElement = document.querySelector('[data-testid="message-count"]');
  if (!countElement) return null;
  const match = countElement.textContent.match(/(\d+) of 5 messages/);
  return match ? parseInt(match[1]) : null;
};

const waitForResponse = async (timeout = 30000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const messages = document.querySelectorAll('[data-message-role="assistant"]');
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.querySelector('[data-loading="true"]')) {
      return lastMessage.textContent;
    }
    await delay(100);
  }
  throw new Error('Response timeout');
};

// Test suite for each agent
describe('Agent Conversation Tests', () => {
  Object.values(AGENTS).forEach((agent) => {
    describe(`${agent.name} Agent`, () => {
      beforeEach(async () => {
        // Reset the chat before each test
        const newChatButton = document.querySelector('[title*="Start a fresh conversation"]');
        if (newChatButton) {
          newChatButton.click();
          await delay(500);
        }
      });

      agent.questions.forEach((questionPair, index) => {
        describe(`Question ${index + 1}`, () => {
          it('should respond to initial question', async () => {
            console.log(`Testing: ${questionPair.initial}`);

            // Send initial question
            const response = await sendMessage(questionPair.initial, agent.agentId);
            expect(response.ok).toBe(true);

            // Wait for response
            const responseText = await waitForResponse();
            expect(responseText).toBeTruthy();
            expect(responseText.length).toBeGreaterThan(10);

            // Verify message count incremented
            const count = getMessageCount();
            expect(count).toBeGreaterThan(0);

            console.log(`✓ Initial question answered (${count} messages)`);
          });

          it('should respond to follow-up question', async () => {
            console.log(`Testing follow-up: ${questionPair.followUp}`);

            // First send initial question
            await sendMessage(questionPair.initial, agent.agentId);
            await waitForResponse();

            const countBefore = getMessageCount();

            // Then send follow-up
            const response = await sendMessage(questionPair.followUp, agent.agentId);
            expect(response.ok).toBe(true);

            // Wait for response
            const responseText = await waitForResponse();
            expect(responseText).toBeTruthy();
            expect(responseText.length).toBeGreaterThan(10);

            // Verify message count incremented
            const countAfter = getMessageCount();
            expect(countAfter).toBe(countBefore + 1);

            console.log(`✓ Follow-up question answered (${countAfter} messages)`);
          });
        });
      });

      it('should show warning near message limit', async () => {
        // Send 4 messages to trigger the warning
        for (let i = 0; i < 4; i++) {
          await sendMessage(agent.questions[0].initial, agent.agentId);
          await waitForResponse();
          await delay(500);
        }

        // Check for warning message
        const warningBanner = document.querySelector('[class*="bg-blue-50"]');
        expect(warningBanner).toBeTruthy();
        expect(warningBanner.textContent).toContain('After 1 more message');

        console.log('✓ Warning shown at message 4');
      });

      it('should show limit reached at 5 messages', async () => {
        // Send 5 messages to hit the limit
        for (let i = 0; i < 5; i++) {
          await sendMessage(agent.questions[0].initial, agent.agentId);
          await waitForResponse();
          await delay(500);
        }

        // Check for limit reached warning
        const limitBanner = document.querySelector('[class*="bg-amber-100"]');
        expect(limitBanner).toBeTruthy();
        expect(limitBanner.textContent).toContain('Chat memory limit reached');

        console.log('✓ Limit warning shown at message 5');
      });

      it('should auto-reset after 5 messages', async () => {
        // Send 6 messages to trigger auto-reset
        for (let i = 0; i < 6; i++) {
          await sendMessage(agent.questions[0].initial, agent.agentId);
          await waitForResponse();
          await delay(500);
        }

        // Check for reset notification
        const resetNotification = document.querySelector('[class*="bg-blue-50"]');
        expect(resetNotification).toBeTruthy();
        expect(resetNotification.textContent).toContain('Started a fresh conversation');

        // Verify count reset to 1
        const count = getMessageCount();
        expect(count).toBe(1);

        console.log('✓ Auto-reset triggered and count reset to 1');
      });
    });
  });

  describe('Manual Reset', () => {
    it('should reset conversation when New Chat is clicked', async () => {
      // Send a few messages
      await sendMessage(AGENTS.SUPERSTORE.questions[0].initial, AGENTS.SUPERSTORE.agentId);
      await waitForResponse();
      await sendMessage(AGENTS.SUPERSTORE.questions[0].followUp, AGENTS.SUPERSTORE.agentId);
      await waitForResponse();

      const countBefore = getMessageCount();
      expect(countBefore).toBe(2);

      // Click New Chat button
      const newChatButton = document.querySelector('[title*="Start a fresh conversation"]');
      expect(newChatButton).toBeTruthy();
      newChatButton.click();
      await delay(500);

      // Verify count reset to 0 (Ready state)
      const countAfter = getMessageCount();
      expect(countAfter).toBe(0);

      // Verify chat is empty
      const messages = document.querySelectorAll('[data-message-role]');
      expect(messages.length).toBe(0);

      console.log('✓ Manual reset successful');
    });
  });

  describe('Error Handling', () => {
    it('should show error message on API failure', async () => {
      // Mock API failure
      const originalFetch = global.fetch;
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      );

      await sendMessage('test question', AGENTS.SUPERSTORE.agentId);
      await delay(1000);

      // Check for error banner
      const errorBanner = document.querySelector('[class*="bg-red-50"]');
      expect(errorBanner).toBeTruthy();
      expect(errorBanner.textContent.length).toBeGreaterThan(0);

      // Restore fetch
      global.fetch = originalFetch;

      console.log('✓ Error message displayed');
    });

    it('should allow dismissing error messages', async () => {
      // Trigger an error first
      const originalFetch = global.fetch;
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      );

      await sendMessage('test question', AGENTS.SUPERSTORE.agentId);
      await delay(1000);

      const errorBanner = document.querySelector('[class*="bg-red-50"]');
      expect(errorBanner).toBeTruthy();

      // Click dismiss button
      const dismissButton = errorBanner.querySelector('button[title="Dismiss"]');
      expect(dismissButton).toBeTruthy();
      dismissButton.click();
      await delay(100);

      // Verify error is gone
      const errorAfterDismiss = document.querySelector('[class*="bg-red-50"]');
      expect(errorAfterDismiss).toBeFalsy();

      global.fetch = originalFetch;

      console.log('✓ Error dismissal works');
    });
  });
});

// Manual test runner (for browser console)
if (typeof window !== 'undefined') {
  window.runAgentTests = async (agentName) => {
    const agent = AGENTS[agentName.toUpperCase()];
    if (!agent) {
      console.error('Unknown agent. Use: MAKANA, CUMULUS, or SUPERSTORE');
      return;
    }

    console.log(`\n🧪 Running tests for ${agent.name} Agent\n`);

    for (let i = 0; i < agent.questions.length; i++) {
      const q = agent.questions[i];

      console.log(`\nTest ${i + 1}: ${q.initial}`);
      try {
        // Test initial question
        await sendMessage(q.initial, agent.agentId);
        const response1 = await waitForResponse();
        console.log(`✓ Response received (${response1.substring(0, 100)}...)`);

        await delay(1000);

        // Test follow-up
        console.log(`Follow-up: ${q.followUp}`);
        await sendMessage(q.followUp, agent.agentId);
        const response2 = await waitForResponse();
        console.log(`✓ Follow-up response received (${response2.substring(0, 100)}...)`);

        const count = getMessageCount();
        console.log(`✓ Message count: ${count}`);

        await delay(2000);
      } catch (error) {
        console.error(`✗ Test failed:`, error);
      }
    }

    console.log(`\n✅ All tests completed for ${agent.name}\n`);
  };

  // Quick test command
  window.testAllAgents = async () => {
    for (const agentName of ['MAKANA', 'CUMULUS', 'SUPERSTORE']) {
      await window.runAgentTests(agentName);
      await delay(3000);
    }
    console.log('\n🎉 All agent tests completed!\n');
  };

  console.log('Agent tests loaded! Run in console:');
  console.log('  window.runAgentTests("SUPERSTORE")');
  console.log('  window.runAgentTests("MAKANA")');
  console.log('  window.runAgentTests("CUMULUS")');
  console.log('  window.testAllAgents()');
}

module.exports = { AGENTS };
