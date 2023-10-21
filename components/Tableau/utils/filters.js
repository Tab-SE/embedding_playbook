const filter = async (vizObj, dashboard, worksheet) => {
  
  // Make the Overview dashboard the active sheet
  const dashboard = await vizObj.workbook.activateSheetAsync(dashboard);

  // Get the worksheet we want to use => TODO make this conditional on worksheet prop
  const worksheet = dashboard.worksheets.find((ws) => ws.name === worksheet);

  try {
    // More information: https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_filter.html
    const dashFilters = await dashboard.getFiltersAsync();
    console.log('Available dashboard filters:');
    console.log(dashFilters);
  
    // show # and names of categorical filters in the Console
    const categoricalFilters = dashFilters.filter((df) => df.filterType === FilterType.Categorical);
    console.log(categoricalFilters);
  
    console.log(`The number of categorical filters: ${categoricalFilters.length}
    Filters: ${categoricalFilters.map((s) => s.fieldName)}`);
  } catch (e) {
    console.error(e.toString());
  }
}

export default filter;
