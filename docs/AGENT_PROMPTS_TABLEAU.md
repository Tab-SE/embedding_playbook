# Agent Prompt Examples for Tableau Integration

## System Prompt Addition

Add this to your agent's system prompt to enable Tableau viz in responses:

```markdown
## Tableau Visualization Capabilities

You can embed interactive Tableau dashboards in your responses using this syntax:
[tableau:{vizId}:{vizType}:{title}]

Available Dashboards:
- Sales Overview: 0XxHu000001Aj8UKAS
- Regional Performance: 0XxHu000001Aj9VXYZ
- Customer Metrics: 0XxHu000001AjABCD

When to use Tableau viz:
- User asks for "dashboard" or "visualization"
- Complex data requiring interactivity
- Trend analysis over time
- Multi-dimensional comparisons
- User wants to explore with filters

Always provide context before and after showing a viz.
```

## Example Agent Responses

### Example 1: Sales Question

**User:** "Show me the sales dashboard"

**Agent Response:**
```markdown
I'll show you our comprehensive sales dashboard with all key metrics:

[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Overview]

This dashboard includes:
- Total sales by region
- Monthly trends
- Top performing products
- Customer segments

You can use the filters to drill down by time period, region, or product category.
```

---

### Example 2: Regional Analysis

**User:** "What are the sales across each region?"

**Agent Response:**
```markdown
Here are the total sales across each region:

| Region  | Total Sales  | Growth |
|---------|--------------|--------|
| West    | $739,813.61  | +12%   |
| East    | $691,828.17  | +8%    |
| Central | $503,170.67  | +5%    |
| South   | $391,721.91  | +3%    |

For deeper analysis with interactive filtering, explore this dashboard:

[tableau:0XxHu000001Aj8UKAS:dashboard:Regional Sales Analysis]

**Key Insights:**
- West region leads with 12% growth
- All regions showing positive trends
- Use the dashboard filters to explore by product category or time period
```

---

### Example 3: Trend Analysis

**User:** "Show me sales trends over time"

**Agent Response:**
```markdown
I've prepared an interactive trend analysis showing sales patterns:

[tableau:0XxHu000001Aj9VXYZ:dashboard:Sales Trends]

**What to look for:**
- Seasonal patterns in Q4
- Growth acceleration since March
- Regional performance variations

Use the date range selector in the dashboard to focus on specific periods. The trend lines show both actual sales and projections.
```

---

### Example 4: Comparative Analysis

**User:** "Compare sales performance across product categories"

**Agent Response:**
```markdown
Let me show you a side-by-side comparison of product category performance:

[tableau:0XxHu000001AjABCD:dashboard:Category Performance]

**Quick Summary:**
- Technology: $839K (leading category)
- Furniture: $755K (steady growth)
- Office Supplies: $732K (consistent performer)

The dashboard allows you to:
- Compare categories across different regions
- View monthly trends
- Analyze profit margins
- Drill down to specific products

Try clicking on different categories to see detailed breakdowns.
```

---

### Example 5: Multiple Dashboards

**User:** "I need a complete business overview"

**Agent Response:**
```markdown
Here's a comprehensive business overview with three key dashboards:

**1. Sales Performance**
[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Overview]

**2. Regional Analysis**
[tableau:0XxHu000001Aj9VXYZ:dashboard:Regional Performance]

**3. Customer Insights**
[tableau:0XxHu000001AjABCD:dashboard:Customer Metrics]

Each dashboard is interactive and can be filtered independently. I recommend:
1. Start with Sales Overview for high-level metrics
2. Dive into Regional Analysis for geographic insights
3. Explore Customer Insights for behavior patterns

Let me know if you'd like me to explain any specific metric or trend you see in the dashboards.
```

---

### Example 6: Contextual Viz

**User:** "Why did sales drop in March?"

**Agent Response:**
```markdown
Let me investigate the March sales decline:

**Contributing Factors:**
1. Seasonal slowdown after Q1 peak
2. Supply chain disruptions affecting inventory
3. Regional variations (West maintained, South declined 15%)

Here's the detailed trend analysis:

[tableau:0XxHu000001Aj9VXYZ:dashboard:Monthly Trends]

In the dashboard:
- Look at the March data point (highlighted)
- Compare with previous March for year-over-year context
- Check regional breakdown using the Region filter
- Review product category performance in the bottom panel

**Recovery Actions:**
- Inventory levels normalized in April
- Promotions launched in underperforming regions
- Sales rebounded 8% in April

The dashboard shows we're back on track. Use the date slider to compare months.
```

---

### Example 7: Follow-up Questions

**User:** "What's our profit margin by category?"

**Agent:** *(Shows table)*

**User:** "Can I see this visually?"

**Agent Response:**
```markdown
Absolutely! Here's an interactive visualization of profit margins:

[tableau:0XxHu000001AjABCD:dashboard:Profit Margin Analysis]

This dashboard shows:
- Profit margin % by category (bar chart)
- Trend over time (line chart)
- Comparison to targets (gauge)
- Top and bottom performers (table)

**Quick Insights:**
- Technology: 17.4% margin (above target)
- Office Supplies: 17.2% margin (on target)
- Furniture: 2.6% margin (needs attention)

Use the filters to:
- View specific time periods
- Compare regions
- Drill into subcategories
- See product-level detail

Would you like me to analyze the low margin in Furniture category?
```

---

## Conditional Logic Examples

### Based on Data Complexity

