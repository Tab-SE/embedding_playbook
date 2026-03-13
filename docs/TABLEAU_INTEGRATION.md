# Tableau Visualization Integration

## Overview

Agents can now embed Tableau dashboards and views directly in their responses. The UI will automatically detect Tableau references and render them as interactive visualizations.

## Supported Formats

### Format 1: Simple Bracket Notation (Recommended)
```markdown
[tableau:0XxHu000001Aj8UKAS]
```

### Format 2: With Type and Title
```markdown
[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Dashboard]
```

### Format 3: Markdown Image Style
```markdown
![Tableau](tableau:0XxHu000001Aj8UKAS:dashboard:Sales Overview)
```

### Format 4: HTML Comment (Hidden from markdown preview)
```markdown
<!-- tableau:0XxHu000001Aj8UKAS:dashboard:Sales Dashboard -->
```

## Syntax Breakdown

```
[tableau:{vizId}:{vizType}:{title}]
```

**Parameters:**
- `vizId` (required): Tableau visualization ID (e.g., `0XxHu000001Aj8UKAS`)
- `vizType` (optional): Type of visualization - `dashboard` or `view` (default: `dashboard`)
- `title` (optional): Display title (default: `Tableau Visualization`)

## Agent Response Examples

### Example 1: Basic Viz
```markdown
Here's the sales dashboard:

[tableau:0XxHu000001Aj8UKAS]

The data shows strong performance in Q4.
```

### Example 2: Multiple Viz
```markdown
Let me show you two key dashboards:

**Sales Overview:**
[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Overview]

**Regional Performance:**
[tableau:0XxHu000001Aj9VXYZ:dashboard:Regional Performance]

Both dashboards show positive trends.
```

### Example 3: Combined with Data Tables
```markdown
Here are the sales by region:

| Region | Sales    |
|--------|----------|
| West   | $739,813 |
| East   | $691,828 |

For detailed analysis, see the interactive dashboard:

[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Detail]
```

### Example 4: Embedded in Insights
```markdown
**Key Insights:**
- Q4 sales exceeded targets by 15%
- West region leads in growth
- Customer satisfaction improved

**Interactive Dashboard:**
[tableau:0XxHu000001Aj8UKAS:dashboard:Q4 Performance]

Click through the filters to explore different segments.
```

## Features

### Interactive Visualization
- Full Tableau interactivity (filters, drill-down, etc.)
- Responsive sizing
- Dark mode support

### Controls
- **Fullscreen** - Expand to full screen view
- **Download** - Export visualization
- **Open External** - Open in Tableau
- **Zoom** - Adjust view size

### Authentication
- Automatic authentication using user's Salesforce credentials
- Seamless SSO integration
- Handles token refresh

### Loading States
- Loading spinner while authentication in progress
- Loading animation while viz renders
- Error messages if viz fails to load

## Configuration

### Environment Variables Required

```env
NEXT_PUBLIC_SALESFORCE_ORG_URL=https://your-org.salesforce.com
```

### Session Requirements

User must be authenticated with Salesforce credentials. The component automatically:
1. Retrieves user's Salesforce username from session
2. Calls JWT auth endpoint
3. Initializes Analytics SDK with credentials
4. Renders the visualization

## How It Works

```
1. Agent includes [tableau:vizId] in response
   ↓
2. EnhancedContent parser detects Tableau reference
   ↓
3. TableauViz component is rendered
   ↓
4. Component authenticates user
   ↓
5. Analytics SDK initializes
   ↓
6. Tableau viz is embedded and interactive
```

## Agent Prompt Guidance

### For LangGraph Agents

Add this to your system prompt:

```
When showing dashboards or visualizations, use this format:
[tableau:{vizId}:dashboard:{Title}]

Example response:
"Based on the data, here's an interactive dashboard showing the trends:

[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Trends]

You can filter by region and time period using the controls."
```

### Detecting When to Show Tableau Viz

Agents should show Tableau viz when:
- User asks for "dashboard" or "visualization"
- Complex data that benefits from interactivity
- User wants to explore data with filters
- Showing trends over time
- Comparing multiple dimensions

## Viz ID Discovery

### Finding Viz IDs

**Method 1: From Salesforce URL**
```
https://your-org.salesforce.com/analytics/dashboard/0XxHu000001Aj8UKAS
                                                    ^^^^^^^^^^^^^^^^^^^^
                                                    This is the vizId
```

**Method 2: Via API**
Your agent can query available dashboards:
```javascript
// List available dashboards
const dashboards = await listAnalyticsDashboards();
dashboards.forEach(d => {
  console.log(`${d.name}: ${d.id}`);
});
```

**Method 3: From Agent Context**
Store common dashboard IDs in agent knowledge:
```json
{
  "dashboards": {
    "sales_overview": "0XxHu000001Aj8UKAS",
    "regional_performance": "0XxHu000001Aj9VXYZ",
    "customer_metrics": "0XxHu000001AjABCD"
  }
}
```

