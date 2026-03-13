# Manual Agent Testing Guide

This guide helps you manually test the conversation flow and message counting for each agent.

## Test Scenarios

### Makana Agent

#### Test 1: Claim Denials Analysis
1. **Initial Question**: "What are the top three reasons for claim denials, and how do they vary by provider?"
   - ✅ Agent responds with analysis
   - ✅ Message count shows: 1 of 5 messages

2. **Follow-up**: "Can you show me trends over the last 6 months?"
   - ✅ Agent provides trend data
   - ✅ Message count shows: 2 of 5 messages

#### Test 2: Processing Time Correlation
1. **Initial Question**: "How does the average processing time for claims correlate with the type of plan and denial rates?"
   - ✅ Agent responds with correlation analysis
   - ✅ Message count increments properly

2. **Follow-up**: "Which plan type has the longest processing time?"
   - ✅ Agent provides specific plan type information
   - ✅ Message count increments properly

#### Test 3: Product Sales Trends
1. **Initial Question**: "How do sales trends for specific products vary over time, and what factors contribute to these trends?"
   - ✅ Agent responds with trend analysis
   - ✅ Message count increments properly

2. **Follow-up**: "What products show the most volatility?"
   - ✅ Agent identifies volatile products
   - ✅ Message count increments properly

---

### Cumulus Agent

#### Test 1: AUM by Client Segment
1. **Initial Question**: "What's the AUM by client segment?"
   - ✅ Agent provides AUM breakdown
   - ✅ Message count shows: 1 of 5 messages

2. **Follow-up**: "Which segment has grown the most this year?"
   - ✅ Agent identifies top growth segment
   - ✅ Message count shows: 2 of 5 messages

#### Test 2: Advisor Retention Rates
1. **Initial Question**: "Which advisors have the highest client retention rates?"
   - ✅ Agent lists top advisors
   - ✅ Message count increments properly

2. **Follow-up**: "What strategies do these top advisors use?"
   - ✅ Agent describes strategies
   - ✅ Message count increments properly

#### Test 3: NPS Scores
1. **Initial Question**: "What are the NPS scores by market segment?"
   - ✅ Agent provides NPS breakdown
   - ✅ Message count increments properly

2. **Follow-up**: "How does this compare to last quarter?"
   - ✅ Agent provides quarter-over-quarter comparison
   - ✅ Message count increments properly

---

### Superstore Agent

#### Test 1: Regional Sales
1. **Initial Question**: "What are the total sales across each region?"
   - ✅ Agent provides sales by region
   - ✅ Message count shows: 1 of 5 messages

2. **Follow-up**: "Which region has the highest growth rate?"
   - ✅ Agent identifies top growth region
   - ✅ Message count shows: 2 of 5 messages

#### Test 2: Profit Margins
1. **Initial Question**: "What's our profit margin by category?"
   - ✅ Agent provides profit margins
   - ✅ Message count increments properly

2. **Follow-up**: "Can you show me trends by month for each category?"
   - ✅ Agent provides monthly trends
   - ✅ Message count increments properly

#### Test 3: Datasources
1. **Initial Question**: "List the Datasources"
   - ✅ Agent lists available datasources
   - ✅ Message count increments properly

2. **Follow-up**: "Which datasource has the most recent data?"
   - ✅ Agent identifies most recent datasource
   - ✅ Message count increments properly

---

## Message Limit Tests

### Test at 4 Messages
1. Send 4 messages (2 questions with 2 follow-ups)
2. **Expected**:
   - ✅ Blue info banner appears
   - ✅ Message: "After 1 more message, chat memory will reset to keep responses fast and relevant."
   - ✅ Count shows: 4 of 5 messages

### Test at 5 Messages (Limit Reached)
1. Send 5th message
2. **Expected**:
   - ✅ Amber warning banner appears
   - ✅ Message: "Chat memory limit reached. Your next message will start a fresh conversation."
   - ✅ Count shows: 5 of 5 messages

### Test Auto-Reset (6th Message)
1. Send 6th message
2. **Expected**:
   - ✅ Blue notification appears
   - ✅ Message: "💬 Started a fresh conversation to keep responses fast and relevant. Previous chat memory has been cleared."
   - ✅ Count resets to: 1 of 5 messages
   - ✅ Previous messages are no longer visible
   - ✅ Notification auto-dismisses after 8 seconds

---

## Manual Reset Test

1. Send 2-3 messages
2. Click "New Chat" button
3. **Expected**:
   - ✅ All messages cleared
   - ✅ Count resets to: Ready
   - ✅ Welcome message appears
   - ✅ Sample questions are shown

---

## Error Handling Tests

### Test Network Error
1. Disconnect internet or block API endpoint
2. Send a message
3. **Expected**:
   - ✅ Red error banner appears
   - ✅ Clear error message displayed
   - ✅ Can dismiss error with X button

### Test Timeout
1. Send a message (if backend is slow)
2. **Expected**:
   - ✅ Appropriate error handling
   - ✅ User is informed of the issue

---

## Browser Console Test Commands

You can also run automated tests from the browser console:

```javascript
// Test a specific agent
window.runAgentTests("SUPERSTORE")
window.runAgentTests("MAKANA")
window.runAgentTests("CUMULUS")

// Test all agents sequentially
window.testAllAgents()
```

---

## Checklist for Each Agent

- [ ] All 3 initial questions receive responses
- [ ] All 3 follow-up questions receive responses
- [ ] Message count increments correctly (1→2→3→4→5)
- [ ] Warning appears at message 4
- [ ] Limit warning appears at message 5
- [ ] Auto-reset works at message 6 with notification
- [ ] Manual reset works via "New Chat" button
- [ ] Error messages display correctly
- [ ] Error messages can be dismissed
- [ ] No flickering during conversations
- [ ] UI remains responsive throughout

---

## Expected Results Summary

| Test | Expected Message Count | Expected Behavior |
|------|----------------------|-------------------|
| 1st question | 1 of 5 | Normal response |
| 1st follow-up | 2 of 5 | Continues conversation |
| 2nd question | 3 of 5 | Normal response |
| 2nd follow-up | 4 of 5 | Blue info banner shown |
| 3rd question | 5 of 5 | Amber warning banner shown |
| 3rd follow-up | 1 of 5 | Auto-reset, blue notification |

---

## Notes

- Each test should be run in isolation (reset between tests)
- Verify responses are relevant to the questions asked
- Check that the UI doesn't flicker or freeze
- Ensure error states are recoverable
- Test on both light and dark modes
- Test on different screen sizes if applicable
