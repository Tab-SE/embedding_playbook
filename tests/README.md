# Agent Testing Suite

This directory contains tests for verifying the conversation flow, message counting, and error handling for all agents (Makana, Cumulus, and Superstore).

## Test Files

### 1. `agent-conversation.test.js`
Jest-compatible test suite for automated testing.

**Features:**
- Tests all three agents (Makana, Cumulus, Superstore)
- Verifies initial questions and follow-ups
- Tests message counting (1-5 messages)
- Tests warning banners at message 4 and 5
- Tests auto-reset at message 6
- Tests manual reset via "New Chat" button
- Tests error handling and dismissal

**Run with:**
```bash
npm test tests/agent-conversation.test.js
```

### 2. `run-agent-tests.js`
Standalone Node.js test runner for quick verification.

**Features:**
- Can be run without Jest
- Color-coded console output
- Supports testing specific agents
- Verbose mode for debugging
- Returns exit code (0 = all passed, 1 = failures)

**Run with:**
```bash
# Test all agents
node tests/run-agent-tests.js

# Test specific agent
node tests/run-agent-tests.js --agent=SUPERSTORE

# Verbose output
node tests/run-agent-tests.js --verbose

# Help
node tests/run-agent-tests.js --help
```

### 3. `manual-agent-test.md`
Manual testing checklist and guide.

**Use for:**
- QA testing before releases
- Verifying UI behavior
- Testing edge cases
- Visual confirmation of banners and warnings

## Test Coverage

### Makana Agent
1. **Question**: "What are the top three reasons for claim denials, and how do they vary by provider?"
   - **Follow-up**: "Can you show me trends over the last 6 months?"

2. **Question**: "How does the average processing time for claims correlate with the type of plan and denial rates?"
   - **Follow-up**: "Which plan type has the longest processing time?"

3. **Question**: "How do sales trends for specific products vary over time, and what factors contribute to these trends?"
   - **Follow-up**: "What products show the most volatility?"

### Cumulus Agent
1. **Question**: "What's the AUM by client segment?"
   - **Follow-up**: "Which segment has grown the most this year?"

2. **Question**: "Which advisors have the highest client retention rates?"
   - **Follow-up**: "What strategies do these top advisors use?"

3. **Question**: "What are the NPS scores by market segment?"
   - **Follow-up**: "How does this compare to last quarter?"

### Superstore Agent
1. **Question**: "What are the total sales across each region?"
   - **Follow-up**: "Which region has the highest growth rate?"

2. **Question**: "What's our profit margin by category?"
   - **Follow-up**: "Can you show me trends by month for each category?"

3. **Question**: "List the Datasources"
   - **Follow-up**: "Which datasource has the most recent data?"

## What Gets Tested

### ✅ Functionality Tests
- Agent responds to all initial questions
- Agent responds to all follow-up questions
- Responses are meaningful (not empty or error messages)
- Context is maintained between initial question and follow-up

### ✅ Message Counting
- Count starts at 0 (Ready state)
- Count increments to 1 after first message
- Count increments to 2 after second message
- Count continues incrementing up to 5
- Count resets to 0 when "New Chat" is clicked
- Count resets to 1 after auto-reset (6th message)

### ✅ Warning Banners
- **At message 4**: Blue info banner appears
  - Text: "💡 After 1 more message, chat memory will reset..."
- **At message 5**: Amber warning banner appears
  - Text: "⚠️ Chat memory limit reached. Your next message will start a fresh conversation."

### ✅ Auto-Reset (6th message)
- New thread is created automatically
- Message count resets to 1
- Blue notification appears
  - Text: "💬 Started a fresh conversation to keep responses fast and relevant..."
- Notification auto-dismisses after 8 seconds
- Previous conversation is cleared

### ✅ Manual Reset
- "New Chat" button is visible
- Clicking button clears conversation
- Message count resets to "Ready"
- Welcome message reappears

### ✅ Error Handling
- Network errors show red error banner
- API errors show clear error messages
- Error banners can be dismissed
- Errors don't break the UI
- Can continue after dismissing errors

### ✅ UI Behavior
- No flickering during streaming responses
- Avatars render correctly
- Markdown formatting works
- Thinking indicator appears during response generation
- UI remains responsive throughout

## Running Tests in Browser Console

The test file includes browser-compatible functions. Load the page and run:

```javascript
// Test specific agent
window.runAgentTests("SUPERSTORE")
window.runAgentTests("MAKANA")
window.runAgentTests("CUMULUS")

// Test all agents
window.testAllAgents()
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Run Agent Tests
  run: |
    node tests/run-agent-tests.js --verbose
```

Or with npm scripts:

```json
{
  "scripts": {
    "test:agents": "node tests/run-agent-tests.js",
    "test:agents:verbose": "node tests/run-agent-tests.js --verbose",
    "test:makana": "node tests/run-agent-tests.js --agent=MAKANA",
    "test:cumulus": "node tests/run-agent-tests.js --agent=CUMULUS",
    "test:superstore": "node tests/run-agent-tests.js --agent=SUPERSTORE"
  }
}
```

Then run:
```bash
npm run test:agents
npm run test:superstore
```

## Expected Test Results

All tests should pass with:
- ✅ 100% of initial questions answered
- ✅ 100% of follow-up questions answered
- ✅ Message counting accurate (1→2→3→4→5)
- ✅ Warning at message 4
- ✅ Limit warning at message 5
- ✅ Auto-reset at message 6
- ✅ Manual reset works
- ✅ Error handling functional

## Troubleshooting

### Tests Failing?

1. **Check Agent IDs**: Ensure agent IDs in test files match your configuration
2. **Verify API Endpoint**: Check BASE_URL points to correct environment
3. **Check Network**: Ensure you can reach the API
4. **Review Logs**: Use `--verbose` flag for detailed output
5. **Manual Test**: Try manual testing to isolate the issue

### Common Issues

**"Agent not responding"**
- Check if LangGraph API is running
- Verify authentication/credentials
- Check network connectivity

**"Message count not incrementing"**
- Check browser console for errors
- Verify turn counting logic in LanggraphAgentRuntimeProvider
- Test with manual questions

**"Banners not appearing"**
- Check if turnCount is updating in state
- Verify NewChatButton component logic
- Check CSS classes are applied

## Adding New Tests

To add tests for a new agent:

1. Add agent to `TEST_AGENTS` object in test files:
```javascript
NEW_AGENT: {
  name: 'New Agent',
  agentId: 'new-agent-id',
  questions: [
    {
      initial: "Your question here?",
      followUp: "Follow-up question?"
    }
    // Add 2-3 question pairs
  ]
}
```

2. Run tests:
```bash
node tests/run-agent-tests.js --agent=NEW_AGENT
```

## Best Practices

- ✅ Run tests before every deployment
- ✅ Add new test cases when adding features
- ✅ Test manually for visual/UX issues
- ✅ Keep test questions realistic and varied
- ✅ Document any test failures
- ✅ Update tests when behavior changes

## Support

If you encounter issues with tests:
1. Check this README
2. Review `manual-agent-test.md` for visual testing
3. Run with `--verbose` flag for debugging
4. Check browser console for errors
5. Review component code in `src/components/`

---

**Last Updated**: 2025
**Maintained By**: Development Team
