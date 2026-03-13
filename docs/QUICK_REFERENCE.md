# Quick Reference Card - Agent Response Enhancements

## Tableau Visualizations

### Syntax
```markdown
[tableau:{vizId}:{vizType}:{title}]
```

### Examples
```markdown
[tableau:0XxHu000001Aj8UKAS]
[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Overview]
![Tableau](tableau:0XxHu000001Aj8UKAS:dashboard:Sales Dashboard)
```

### When to Use
- User asks for "dashboard" or "visualization"
- Complex data (>50 rows)
- Interactive filtering needed
- Trend analysis over time
- Multi-dimensional comparisons

---

## Data Tables with Auto-Charts

### Syntax
Just use markdown tables:
```markdown
| Column | Values |
|--------|--------|
| Item 1 | 100    |
| Item 2 | 200    |
```

### Result
- Automatically renders as bar chart
- User can toggle between chart/table
- Numeric columns detected automatically

---

## Images

### Syntax
```markdown
![Alt Text](https://example.com/image.png)
```

### Features
- Click to zoom
- Download button
- Open in new tab
- Loading states

---

## Thinking Indicators

### In Agent Code
```jsx
<AgentThinkingIndicator status="querying" />
<AgentThinkingIndicator status="analyzing" step="Processing 1,234 records" />
```

### Status Types
- `thinking` - Default
- `querying` - Database queries
- `analyzing` - Data analysis
- `searching` - Knowledge search
- `generating` - Response generation

---

## Complete Example Response

```markdown
I've analyzed your sales data:

**Summary:**
Sales increased 12% across all regions.

**Detailed Breakdown:**

| Region  | Sales    | Growth |
|---------|----------|--------|
| West    | $739,813 | +12%   |
| East    | $691,828 | +8%    |
| Central | $503,170 | +5%    |

**Interactive Dashboard:**

[tableau:0XxHu000001Aj8UKAS:dashboard:Regional Sales]

**Insights:**
- West region leads in growth
- All regions trending positive
- Use dashboard filters to explore by product

**Next Steps:**
Would you like me to analyze specific product categories?
```

---

## Response Template

```markdown
{Context about what you're showing}

{Data table or summary}

{Tableau viz if complex data}
[tableau:{vizId}:dashboard:{title}]

{Key insights and observations}

{Guidance on using the visualization}

{Follow-up questions or next steps}
```

---

## Viz ID Quick Reference

| Dashboard | Viz ID | Purpose |
|-----------|--------|---------|
| Sales Overview | 0XxHu000001Aj8UKAS | High-level sales metrics |
| Regional Performance | 0XxHu000001Aj9VXYZ | Geographic analysis |
| Customer Metrics | 0XxHu000001AjABCD | Customer insights |

---

## Error Handling

If viz fails to load, response should include:
```markdown
I attempted to show an interactive dashboard, but encountered an error.

Here's the data in table format instead:

| Column | Data |
|--------|------|
| ...    | ...  |

You can access the dashboard directly at:
[Link to Tableau]
```

---

## Mobile Considerations

- Keep viz titles short (<30 chars)
- Provide table view option
- Test on mobile before deploying
- Consider landscape orientation for complex dashboards

---

## Performance Tips

1. **Lazy load multiple viz** - Don't show all at once
2. **Use compact viz** for summaries
3. **Combine with static images** for previews
4. **Cache viz IDs** in agent memory
5. **Preload common dashboards**

---

## Testing Checklist

Before deploying agent responses:
- [ ] Viz ID is correct and accessible
- [ ] Context provided before viz
- [ ] Title is descriptive
- [ ] User guidance included
- [ ] Fallback for errors
- [ ] Works on mobile
- [ ] Loading states appropriate
- [ ] Auth handles gracefully

---

## Common Patterns

### Pattern 1: Table → Viz Upgrade
```markdown
Quick summary:
{table}

For detailed interactive analysis:
[tableau:vizId:dashboard:Title]
```

### Pattern 2: Multiple Viz Carousel
```markdown
Explore these views:
1. Overview: [tableau:viz1]
2. Detail: [tableau:viz2]
3. Trends: [tableau:viz3]
```

### Pattern 3: Contextual Viz
```markdown
{Analysis of the data}

{Tableau viz related to analysis}

{Additional insights from viz}
```

---

## Accessibility Notes

- Always provide alt text for images
- Include table view option for charts
- Describe what's in the visualization
- Support keyboard navigation
- Test with screen readers

---

**Full documentation:**
- [Tableau Integration](./TABLEAU_INTEGRATION.md)
- [Agent Prompts](./AGENT_PROMPTS_TABLEAU.md)
- [Agent Enhancements](./AGENT_ENHANCEMENTS.md)
