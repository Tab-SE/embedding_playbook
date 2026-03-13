# Agent UI Enhancements

This document describes the enhanced UI components for the agent chat interface, including improved thinking indicators and automatic data visualizations.

## Features

### 1. Tableau Visualization Integration ⭐ NEW

Agents can now embed interactive Tableau dashboards directly in their responses!

#### Supported Formats
```markdown
[tableau:0XxHu000001Aj8UKAS]
[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Overview]
![Tableau](tableau:0XxHu000001Aj8UKAS:dashboard:Sales Dashboard)
```

#### Features
- **Full interactivity** - Filters, drill-downs, tooltips
- **Automatic authentication** - Uses user's Salesforce credentials
- **Fullscreen mode** - Expand to full screen
- **Download/Export** - Save visualizations
- **Responsive design** - Works on all devices
- **Loading states** - Smooth loading experience
- **Error handling** - Graceful fallbacks

#### When Agents Should Use
- User asks for "dashboard" or "visualization"
- Complex data requiring interactivity
- Trend analysis over time
- Multi-dimensional comparisons
- User wants to explore with filters

See [Tableau Integration Guide](./TABLEAU_INTEGRATION.md) for complete documentation.

---

### 2. Enhanced Thinking Indicators

Instead of simple gray dots, the agent now shows contextual progress indicators:

#### Status Types

- **`thinking`** (default) - General processing
- **`querying`** - Querying data sources
- **`analyzing`** - Analyzing results
- **`searching`** - Searching knowledge base
- **`generating`** - Generating response

#### Visual Elements

- Icon that matches the current status
- Color-coded indicators
- Animated progress bar
- Optional step descriptions

### 3. Automatic Data Visualization

Tables in agent responses are automatically detected and can be visualized as charts.

#### Supported Formats

- **Markdown tables** - Automatically detected from `| column | data |` format
- **Bar charts** - Numeric data visualized with animated bars
- **Interactive toggle** - Switch between chart and table views

#### Example

When the agent returns:

```markdown
| Region | Sales |
|--------|-------|
| West   | 739813 |
| East   | 691828 |
| South  | 391721 |
```

The UI automatically:
1. Detects it's a table with numeric data
2. Shows Chart/Table toggle buttons
3. Renders animated bar chart by default
4. Allows switching to table view

### 4. Image Support

Images in agent responses are enhanced with:

- **Zoom capability** - Click to view full size
- **Download button** - Save image locally
- **Open in new tab** - View original
- **Captions** - Display alt text as captions
- **Loading states** - Smooth loading experience

## Usage

### Basic Implementation

The enhancements are automatically applied to all agent messages. No changes needed to existing code - just upgrade and it works!

### Customizing Thinking Indicator

To show specific status based on agent events:

```jsx
import { AgentThinkingIndicator } from "@/components/Agent/ui";

// In your message component
<AgentThinkingIndicator
  status="querying"
  step="Fetching sales data from database..."
/>
```

### Manual Data Visualization

To manually render a chart:

```jsx
import { DataVisualization } from "@/components/Agent/ui";

const data = {
  headers: ['Region', 'Sales', 'Profit'],
  rows: [
    ['West', '739813', '123456'],
    ['East', '691828', '98765'],
  ]
};

<DataVisualization data={data} type="auto" />
```

### Adding Images

Agent responses can include images using markdown:

```markdown
![Sales Trend](https://example.com/chart.png)
```

Or programmatically:

```jsx
import { AgentImage } from "@/components/Agent/ui";

<AgentImage
  src="https://example.com/chart.png"
  alt="Sales Trend"
  caption="Monthly sales trends for Q1 2025"
/>
```

## Advanced Features

### Detecting Agent State from Streaming

You can enhance the thinking indicator by detecting agent state from LangGraph streaming events:

```jsx
// In your stream handler
const [agentStatus, setAgentStatus] = useState('thinking');

// Parse streaming events
if (event.type === 'tool_call') {
  setAgentStatus('querying');
} else if (event.type === 'analysis') {
  setAgentStatus('analyzing');
}

// Pass to component
<AgentThinkingIndicator status={agentStatus} />
```

### Custom Chart Types

To add pie charts, line charts, or other visualizations:

1. Extend `DataVisualization.jsx`
2. Add new chart type detection logic
3. Implement chart rendering with SVG or Canvas

### Adding Tableau Viz

To embed Tableau visualizations (like the ebikes demo):

```jsx
import { TableauEmbed } from '@salesforce/analytics-embedding-sdk';

// In your agent message parser
if (text.includes('tableau-viz:')) {
  const vizId = extractVizId(text);
  return <TableauEmbed vizId={vizId} />;
}
```

## Component API

### AgentThinkingIndicator

**Props:**
- `status` (string): Status type - `thinking`, `querying`, `analyzing`, `searching`, `generating`
- `step` (string, optional): Current step description

**Example:**
```jsx
<AgentThinkingIndicator
  status="analyzing"
  step="Processing 1,234 records..."
/>
```

### DataVisualization

