## Tableau Pulse Dashboard Extension

Want to show Pulse embedded in Dashboards? With insights (in the same or a separate pop-up)? You’ve come to the right place!

### About this extension

This extension is created by Russ Goldin. Callouts to Pablo Saenz de Tejada for creating a Pulse embedded demo and Stephen Price for his extensive Embedding Playbook. The current extension pulls from both of these but is now written on the same codebase as the embedding playbook.

There are many enhancements that can be added to the extension. It’s currently at an MVP level. Please test it out and provide feedback.

### Instructions

1. Download the trex file: [PulseDashboardExtension.trex](https://raw.githubusercontent.com/tagyoureit/embedding_playbook/main/public/PulseDashboardExtension.trex)
2. Add the Extension to your dashboard and configure it
3. (Optional) Add a 2nd instance of the extension for a pop-up experience (link).

### Overview Video

Last update 2025.01.06

### Update Video

Dashboard filters/pulse filter video

Video of basic extension and companion mode.

### Single extension setup instructions

1. Add an Extension Object to the Dashboard
2. Choose the TREX through “Access Local Extensions”
3. Allow the Extension to load
4. The Configure dialog box will automatically open
  - “Load Sample Values” will populate the values for my (Russ Goldin’s) Tableau Cloud beta site
  - You can connect to any Tableau Cloud site by creating a Connected App with Direct Trust.
  - Login will validate the connection is successful.
  - Wait for the metric count to return (it will change from 0 to the # of metrics that are loaded).
  - Logout will reset the query and data cache.
  - A successful login will show the number of metrics the user subscribes to.
5. You can select which metrics to hide/show in the Metrics tab, and re-arrange them with the drag handles.
6. The Style tab has the following options:
  - Metric UI display style
    - Carousel - a horizontally scrollable layout
    - Single Pane - non-scrollable, multi-line layout
    - Salesforce - mimics a SF record page
    - Tableau - closely resembles the OOTB style
  - Show Pulse Anchor Chart - Includes the chart in the metric display
  - Show Pulse Top Insight - Includes the highest rank insight
  - Filters display location - show selected filters at the top or bottom of the metric
  - Show Pulse Filters - Display filters below each metric that are associated with each metric
    - These filters do not change the dashboard filters. See Filtering.
  - Filter Display Location - Top/bottom. Top more closely resembles OOTB Pulse style, bottom is a slight variation.
  - Metric UI display style
    - Primary comparison with indicator - only show the primary comparison
    - Both comparisons with indicator - show both
    - Text based - Show text for comparisons (closest to OOTB Pulse style)
7. Interactivity
  - Companion Mode - see Pop-up Insights Experience
    - None - Insights will pop-up in the same iFrame as the extension
    - Source - Insights will not show up in this extension. MetricId parameter will be set.
    - Source (with a pop-up window) - Insights will pop-up in a new browser window.
      - Will not work with Desktop (because the browser won’t have the authentication)
      - Useful for Salesforce embedding where there may not be enough real estate for the insights to show within the page.
    - Target - This extension will only show the insights when the metricId parameter is populated.
  - Fonts
    - Apply buttons - Will load the Tableau Dashboard font styles, or you can select from pre-defined styles for the metric.
    - Google Font
      - Font Name - A font name as found at [Google Fonts](https://fonts.google.com/).
      - Font Weight - A value 100-900 for the thickness of the font
      - This will only load the font and make it available for the page. You need to specify the font name in one or more of the below sections if you want to use it.
    - Title Font - Change the title font
    - BAN - Font for the Big a$$ number
    - Text - Remaining font on the page
    - If the font family has spaces, specify them like 'Tableau Book','Tableau',Arial,sans-serif.
  - Color
    - These are pretty self-explanatory for the Sentiment and Background colors.
    - The charts have many options, and the following shows most of them:
5. When you ‘Close and Save’ the extension, it will load the metrics and show them in the selected UI style.
  - You can scroll through the carousel by clicking on the right/left arrows, or click/drag the metrics.
  - Clicking on the Insights banner will show a pop-up in the same dashboard extension frame.
  - The insights carousel can also be scrolled left/right with the arrows or by dragging.

### Pop-up Insights Experience

This adds a second instance of the same Pulse Dashboard Extension. It splits the metrics carousel into the SOURCE extension and the insights carousel into the TARGET extension. It is highly recommended to use show/hide for the insights carousel but I’m looking forward to your creative solutions.

#### Primary Extension

1. Follow the Single extension setup instructions.
2. Go to any sheet/dashboard and create a Parameter called MetricId of type string.
  - Note: The name of the parameter is currently fixed, but could be made into a user configurable option later.
3. Create a Calculated Field with the formula `[MetricId] != ''`.
  - Note: The name of this field doesn’t matter, but we will use this for Dynamic Visibility on the dashboard.
4. Return to your initial Pulse Dashboard Extension and open the Configure dialog.
5. Select the Options tab and change the companion mode to Source.

#### Second Extension

1. Add a second Extension Object onto the dashboard.
  - Pro-tip: Shift-click and drag the Extension onto the dashboard to quickly set it to Floating. Otherwise, you will want to set it to floating after you configure it for an ideal user experience.
2. There is a small issue I’m trying to track down where the login from the first extension is passed to the second extension. To remedy this, click Logout and Load Sample Values (or enter your specific connection information).
3. Navigate to the Options tab and select Target.
4. Click Close and Save.
5. With the Target extension selected, select the Layout tab (on the dashboard), enable Control visibility using value and select the Calculated Field that you created in Step 3.
6. The configuration should be done at this point. It should function like the video above. Click any Insights banner in the metric in the Source extension and it should load in the Target extension.

### Filtering

There are two options for filtering Pulse Metrics.

1. Set Pulse metric filters based on dashboard filters
2. Show each metric’s filter below the metric

#### Set Pulse metric filters based on dashboard filters

**Set up:**

This is the default option. If you see the Pulse filters below each metric, open the Configure dialog and uncheck the “Show Pulse Filters” checkbox.

**Usage:**

Use your dashboard filters naturally, and the matching filters in Pulse will be applied.

**Technical notes:**

- Filters will be applied if they match both the filter name and the filter values. This acts like “Apply to worksheets → All using related datasources” dashboard filter option.
- If you do enable the “Show Pulse Filters” option, whichever filters are selected last will be applied. In other words, if you select a Pulse filter then the Pulse filters will be applied; if you change a dashboard filter the dashboard filters will overwrite the individual Pulse Metric filters.

#### Set Pulse Filters based on Individual Metric filters

**Set up:**

Enable the individual Pulse metric filters by enabling the “Show Pulse Filters” checkbox in the Configure pop up.

**Usage:**

Use the dropdown to select the filters.

**Technical Notes:**

- This acts differently from the dashboard filters in that this works like “Apply to worksheets → All using this datasource”. In other words, it will not filter Region if it exists on other data sources.
- With the “Show Pulse Filters” option enabled, whichever filters are selected last will be applied. In other words, if you select a Pulse filter then the Pulse filters will be applied; if you change a dashboard filter the dashboard filters will overwrite the individual Pulse Metric filters.

### Troubleshooting

1. If the Insights carousel does not pop up, you can add the MetricId parameter onto the dashboard and see if it changes when you select the metric.
2. If there are errors in the Target extension, or the Source doesn’t load properly, or you created the parameter after the extensions were added you may need to reload each extension.

### Future Enhancements

Please add your suggestions/comments/etc here.

| Name           | Feature           | Description                                                                 |
|----------------|-------------------|-----------------------------------------------------------------------------|
| Kiyoshi Jones  | Overall Framework | Great job Russ! This is fantastic to showcase what's possible! I followed your instructions and was able to get things working very quickly. I especially like your Load Sample Values feature! |

### Known Issues

Please add any issues you encounter here.

| Name         | Issue                                             | Steps to reproduce | Image (use Insert->Image in the menu) | Status     |
|--------------|---------------------------------------------------|--------------------|---------------------------------------|------------|
| Marc Psaila  | Need to be connected to Zscaler to be able to configure the extension |                    |                                       | Completed  |lse Dashboard Extension

Want to show Pulse embedded in Dashboards?  With insights (in the same or a separate pop-up)?  You’ve come to the right place!


About this extension

This extension is created by Russ Goldin.  Callouts to Pablo Saenz de Tejada for creating an Pulse embedded demo and Stephen Price for his extensive Embedding Playbook.  The current extension pulls from both of these but is now written on the same codebase as the embedding playbook.

There are many enhancements that can be added to the extension.  It’s currently at an MVP level.  Please test it out and provide feedback.

Instructions

1. Download the trex file
    PulseDashboardExtension.trex
2. Add the Extension to your dashboard and configure it
3. (Optional) Add a 2nd instance of the extension for a pop-up experience (link).



Overview Video

Last update 2025.01.06

Update Video

Dashboard filters/pulse filter video

Video of basic extension and companion mode.

Single extension setup instructions

1. Add an Extension Object to the Dashboard
2. Choose the TREX through “Access Local Extensions”

3. Allow the Extension to load

4. The Configure dialog box will automatically open

        1. “Load Sample Values” will populate the values for my (Russ Goldin’s) Tableau Cloud beta site
        2. You can connect to any Tableau Cloud site by creating a Connected App with Direct Trust.
    2. Login will validate the connection is successful.
    3. Wait for the metric count to return (it will change from 0 to the # of metrics that are loaded).
    4. Logout will reset the query and data cache.
    5. A successful login will show the number of metrics the user subscribes to.

    6. You can select which metrics to hide/show in the Metrics tab, and re-arrange them with the drag handles .


    7. The Style tab has the following options:
        1. Metric UI display style
            1. Carousel - a horizontally scrollable layout
            2. Single Pane - non-scrollable, multi line layout
            3. Salesforce - mimics a SF record page
            4. Tableau - closely resembles the OOTB style
        2. Show Pulse Anchor Chart - Includes the chart in the metric display
        3. Show Pulse Top Insight - Includes the highest rank insight
        4. Filters display location - show selected filters at the top or bottom of the metric
        5. Show Pulse Filters - Display filters below each metric that are associated with each metric
            1. These filters do not change the dashboard filters.  See Filtering.
        6. Filter Display Location - Top/bottom.  Top more closely resembles OOTB Pulse style, bottom is a slight variation.
        7. Metric UI display style -
            1. Primary comparison with indicator - only show the primary comparison
            2. Both comparisons with indicator - show both
            3. Text based - Show text for comparisons (closest to OOTB Pulse style)
        8.
    8. Interactivity
        1. Companion Mode - see Pop-up Insights Experience
            1. None - Insights will pop-up in the same iFrame as the extension
            2. Source - Insights will not show up in this extension.  MetricId parameter will be set.
            3. Source (with a pop-up window) - Insights will pop-up in a new browser window.
                1. Will not work with Desktop (because the browser won’t have the authentication)
                2. Useful for Salesforce embedding where there may not be enough real estate for the insights to show within the page.
                3. Target - This extension will only show the insights when the metricId parameter is populated.
            4.
        2. Fonts
            1. Apply buttons - Will load the Tableau Dashboard font styles, or you can select from pre-defined styles for the metric.
            2. Google Font
                1. Font Name - A font name as found at https://fonts.google.com/.
                2. Font Weight - A value 100-900 for the thickness of the font
                3. This will only load the font and make it available for the page.  You need to specify the font name in one or more of the below sections if you want to use it.
            3. Title Font - Change the title font
            4. BAN - Font for the Big a$$ number
            5. Text - Remaining font on the page
            6. If the font family has spaces, specify them like 'Tableau Book','Tableau',Arial,sans-serif.
        3. Color
            1. These are pretty self explanatory for the Sentiment and Background colors.
            2. The charts have many options, and the following shows most of them:

5. When you ‘Close and Save’ the extension, it will load the metrics and show them in the select UI style.
    1.
    2. You can scroll through the carousel by clicking on the right/left arrows, or click/drag the metrics.
    3. Clicking on the Insights banner will show a pop-up in the same dashboard extension frame.
        1.
        2. The insights carousel can also be scrolled left/right with the arrows or by dragging.



Pop-up Insights Experience

This adds a second instance of the same Pulse Dashboard Extension.  It splits the metrics carousel into the SOURCE extension and the insights carousel into the TARGET extension.  It is highly recommended to use show/hide for the insights carousel but I’m looking forward to your creative solutions.


Primary Extension

1. Follow the Single extension setup instructions.
2. Go to any sheet/dashboard and create a Parameter called MetricId of type string.
    1. Note: The name of the parameter is currently fixed, but could be made into a user configurable option later.
    2.
3. Create a Calculated Field with the formula [MetricId] != ''.
    1. Note: The name of this field doesn’t matter, but we will use this for Dynamic Visibility on the dashboard.
    2.
4. Return to your initial Pulse Dashboard Extension and open the Configure dialog.
    1.
5. Select the Options tab and change the companion mode to Source
    1.

Second Extension

1. Add a second Extension Object onto the dashboard.
    1. Pro-tip: Shift-click and drag the Extension onto the dashboard to quickly set it to Floating.  Otherwise, you will want to set it to floating after you configure it for an ideal user experience.
2. There is a small issue I’m trying to track down where the login from the first extension is passed to the second extension.  To remedy this, click Logout and Load Sample Values (or enter your specific connection information).
    1.
3. Navigate to the Options tab and select Target.
    1.
4. Click Close and Save .
5. With the Target extension selected,  select the Layout tab (on the dashboard), enable Control visibility using value and select the Calculated Field that you created in Step 3.
    1.
6. The configuration should be done at this point.  It should function like the video above.  Click any Insights banner in the metric in the Source extension and it should load in the Target extension.



Filtering

There are two options for filtering Pulse Metrics.

1. Set Pulse metric filters based on dashboard filters
2. Show each metric’s filter below the metric



Set Pulse metric filters based on dashboard filters

Set up:

This is the default option.  If you see the Pulse filters below each metric, open the Configure dialog and uncheck the “Show Pulse Filters” checkbox.



Usage:

Use your dashboard filters naturally, and the matching filters in Pulse will be applied.

Technical notes:

* Filters will be applied if they match both the filter name and the filter values.  This acts like “Apply to worksheets → All using related datasources” dashboard filter option.
* If you do enable the “Show Pulse Filters” option, whichever filters are selected last will be applied.  In other words, if you select a Pulse filter than the Pulse filters will be applied; if you change a dashboard filter the dashboard filters will overwrite the individual Pulse Metric filters.

Set Pulse Filters based on Individual Metric filters

Set up:

Enable the individual Pulse metric filters by enabling the “Show Pulse Filters” checkbox in the Configure pop up.


Usage:

Use the dropdown to select the filters.


Technical Notes:

* This acts differently from the dashboard filters in that this works like “Apply to worksheets → All using this datasource”.  In other words, it will not filter Region if it exists on other data sources.
* With the “Show Pulse Filters” option enabled, whichever filters are selected last will be applied.  In other words, if you select a Pulse filter than the Pulse filters will be applied; if you change a dashboard filter the dashboard filters will overwrite the individual Pulse Metric filters.

Troubleshooting

1. If the Insights carousel does not pop up, you can add the MetricId parameter on to the dashboard and see if it changes when you select the metric.
    1.
2. If there are errors in the Target extension, or the Source doesn’t load properly, or you created the parameter after the extensions were added you may need to reload each extension.
    1.
    2.





## Tableau Pulse Dashboard Extension

Want to show Pulse embedded in Dashboards? With insights (in the same or a separate pop-up)? You’ve come to the right place!

### About this extension

This extension is created by Russ Goldin. Callouts to Pablo Saenz de Tejada for creating a Pulse embedded demo and Stephen Price for his extensive Embedding Playbook. The current extension pulls from both of these but is now written on the same codebase as the embedding playbook.

There are many enhancements that can be added to the extension. It’s currently at an MVP level. Please test it out and provide feedback.

### Release Notes

- **Aug 16** - Addition of Pulse metric filters (with each metric), or sync filters to dashboard filters
- **July 11** - Initial release. Includes pulse metrics and companion mode.

### Instructions

1. Download the trex file: `PulseDashboardExtension.trex`
2. Add the Extension to your dashboard and configure it
3. (Optional) Add a 2nd instance of the extension for a pop-up experience (link).

### Overview Video

Last update 2025.01.06

### Update Video

Dashboard filters/pulse filter video

Video of basic extension and companion mode.

### Single extension setup instructions

1. Add an Extension Object to the Dashboard
2. Choose the TREX through “Access Local Extensions”
3. Allow the Extension to load
4. The Configure dialog box will automatically open
  - “Load Sample Values” will populate the values for my (Russ Goldin’s) Tableau Cloud beta site
  - You can connect to any Tableau Cloud site by creating a Connected App with Direct Trust.
  - Login will validate the connection is successful.
  - Wait for the metric count to return (it will change from 0 to the # of metrics that are loaded).
  - Logout will reset the query and data cache.
  - A successful login will show the number of metrics the user subscribes to.
5. You can select which metrics to hide/show in the Metrics tab, and re-arrange them with the drag handles.
6. The Style tab has the following options:
  - Metric UI display style
    - Carousel - a horizontally scrollable layout
    - Single Pane - non-scrollable, multi-line layout
    - Salesforce - mimics a SF record page
    - Tableau - closely resembles the OOTB style
  - Show Pulse Anchor Chart - Includes the chart in the metric display
  - Show Pulse Top Insight - Includes the highest rank insight
  - Filters display location - show selected filters at the top or bottom of the metric
  - Show Pulse Filters - Display filters below each metric that are associated with each metric
    - These filters do not change the dashboard filters. See Filtering.
  - Filter Display Location - Top/bottom. Top more closely resembles OOTB Pulse style, bottom is a slight variation.
  - Metric UI display style
    - Primary comparison with indicator - only show the primary comparison
    - Both comparisons with indicator - show both
    - Text based - Show text for comparisons (closest to OOTB Pulse style)
7. Interactivity
  - Companion Mode - see Pop-up Insights Experience
    - None - Insights will pop-up in the same iFrame as the extension
    - Source - Insights will not show up in this extension. MetricId parameter will be set.
    - Source (with a pop-up window) - Insights will pop-up in a new browser window.
      - Will not work with Desktop (because the browser won’t have the authentication)
      - Useful for Salesforce embedding where there may not be enough real estate for the insights to show within the page.
    - Target - This extension will only show the insights when the metricId parameter is populated.
  - Fonts
    - Apply buttons - Will load the Tableau Dashboard font styles, or you can select from pre-defined styles for the metric.
    - Google Font
      - Font Name - A font name as found at [Google Fonts](https://fonts.google.com/).
      - Font Weight - A value 100-900 for the thickness of the font
      - This will only load the font and make it available for the page. You need to specify the font name in one or more of the below sections if you want to use it.
    - Title Font - Change the title font
    - BAN - Font for the Big a$$ number
    - Text - Remaining font on the page
    - If the font family has spaces, specify them like 'Tableau Book','Tableau',Arial,sans-serif.
  - Color
    - These are pretty self-explanatory for the Sentiment and Background colors.
    - The charts have many options, and the following shows most of them:
5. When you ‘Close and Save’ the extension, it will load the metrics and show them in the selected UI style.
  - You can scroll through the carousel by clicking on the right/left arrows, or click/drag the metrics.
  - Clicking on the Insights banner will show a pop-up in the same dashboard extension frame.
  - The insights carousel can also be scrolled left/right with the arrows or by dragging.

### Pop-up Insights Experience

This adds a second instance of the same Pulse Dashboard Extension. It splits the metrics carousel into the SOURCE extension and the insights carousel into the TARGET extension. It is highly recommended to use show/hide for the insights carousel but I’m looking forward to your creative solutions.

#### Primary Extension

1. Follow the Single extension setup instructions.
2. Go to any sheet/dashboard and create a Parameter called MetricId of type string.
  - Note: The name of the parameter is currently fixed, but could be made into a user configurable option later.
3. Create a Calculated Field with the formula `[MetricId] != ''`.
  - Note: The name of this field doesn’t matter, but we will use this for Dynamic Visibility on the dashboard.
4. Return to your initial Pulse Dashboard Extension and open the Configure dialog.
5. Select the Options tab and change the companion mode to Source.

#### Second Extension

1. Add a second Extension Object onto the dashboard.
  - Pro-tip: Shift-click and drag the Extension onto the dashboard to quickly set it to Floating. Otherwise, you will want to set it to floating after you configure it for an ideal user experience.
2. There is a small issue I’m trying to track down where the login from the first extension is passed to the second extension. To remedy this, click Logout and Load Sample Values (or enter your specific connection information).
3. Navigate to the Options tab and select Target.
4. Click Close and Save.
5. With the Target extension selected, select the Layout tab (on the dashboard), enable Control visibility using value and select the Calculated Field that you created in Step 3.
6. The configuration should be done at this point. It should function like the video above. Click any Insights banner in the metric in the Source extension and it should load in the Target extension.

### Filtering

There are two options for filtering Pulse Metrics.

1. Set Pulse metric filters based on dashboard filters
2. Show each metric’s filter below the metric

#### Set Pulse metric filters based on dashboard filters

**Set up:**

This is the default option. If you see the Pulse filters below each metric, open the Configure dialog and uncheck the “Show Pulse Filters” checkbox.

**Usage:**

Use your dashboard filters naturally, and the matching filters in Pulse will be applied.

**Technical notes:**

- Filters will be applied if they match both the filter name and the filter values. This acts like “Apply to worksheets → All using related datasources” dashboard filter option.
- If you do enable the “Show Pulse Filters” option, whichever filters are selected last will be applied. In other words, if you select a Pulse filter then the Pulse filters will be applied; if you change a dashboard filter the dashboard filters will overwrite the individual Pulse Metric filters.

#### Set Pulse Filters based on Individual Metric filters

**Set up:**

Enable the individual Pulse metric filters by enabling the “Show Pulse Filters” checkbox in the Configure pop up.

**Usage:**

Use the dropdown to select the filters.

**Technical Notes:**

- This acts differently from the dashboard filters in that this works like “Apply to worksheets → All using this datasource”. In other words, it will not filter Region if it exists on other data sources.
- With the “Show Pulse Filters” option enabled, whichever filters are selected last will be applied. In other words, if you select a Pulse filter then the Pulse filters will be applied; if you change a dashboard filter the dashboard filters will overwrite the individual Pulse Metric filters.

### Troubleshooting

1. If the Insights carousel does not pop up, you can add the MetricId parameter onto the dashboard and see if it changes when you select the metric.
2. If there are errors in the Target extension, or the Source doesn’t load properly, or you created the parameter after the extensions were added you may need to reload each extension.

### Future Enhancements

Please add your suggestions/comments/etc here.

| Name           | Feature           | Description                                                                 |
|----------------|-------------------|-----------------------------------------------------------------------------|
| Kiyoshi Jones  | Overall Framework | Great job Russ! This is fantastic to showcase what's possible! I followed your instructions and was able to get things working very quickly. I especially like your Load Sample Values feature! |

### Known Issues

Please add any issues you encounter here.

| Name         | Issue                                             | Steps to reproduce | Image (use Insert->Image in the menu) | Status     |
|--------------|---------------------------------------------------|--------------------|---------------------------------------|------------|
| Marc Psaila  | Need to be connected to Zscaler to be able to configure the extension |                    |                                       | Completed  |
