# Tableau Data Translation API

This API provides comprehensive translation capabilities for all Tableau data including metrics, dashboards, worksheets, filters, and mark selections.

## 🚀 Quick Start

```jsx
import { useTableauTranslation } from '@/hooks/useTableauTranslation';

const MyComponent = () => {
  const { translateMetric, translateDashboard, translateMarks } = useTableauTranslation();

  // Translate any Tableau data
  const translatedMetric = translateMetric(metricData);
  const translatedDashboard = translateDashboard(dashboardData);
  const translatedMarks = translateMarks(markData);

  return <div>{translatedMetric.name}</div>;
};
```

## 📚 Available Translation Functions

### Core Translation Functions

| Function | Description | Input | Output |
|----------|-------------|-------|--------|
| `translateData(data, dataType)` | Translate any Tableau data | `object`, `string` | `object` |
| `translateMetric(metricData)` | Translate metric data | `object` | `object` |
| `translateDashboard(dashboardData)` | Translate dashboard data | `object` | `object` |
| `translateWorksheet(worksheetData)` | Translate worksheet data | `object` | `object` |
| `translateFilter(filterData)` | Translate filter data | `object` | `object` |
| `translateMarks(markData)` | Translate mark selection data | `object` | `object` |
| `translateDataArray(dataArray, dataType)` | Translate array of data | `Array`, `string` | `Array` |

### Utility Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `getCurrentLanguage()` | Get current language code | `string` |
| `hasTranslation(text)` | Check if text has translation | `boolean` |
| `translations` | Direct access to translations | `object` |
| `language` | Current language code | `string` |

## 🌍 Supported Languages

- **🇺🇸 English** (default)
- **🇪🇸 Spanish** (Español)
- **🇫🇷 French** (Français)

## 📊 Supported Data Types

### 1. Metrics
```jsx
const { translateMetric } = useTableauTranslation();

const metricData = {
  name: "Total Contractors",
  displayName: "Total Contractors",
  description: "Number of active contractors",
  value: 150,
  units: "contractors"
};

const translatedMetric = translateMetric(metricData);
// Result: { name: "Total de Contratistas", displayName: "Total de Contratistas", ... }
```

### 2. Dashboards
```jsx
const { translateDashboard } = useTableauTranslation();

const dashboardData = {
  title: "Safety Overview",
  description: "Monitor safety compliance",
  worksheets: [...]
};

const translatedDashboard = translateDashboard(dashboardData);
```

### 3. Worksheets
```jsx
const { translateWorksheet } = useTableauTranslation();

const worksheetData = {
  name: "Safety Incidents",
  title: "Safety Incidents Analysis",
  columns: [
    { fieldName: "Incident Type", displayName: "Incident Type" },
    { fieldName: "Severity", displayName: "Severity" }
  ]
};

const translatedWorksheet = translateWorksheet(worksheetData);
```

### 4. Filters
```jsx
const { translateFilter } = useTableauTranslation();

const filterData = {
  fieldName: "Insurance Status",
  displayName: "Insurance Status",
  values: ["Active", "Expired", "Pending"],
  options: ["All", "Active", "Expired", "Pending"]
};

const translatedFilter = translateFilter(filterData);
```

### 5. Mark Selections
```jsx
const { translateMarks } = useTableauTranslation();

const markData = {
  columns: [
    { fieldName: "Contractor Name", displayName: "Contractor Name" },
    { fieldName: "Risk Level", displayName: "Risk Level" }
  ],
  data: [
    ["ABC Corp", "High Risk"],
    ["XYZ Ltd", "Low Risk"]
  ]
};

const translatedMarks = translateMarks(markData);
```

## 🔧 Advanced Usage

### Batch Translation
```jsx
const { translateDataArray } = useTableauTranslation();

const metrics = [
  { name: "Total Contractors", value: 150 },
  { name: "Safety Incidents", value: 5 },
  { name: "Compliance Rate", value: 95 }
];

const translatedMetrics = translateDataArray(metrics, 'metric');
```

### Conditional Translation
```jsx
const { hasTranslation, translateMetric } = useTableauTranslation();

const processMetric = (metric) => {
  if (hasTranslation(metric.name)) {
    return translateMetric(metric);
  }
  return metric; // Use original if no translation
};
```