## Error Handling

### Common Errors and Solutions

**"Authentication failed"**
- Check user is signed in
- Verify SALESFORCE_ORG_URL is set
- Check JWT auth endpoint is working

**"Failed to load visualization"**
- Verify vizId is correct
- Check user has access to the viz
- Verify viz exists in Salesforce

**"Missing NEXT_PUBLIC_SALESFORCE_ORG_URL"**
- Add environment variable
- Restart development server

## Styling and Customization

### Height Customization

Default height is `500px`. To customize, modify the format:

```markdown
[tableau:vizId:dashboard:Title:600px]
```

Or programmatically:
```jsx
<TableauViz vizId="..." height="600px" />
```

### Fullscreen Mode

Users can click the fullscreen button to expand the viz. In fullscreen:
- Viz takes full screen
- Header controls remain accessible
- Click "✕" or fullscreen button to exit

### Mobile Responsive

- Automatically adjusts to mobile screens
- Touch-friendly controls
- Maintains aspect ratio

## Performance Considerations

### Loading Time
- First load: ~2-3 seconds (includes auth + SDK init)
- Subsequent loads: ~1-2 seconds (cached auth)
- Large dashboards: May take longer

### Optimization Tips
1. Pre-authenticate users before showing viz
2. Show loading indicators
3. Consider lazy loading for multiple viz
4. Cache viz instances when possible

## Accessibility

- ARIA labels on all controls
- Keyboard navigation supported
- Screen reader compatible
- High contrast mode support

## Testing

### Manual Test
```markdown
Agent: Here's the sales dashboard:

[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Overview]

Expected result:
- Auth happens automatically
- Loading spinner appears
- Dashboard renders
- Controls are accessible
- Fullscreen works
```

### Test Different States

**Loading:**
```
[Loading spinner]
Authenticating...
```

**Loaded:**
```
┌─ Sales Overview ─────────────────┐
│ [⛶] [↓] [↗]                     │
├──────────────────────────────────┤
│                                  │
│   [Interactive Tableau Dashboard] │
│                                  │
└──────────────────────────────────┘
```

**Error:**
```
┌─────────────────────────────────┐
│ ⚠ Failed to load visualization  │
│ Authentication failed            │
└─────────────────────────────────┘
```

## Advanced Usage

### Conditional Viz Display

```markdown
Based on your request:

${hasComplexData ?
  '[tableau:salesDashboard:dashboard:Sales Analysis]' :
  '| Region | Sales |\n|--------|-------|\n| West | $500K |'}
```

### Dynamic Viz Selection

```markdown
${regionSelected === 'West' ?
  '[tableau:westDashboard]' :
  '[tableau:eastDashboard]'}
```

### Multiple Viz Carousel

```markdown
Explore these dashboards:
1. [tableau:sales:dashboard:Sales]
2. [tableau:marketing:dashboard:Marketing]
3. [tableau:operations:dashboard:Operations]

Use the filters to compare metrics across departments.
```

## API Reference

### TableauViz Component

```jsx
import { TableauViz } from "@/components/Agent/ui";

<TableauViz
  vizId="0XxHu000001Aj8UKAS"    // Required
  vizType="dashboard"            // Optional: 'dashboard' | 'view'
  title="Sales Dashboard"        // Optional
  height="500px"                 // Optional
/>
```

### TableauVizCompact Component

Smaller version for inline display:

```jsx
import { TableauVizCompact } from "@/components/Agent/ui";

<TableauVizCompact
  vizId="0XxHu000001Aj8UKAS"
  title="Quick View"
/>
```

## Troubleshooting Checklist

- [ ] User is authenticated
- [ ] NEXT_PUBLIC_SALESFORCE_ORG_URL is set
- [ ] Viz ID is correct format
- [ ] User has permissions to view viz
- [ ] JWT auth endpoint is working
- [ ] Analytics SDK is installed
- [ ] Browser allows third-party cookies (if needed)
- [ ] CORS is properly configured

## Best Practices

1. **Always provide context** before showing a viz
2. **Use descriptive titles** for better UX
3. **Combine with text insights** for clarity
4. **Test viz IDs** before deploying
5. **Handle errors gracefully** with fallbacks
6. **Monitor loading times** and optimize
7. **Use appropriate viz type** (dashboard vs view)

## Future Enhancements

- [ ] Viz carousel for multiple dashboards
- [ ] Thumbnail previews
- [ ] Viz search/browse functionality
- [ ] Export to PDF/PNG
- [ ] Annotation tools
- [ ] Real-time collaboration
- [ ] Bookmarking and favorites

---

**For more information:**
- [Agent Enhancements](./AGENT_ENHANCEMENTS.md)
- [Enhancement Examples](./ENHANCEMENT_EXAMPLES.md)
- [Salesforce Analytics SDK Docs](https://developer.salesforce.com/docs/analytics/analytics-embedding-sdk/)