**Props:**
- `data` (object or string): Table data as object or markdown string
- `type` (string): Visualization type - `auto`, `bar`, `table`

**Data Format:**
```javascript
{
  headers: ['Label', 'Value'],
  rows: [
    ['Item 1', '100'],
    ['Item 2', '200']
  ]
}
```

### AgentImage

**Props:**
- `src` (string): Image URL
- `alt` (string): Alt text
- `caption` (string, optional): Image caption

### EnhancedContent

**Props:**
- `text` (string): Markdown text that may contain tables, images, etc.

**Features:**
- Auto-detects tables and renders as DataVisualization
- Auto-detects images and renders with zoom/download
- Renders remaining text as markdown

## Performance Considerations

### Optimization

- Components are memoized to prevent unnecessary re-renders
- Images lazy load and show loading states
- Charts animate only once on initial render
- SVG charts are lightweight and performant

### Large Datasets

For tables with >100 rows:
- Consider pagination
- Add virtual scrolling
- Limit chart rendering to top N rows

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ IE11 (not supported)

## Accessibility

- All visualizations include ARIA labels
- Images have alt text
- Charts provide data table fallback
- Keyboard navigation supported

## Future Enhancements

### Planned Features

1. **Line Charts** - For time-series data
2. **Pie Charts** - For percentage breakdowns
3. **Interactive Charts** - Hover tooltips, click events
4. **Export Options** - Export charts as PNG/SVG
5. **Embedded Tableau Viz** - Direct Tableau embedding
6. **Real-time Updates** - Charts update as data streams in
7. **Custom Themes** - Match your brand colors

### Contributing

To add new chart types:

1. Edit `src/components/Agent/ui/DataVisualization.jsx`
2. Add detection logic in `isChartable()`
3. Add rendering component
4. Add toggle button option

## Examples

### Example 1: Tableau Dashboard Integration

**Agent Response:**
```markdown
Here's your comprehensive sales dashboard:

[tableau:0XxHu000001Aj8UKAS:dashboard:Sales Overview]

**What you'll see:**
- Regional sales breakdown
- Monthly trends with forecasting
- Top performing products
- Customer segment analysis

Use the filters to explore by region, time period, or product category.
```

**Renders As:**
- Tableau dashboard header with title and controls
- Fully interactive Tableau visualization
- Fullscreen, download, and external link buttons
- Smooth loading animation
- Authentication handled automatically

### Example 2: Sales by Region with Chart

**Agent Response:**
```markdown
Here are the sales by region:

| Region | Sales |
|--------|-------|
| West   | $739,813 |
| East   | $691,828 |
| Central| $503,170 |
| South  | $391,721 |

The West region leads with the highest sales.
```

**Renders As:**
- Bar chart with animated bars
- Toggle to switch to table view
- Markdown text above and below

### Example 3: Combined Response with Tableau and Tables

**Agent Response:**
```markdown
I've analyzed your regional sales performance:

**Summary Table:**

| Region  | Sales    | Growth | Rank |
|---------|----------|--------|------|
| West    | $739,813 | +12%   | 1st  |
| East    | $691,828 | +8%    | 2nd  |
| Central | $503,170 | +5%    | 3rd  |
| South   | $391,721 | +3%    | 4th  |

**Interactive Dashboard:**

[tableau:0XxHu000001Aj8UKAS:dashboard:Regional Performance]

**Key Insights:**
- West region leads with 12% growth
- All regions show positive trends
- Use the dashboard to:
  - Filter by product category
  - View monthly trends
  - Compare year-over-year
  - Drill into specific markets

Would you like to explore any specific region in more detail?
```

**Renders As:**
1. Text: "I've analyzed..."
2. Chart/Table: Regional sales with toggle
3. Text: "Interactive Dashboard:"
4. Tableau Viz: Fully interactive dashboard with controls
5. Text: "Key Insights..." with bullet points
6. Text: Follow-up question

### Example 4: Multi-Section Response

**Agent Response:**
```markdown
Analysis complete! Here's what I found:

![Trend Chart](https://example.com/trend.png)

Sales breakdown:

| Month | Sales |
|-------|-------|
| Jan   | 100K  |
| Feb   | 120K  |
| Mar   | 115K  |

Key insights:
- February showed the highest sales
- March had a slight decline
```

**Renders As:**
1. Text: "Analysis complete..."
2. Image: Trend chart (zoomable)
3. Text: "Sales breakdown:"
4. Chart/Table: Monthly sales data
5. Text: "Key insights..."

## Troubleshooting

### Charts Not Showing

1. Check table has numeric columns
2. Verify markdown table format is correct
3. Check browser console for errors

### Images Not Loading

1. Verify image URL is accessible
2. Check CORS headers if external image
3. Verify SSL certificate if HTTPS

### Performance Issues

1. Limit number of chart bars (<20 recommended)
2. Use pagination for large tables
3. Optimize image sizes before sending

## Support

For issues or questions:
1. Check this documentation
2. Review component source code
3. Check browser console for errors
4. Open an issue in the project repo

---

**Last Updated**: 2025
**Version**: 1.0.0