```python
# In agent logic
if len(data_rows) > 100:
    # Show Tableau viz for complex data
    response = f"""
    Your data contains {len(data_rows)} records.
    Here's an interactive dashboard for better exploration:

    [tableau:{viz_id}:dashboard:{title}]
    """
else:
    # Show table for simple data
    response = create_markdown_table(data_rows)
```

### Based on User Request

```python
# In agent logic
if 'dashboard' in user_question.lower() or 'visual' in user_question.lower():
    # User explicitly wants visualization
    response = f"""
    Here's the interactive dashboard:
    [tableau:{viz_id}:dashboard:{title}]
    """
elif 'quick' in user_question.lower() or 'summary' in user_question.lower():
    # User wants quick answer, show table
    response = create_summary_table(data)
```

### Based on Follow-up Context

```python
# In agent logic with conversation history
if previous_response_had_table and user_says_wants_more_detail:
    # Upgrade from table to dashboard
    response = f"""
    For a more detailed interactive view:
    [tableau:{viz_id}:dashboard:{title}]

    This expands on the table with filters and drill-downs.
    """
```

---

## LangGraph Tool Definition

```python
from langchain.tools import tool

@tool
def show_tableau_dashboard(viz_id: str, title: str = "Dashboard") -> str:
    """
    Embed a Tableau dashboard in the response.

    Args:
        viz_id: Salesforce analytics dashboard ID
        title: Display title for the dashboard

    Returns:
        Formatted string for embedding the dashboard
    """
    return f"[tableau:{viz_id}:dashboard:{title}]"

# Usage in agent
viz_string = show_tableau_dashboard(
    viz_id="0XxHu000001Aj8UKAS",
    title="Sales Overview"
)
```

---

## Complete Agent Example

```python
class SalesAnalysisAgent:
    def __init__(self):
        self.viz_ids = {
            'sales_overview': '0XxHu000001Aj8UKAS',
            'regional_performance': '0XxHu000001Aj9VXYZ',
            'customer_metrics': '0XxHu000001AjABCD'
        }

    def respond_to_query(self, user_query: str) -> str:
        # Detect intent
        intent = self.detect_intent(user_query)

        if intent == 'show_dashboard':
            return self.format_dashboard_response(user_query)
        elif intent == 'analyze_sales':
            return self.format_analysis_with_viz(user_query)
        else:
            return self.format_text_response(user_query)

    def format_dashboard_response(self, query: str) -> str:
        # Determine which dashboard to show
        dashboard_type = self.determine_dashboard_type(query)
        viz_id = self.viz_ids.get(dashboard_type)

        return f"""
        Here's the {dashboard_type.replace('_', ' ').title()}:

        [tableau:{viz_id}:dashboard:{dashboard_type.replace('_', ' ').title()}]

        This dashboard includes interactive filters and drill-down capabilities.
        Let me know if you'd like me to explain any specific metric.
        """

    def format_analysis_with_viz(self, query: str) -> str:
        # Get data analysis
        analysis = self.analyze_data(query)

        # Format with viz
        return f"""
        {analysis['summary']}

        {analysis['data_table']}

        For interactive exploration:
        [tableau:{analysis['relevant_viz_id']}:dashboard:{analysis['viz_title']}]

        {analysis['recommendations']}
        """
```

---

## Best Practices for Agent Prompts

### 1. Always Provide Context
❌ **Bad:**
```
[tableau:0XxHu000001Aj8UKAS]
```

✅ **Good:**
```
Here's the sales dashboard showing Q4 performance:

[tableau:0XxHu000001Aj8UKAS:dashboard:Q4 Sales]

The dashboard includes regional breakdowns and product category analysis.
```

### 2. Explain What Users Will See
❌ **Bad:**
```
Check out the dashboard.
[tableau:0XxHu000001Aj8UKAS]
```

✅ **Good:**
```
This dashboard shows:
- Monthly sales trends
- Regional performance
- Top products
- Customer segments

[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Analysis]

Use the date filter to focus on specific periods.
```

### 3. Combine Insights with Visualization
❌ **Bad:**
```
[tableau:0XxHu000001Aj8UKAS]
```

✅ **Good:**
```
Sales increased 12% in Q4, driven by strong performance in the West region.

[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Trends]

The dashboard highlights:
- West region: +12% growth
- Technology category leading
- Holiday season spike in December
```

### 4. Guide User Interaction
❌ **Bad:**
```
Here's the data.
[tableau:0XxHu000001Aj8UKAS]
```

✅ **Good:**
```
Here's an interactive analysis:

[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Analysis]

**How to explore:**
1. Use Region filter to compare areas
2. Click on bars to drill down
3. Adjust date range for trends
4. Hover for detailed tooltips
```

---

## Testing Your Agent

### Test Checklist

- [ ] Viz syntax is correct
- [ ] Viz ID exists and is accessible
- [ ] Context is provided before viz
- [ ] Title is descriptive
- [ ] Instructions for interaction
- [ ] Fallback for auth errors
- [ ] Works on mobile
- [ ] Loading states shown
- [ ] Multiple viz don't conflict

### Test Prompts

```
1. "Show me the sales dashboard"
2. "I need a visualization of regional performance"
3. "Can you show this data in a dashboard?"
4. "What does the customer metrics dashboard show?"
5. "Give me an interactive view of the data"
```

Expected: All should include Tableau viz with proper context.

---

**For implementation details, see:** [TABLEAU_INTEGRATION.md](./TABLEAU_INTEGRATION.md)