### Language-Specific Logic
```jsx
const { getCurrentLanguage, translateMetric } = useTableauTranslation();

const processData = (data) => {
  const language = getCurrentLanguage();

  if (language === 'es') {
    // Spanish-specific processing
    return translateMetric(data);
  } else if (language === 'fr') {
    // French-specific processing
    return translateMetric(data);
  }

  return data;
};
```

## 📝 Adding New Translations

### 1. Update Language Context
Add new metric names to `src/contexts/LanguageContext.jsx`:

```jsx
metrics: {
  "New Metric Name": "New Metric Name",
  "Another Metric": "Another Metric",
  // ... existing translations
}
```

### 2. Add Translations for All Languages
```jsx
// English
"New Metric Name": "New Metric Name",

// Spanish
"New Metric Name": "Nuevo Nombre de Métrica",

// French
"New Metric Name": "Nouveau Nom de Métrique",
```

### 3. Use in Components
```jsx
const { translateMetric } = useTableauTranslation();
const translatedMetric = translateMetric(metricData);
```

## 🎯 Common Use Cases

### 1. Tableau Dashboard Integration
```jsx
const Dashboard = () => {
  const { translateDashboard } = useTableauTranslation();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Fetch dashboard data from Tableau
    fetchDashboardData().then(data => {
      const translated = translateDashboard(data);
      setDashboardData(translated);
    });
  }, []);

  return <div>{dashboardData?.title}</div>;
};
```

### 2. Dynamic Filter Translation
```jsx
const FilterComponent = ({ filterData }) => {
  const { translateFilter } = useTableauTranslation();
  const translatedFilter = translateFilter(filterData);

  return (
    <select>
      {translatedFilter.options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
};
```

### 3. Mark Selection Translation
```jsx
const MarkSelectionHandler = ({ marksData }) => {
  const { translateMarks } = useTableauTranslation();
  const translatedMarks = translateMarks(marksData);

  // Process translated mark data
  translatedMarks.data.forEach(row => {
    console.log('Translated row:', row);
  });
};
```

## 🔍 Debugging

### Check Available Translations
```jsx
const { translations, hasTranslation } = useTableauTranslation();

console.log('Available metrics:', translations.metrics);
console.log('Has translation for "Total Contractors":', hasTranslation("Total Contractors"));
```

### Verify Translation Results
```jsx
const { translateMetric, getCurrentLanguage } = useTableauTranslation();

const originalMetric = { name: "Total Contractors" };
const translatedMetric = translateMetric(originalMetric);

console.log('Language:', getCurrentLanguage());
console.log('Original:', originalMetric.name);
console.log('Translated:', translatedMetric.name);
```

## ⚡ Performance Tips

1. **Memoize translations** for large datasets
2. **Use batch translation** for arrays
3. **Check for translations** before processing
4. **Cache translated data** when possible

```jsx
const { translateDataArray } = useTableauTranslation();

// Good: Batch translate
const translatedData = useMemo(() =>
  translateDataArray(largeDataset, 'metric'),
  [largeDataset]
);

// Avoid: Individual translations in loops
largeDataset.forEach(item => translateMetric(item)); // ❌
```

## 🚀 Integration Examples

### With Tableau Embedding API
```jsx
const TableauViz = () => {
  const { translateMarks } = useTableauTranslation();

  useEffect(() => {
    const viz = document.getElementById('tableau-viz');

    viz.addEventListener('markselectionchanged', (event) => {
      event.detail.getMarksAsync().then(marks => {
        const translatedMarks = translateMarks(marks);
        console.log('Translated marks:', translatedMarks);
      });
    });
  }, []);

  return <div id="tableau-viz" />;
};
```

### With React State
```jsx
const MetricsDashboard = () => {
  const { translateMetric } = useTableauTranslation();
  const [metrics, setMetrics] = useState([]);

  const loadMetrics = async () => {
    const data = await fetchMetrics();
    const translated = data.map(metric => translateMetric(metric));
    setMetrics(translated);
  };

  return (
    <div>
      {metrics.map(metric => (
        <div key={metric.id}>{metric.name}</div>
      ))}
    </div>
  );
};
```

This API provides a complete solution for translating all Tableau data in your application! 🎯
