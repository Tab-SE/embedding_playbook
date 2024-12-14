import React from 'react';
import { Input } from 'components/ui';
import { ExternalLink } from 'lucide-react';

export const OptionsColorTab = ({ contextOptions, updateContextOption }) => {
  return (
    <div>
      <span className="text-2xl font-extrabold">Color</span>
      <div className="p-4 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-4">Sentiment</h2>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="positiveSentimentColor">Positive</label>
            <Input
              type="color"
              id="positiveSentimentColor"
              value={contextOptions.positiveSentimentColor}
              onChange={(e) => updateContextOption('positiveSentimentColor', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="neutralSentimentColor">Neutral</label>
            <Input
              type="color"
              id="neutralSentimentColor"
              value={contextOptions.neutralSentimentColor}
              onChange={(e) => updateContextOption('neutralSentimentColor', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="negativeSentimentColor">Negative</label>
            <Input
              type="color"
              id="negativeSentimentColor"
              value={contextOptions.negativeSentimentColor}
              onChange={(e) => updateContextOption('negativeSentimentColor', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="p-4 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-4">Background Color</h2>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="cardBackgroundColor">Card Background Color:</label>
            <Input
              type="color"
              id="cardBackgroundColor"
              value={contextOptions.cardBackgroundColor}
              onChange={(e) => updateContextOption('cardBackgroundColor', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="backgroundColor">Extension Background Color:</label>
            <Input
              type="color"
              id="backgroundColor"
              value={contextOptions.backgroundColor}
              onChange={(e) => updateContextOption('backgroundColor', e.target.value)}
            />
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
      <div className="p-4 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-4">Chart Colors</h2>
        <div className="flex space-x-4 items-end">
          <div className="flex-1">
            <label htmlFor="chartAxisColor">Axis</label>
            <Input
              type="color"
              id="chartAxisColor"
              value={contextOptions.chart.axis}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  axis: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartAxisLabelsColor">Axis Labels</label>
            <Input
              type="color"
              id="chartAxisLabelsColor"
              value={contextOptions.chart.axisLabels}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  axisLabels: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartPrimaryColor">Primary</label>
            <Input
              type="color"
              id="chartPrimaryColor"
              value={contextOptions.chart.primary}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  primary: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartPrimaryLabelColor">Primary Label</label>
            <Input
              type="color"
              id="chartPrimaryLabelColor"
              value={contextOptions.chart.primaryLabel}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  primaryLabel: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartAverageColor">Average</label>
            <Input
              type="color"
              id="chartAverageColor"
              value={contextOptions.chart.average}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  average: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartAverageLabelColor">Average Label</label>
            <Input
              type="color"
              id="chartAverageLabelColor"
              value={contextOptions.chart.averageLabel}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  averageLabel: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartCumulativeColor">Cumulative</label>
            <Input
              type="color"
              id="chartCumulativeColor"
              value={contextOptions.chart.cumulative}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  cumulative: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartCumulativeLabelColor">Cumulative Label</label>
            <Input
              type="color"
              id="chartCumulativeLabelColor"
              value={contextOptions.chart.cumulativeLabel}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  cumulativeLabel: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="flex space-x-4 mt-4 items-end">
          <div className="flex-1">
            <label htmlFor="chartUnspecifiedColor">Unspecified</label>
            <Input
              type="color"
              id="chartUnspecifiedColor"
              value={contextOptions.chart.unspecified}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  unspecified: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartUnspecifiedLabelColor">Unspecified Label</label>
            <Input
              type="color"
              id="chartUnspecifiedLabelColor"
              value={contextOptions.chart.unspecifiedLabel}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  unspecifiedLabel: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartFavorableColor">Favorable</label>
            <Input
              type="color"
              id="chartFavorableColor"
              value={contextOptions.chart.favorable}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  favorable: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartFavorableLabelColor">Favorable Label</label>
            <Input
              type="color"
              id="chartFavorableLabelColor"
              value={contextOptions.chart.favorableLabel}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  favorableLabel: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartUnfavorableColor">Unfavorable</label>
            <Input
              type="color"
              id="chartUnfavorableColor"
              value={contextOptions.chart.unfavorable}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  unfavorable: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartUnfavorableLabelColor">Unfavorable Label</label>
            <Input
              type="color"
              id="chartUnfavorableLabelColor"
              value={contextOptions.chart.unfavorableLabel}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  unfavorableLabel: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="flex space-x-4 mt-4 items-end">
          <div className="flex-1">
            <label htmlFor="chartSumColor">Sum</label>
            <Input
              type="color"
              id="chartSumColor"
              value={contextOptions.chart.sum}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  sum: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartProjectionColor">Projection</label>
            <Input
              type="color"
              id="chartProjectionColor"
              value={contextOptions.chart.projection}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  projection: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="chartRangeColor">Range</label>
            <Input
              type="color"
              id="chartRangeColor"
              value={contextOptions.chart.range}
              onChange={(e) =>
                updateContextOption('chart', {
                  ...contextOptions.chart,
                  range: e.target.value,
                })
              }
            />
          </div>
            <div className="flex-1">
            <label htmlFor="chartCurrentValueDotBorderColor">Current Value Dot Border</label>
            <Input
              type="color"
              id="chartCurrentValueDotBorderColor"
              value={contextOptions.chart.currentValueDotBorder}
              onChange={(e) =>
              updateContextOption('chart', {
                ...contextOptions.chart,
                currentValueDotBorder: e.target.value,
              })
              }
            />
            </div>
            <div className="flex-1">
            <label htmlFor="chartDotBorderColor">Dot Border</label>
            <Input
              type="color"
              id="chartDotBorderColor"
              value={contextOptions.chart.dotBorder}
              onChange={(e) =>
              updateContextOption('chart', {
                ...contextOptions.chart,
                dotBorder: e.target.value,
              })
              }
            />
            </div>
            <div className="flex-1">
            <label htmlFor="chartHoverDotColor">Hover Dot</label>
            <Input
              type="color"
              id="chartHoverDotColor"
              value={contextOptions.chart.hoverDot}
              onChange={(e) =>
              updateContextOption('chart', {
                ...contextOptions.chart,
                hoverDot: e.target.value,
              })
              }
            />
            </div>
            <div className="flex-1">
            <label htmlFor="chartHoverLineColor">Hover Line</label>
            <Input
              type="color"
              id="chartHoverLineColor"
              value={contextOptions.chart.hoverLine}
              onChange={(e) =>
              updateContextOption('chart', {
                ...contextOptions.chart,
                hoverLine: e.target.value,
              })
              }
            />
            </div>
        </div>

        <div className="mt-4">
          <button
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.open('/configureImagesPage', '_blank')}
          >
            <ExternalLink className="mr-2" />
            Show Configuration Images
          </button>
        </div>
      </div>
    </div>
  );
};


