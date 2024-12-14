import { useState, useEffect, useContext } from 'react';
import {
  IconArrowNarrowRight,
  IconSparkles,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';
import { Filters } from 'components';

import { Skeleton } from '../../../ui';
import { Badge } from '../../../ui';
import { Dialog, DialogTrigger } from '../../../ui';

import { useInsights } from '../../../../hooks';
import { parseInsights, adjustLightness, applyVizFormatting } from '../../../../utils';
import { InsightsModal, VegaLiteViz } from '../../..';
import { ExtensionDataContext } from '../../../Providers';
import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { InsightsModel } from 'models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseStats } from 'utils/parse';

export const MetricSalesforceDetails: React.FC<{
  metric: Metric;
  propogateMetricFilter: (datasourceId: string, filterId: string, fields: string[]) => {};
  selectedValues: DatasourceFieldData[];
}> = (props) => {
  const { metric, propogateMetricFilter, selectedValues } = props;
  const datasourceId = metric?.definition?.datasource.id || '';
  const extension_options: ExtensionOptions = metric.extension_options || {
    allowed_dimensions: [],
    allowed_granularities: [],
    offset_from_today: 0,
  };
  // distinct count of insights
  const [bundleCount, setBundleCount] = useState<number | null>(null);
  let result; // contains question, markup and facts
  let facts; // contains values, absolute and relative changes
  let stats: any = { sentiment: undefined }; // prop storing key facts
  // tanstack query hook
  const { data, error, isError, isSuccess, failureCount, failureReason } = useInsights(metric);
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  const [filterReady, setFilterReady] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<React.ReactNode>(() => <div></div>);
  const [filtersApplied, setFiltersApplied] = useState<'flex' | 'hidden'>('hidden');
  const currDatasourceFilterFields = extension_options.allowed_dimensions;
  const [insights, setInsights] = useState<InsightsModel[]>([]);

  useEffect(() => {
    let mff = contextData?.datasourceCollection?.getDatasource(datasourceId)?.metricFilterFields;
    if (mff && mff.length > 0) {
      setFilterReady(true);
    } else {
      setFilterReady(false);
    }
  }, [() => contextData.datasourceCollection.getDatasource(datasourceId)?.metricFilterFields]);

  useEffect(() => {
    if (metric?.specification?.filters && metric?.specification?.filters?.length > 0) {
      let filters = '';
      metric.specification.filters.forEach((f) => {
        let str = `${f.field}: ${f.values.join(', ')}`;
        filters += str + '<br/>';
      });

      const filtersHtml = <div dangerouslySetInnerHTML={{ __html: filters }} />;
      if (appliedFilters !== filters) {
        setAppliedFilters(filtersHtml);
      }
      setFiltersApplied('flex');
    } else setFiltersApplied('hidden');
  }, [metric?.specification?.filters]);

  useEffect(() => {
    if (isSuccess) {
      // main data found in insight groups
      const details = parseInsights(data);
      setInsights(details);
      setBundleCount(details.length);
    }
  }, [isSuccess, data]);

  if (isError) {
    console.debug(error);
  }
  let viz;
  if (isSuccess) {
    stats = parseStats(data, metric);
    if (stats.dir === 'up') {
      stats.direction = <IconTrendingUp />;
    } else if (stats.dir === 'down') {
      stats.direction = <IconTrendingDown />;
    } else if (stats.dir === 'flat') {
      stats.direction = <IconArrowNarrowRight />;
    }

    if (stats.comparisons && stats.comparisons[0]) {
      if (stats.comparisons[0].direction === 'up') {
        stats.comparisons[0].directionIcon = <IconTrendingUp />;
      } else if (stats.comparisons[0].direction === 'down') {
        stats.comparisons[0].directionIcon = <IconTrendingDown />;
      } else if (stats.comparisons[0].direction === 'flat') {
        stats.comparisons[0].directionIcon = <IconArrowNarrowRight />;
      }
    }

    if (stats.comparisons && stats.comparisons[1]) {
      if (stats.comparisons[1].direction === 'up') {
        stats.comparisons[1].directionIcon = <IconTrendingUp />;
      } else if (stats.comparisons[1].direction === 'down') {
        stats.comparisons[1].directionIcon = <IconTrendingDown />;
      } else if (stats.comparisons[1].direction === 'flat') {
        stats.comparisons[1].directionIcon = <IconArrowNarrowRight />;
      }
    }
        viz = data?.bundle_response?.result?.insight_groups[1]?.summaries[0]?.result?.viz;
        viz = applyVizFormatting(viz, contextData);
  }

  const myIcon: IconProp = faFilter;

  async function handleMetricFilter(datasourceId: string, filterId: string, fields: string[]) {
    console.log(
      `field passed to handleMetricFilter: ${datasourceId} ${filterId} ${fields} in metric ${metric.name}${metric.nameFilters}`
    );
    propogateMetricFilter(datasourceId, filterId, fields);
  }

  return (
    <div
      className="p-4 h-full flex flex-col bg-white border border-gray-200 shadow-sm"
      style={Object.assign({}, contextData.options.cardText, {
        backgroundColor: contextData.options.cardBackgroundColor,
      })}
    >
      {/* Mimic SLDS box and theme */}
      <div className="mr-2" style={contextData.options.cardTitleText}>
        {metric.name}
      </div>

      <div className="flex flex-col pt-2">
        {/* Row 1: Metric Period */}
        <div className="flex items-end mb-2">
          <div className="w-1/2 pr-2">
            <div className="text-xs font-normal">Metric Period</div>
            <div className="text-muted-foreground">{metric.namePeriod}</div>
            <div>({stats?.target_time_period_range})</div>
            <hr className="my-2 border-gray-300" />
          </div>
          {contextData.currentFiltersDisplayMode === 'top' && (
            <div className="w-1/2 pl-2">
              <div className="text-xs font-normal">Metric Filters</div>
              <div className="text-muted-foreground">{metric.nameFilters || `(All)`}</div>
              <hr className="my-2 border-gray-300" />
            </div>
          )}
        </div>
      </div>

      <div>
        <Stats
          isSuccess={isSuccess}
          stats={stats}
          bundleCount={bundleCount}
          metric={metric}
          insights={insights}
          viz={viz}
        />
        {metric.description && metric.description.length > 0 && (
          <div className="pl-2">
            <div
              className="bg-gray-100
             px-2 py-1 mb-2 font-semibold"
             style={{
              color: contextData.options.cardText.color,
              backgroundColor: contextData.options.cardText.color
                ? adjustLightness(contextData.options.cardText.color)
                : 'initial',
            }}
            >
              Details
            </div>
            <div className="text-xs font-normal">Metric Description</div>
            <div className="text-muted-foreground">{metric.description}</div>
            <hr className="my-2 border-gray-300" />
          </div>
        )}
        {contextData.currentFiltersDisplayMode === 'bottom' && (
          <div className={`${filtersApplied === 'flex' ? 'block' : 'hidden'}`}>
            <div className="text-xs font-normal">Filters</div>
            <div className="text-muted-foreground flex items-center">
              <FontAwesomeIcon icon={myIcon} className="mr-2" />
              {appliedFilters}
            </div>
            <hr className="my-2 border-gray-300" />
          </div>
        )}

        {filterReady && contextData.showPulseFilters === 'true' && (
          <div className="bg-gray-100 px-2 py-1 mb-2 font-semibold">Filters</div>
        )}
        {filterReady &&
          contextData.showPulseFilters === 'true' &&
          currDatasourceFilterFields.map((filter) => (
            <Filters
              key={datasourceId + '-' + metric.id + '-' + filter}
              datasourceId={datasourceId}
              filterId={filter}
              handleMetricFilter={handleMetricFilter}
              passedValues={selectedValues}
              metric={metric}
            />
          ))}
      </div>
    </div>
  );
};

const Stats: React.FC<StatsProps> = (props) => {
  const { isSuccess, stats, bundleCount, metric, insights, viz } = props;
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  let popupWindowRef: Window | null = null;

  if (isSuccess) {
    return (
      <div className="block">
        <div className="flex flex-row flex-grow-0 mt-2">
          <div className="w-full h-full">
            <div
              className="bg-gray-100 px-2 py-1 mb-2 font-semibold"
              style={{
                color: contextData.options.cardText.color,
                backgroundColor: contextData.options.cardText.color
                  ? adjustLightness(contextData.options.cardText.color)
                  : 'initial',
              }}
            >
              Metric Value
            </div>
            <div className="text-muted-foreground" style={contextData.options.cardBANText}>
              {stats.value ? stats.value : null} {stats.units}
            </div>
            <hr className="my-2 border-gray-300" />
            {contextData.timeComparisonMode !== 'text' && stats?.comparisons?.[0] && (
              <>
                <div className="bg-gray-100 px-2 py-1 mb-2 font-semibold"
                              style={{
                                color: contextData.options.cardText.color,
                                backgroundColor: contextData.options.cardText.color
                                  ? adjustLightness(contextData.options.cardText.color)
                                  : 'initial',
                              }}
                >
                  Comparison {stats?.comparisons[0].comparison}
                </div>

                <div
                  className="flex items-end mb-2"
                  style={{
                    color:
                      stats?.comparisons?.[0]?.sentiment === 'positive'
                        ? contextData.options.positiveSentimentColor
                        : stats?.comparisons?.[0]?.sentiment === 'negative'
                        ? contextData.options.negativeSentimentColor
                        : contextData?.options?.neutralSentimentColor,
                  }}
                >
                  <div className="w-1/4 pl-2">
                    <div className="text-xs font-normal">Metric Ind.</div>
                    <div className={`text-muted-foreground text-3xl`}>
                      {stats.comparisons[0].directionIcon}
                    </div>
                    <hr className="my-2 border-gray-300" />
                  </div>
                  <div className="w-1/2 pl-2">
                    <div className="text-xs font-normal">Relative Change</div>
                    <div className={`text-muted-foreground text-3xl`}>
                      {stats.comparisons[0].relative ? `${stats.comparisons[0].relative}` : null}
                    </div>
                    <hr className="my-2 border-gray-300" />
                  </div>
                  <div className="w-1/2 pl-2">
                    <div className="text-xs font-normal">Abs. Change</div>
                    <div className={`text-muted-foreground text-3xl`}>
                      △ {stats.comparisons[0].absolute}
                    </div>
                    <hr className="my-2 border-gray-300" />
                  </div>
                </div>
              </>
            )}
            {contextData.timeComparisonMode === 'both' &&
              stats?.comparisons?.[1] &&
              (stats?.comparisons[1].is_nan ? (
                <div
                  className="pl-2"
                  style={{
                    color:
                      stats?.comparisons?.[1]?.sentiment === 'positive'
                        ? contextData.options.positiveSentimentColor
                        : stats?.comparisons?.[1]?.sentiment === 'negative'
                        ? contextData.options.negativeSentimentColor
                        : contextData?.options?.neutralSentimentColor,
                  }}
                >
                  <div className="text-xs font-normal">Metric Ind.</div>
                  <div className={`text-muted-foreground text-xl ${stats.color}`}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: stats?.comparisons[1].markup,
                      }}
                    />
                  </div>
                  <hr className="my-2 border-gray-300" />
                </div>
              ) : (
                <>
                  <div className="bg-gray-100 px-2 py-1 mb-2 font-semibold">
                    Comparison {stats?.comparisons[1].comparison}
                  </div>

                  <div className="flex items-end mb-2">
                    <div className="w-1/4 pl-2">
                      <div className="text-xs font-normal">Metric Ind.</div>
                      <div className={`text-muted-foreground text-3xl ${stats.color}`}>
                        {stats.comparisons[1].directionIcon}
                      </div>
                      <hr className="my-2 border-gray-300" />
                    </div>
                    <div className="w-1/2 pl-2">
                      <div className="text-xs font-normal">Relative Change</div>
                      <div className={`text-muted-foregroundF text-3xl ${stats.color}`}>
                        {stats.comparisons[1].relative ? `${stats.comparisons[1].relative}` : null}
                      </div>
                      <hr className="my-2 border-gray-300" />
                    </div>
                    <div className="w-1/2 pl-2">
                      <div className="text-xs font-normal">Abs. Change</div>
                      <div className={`text-muted-foreground text-3xl ${stats.color}`}>
                        △ {stats.comparisons[1].absolute}
                      </div>
                      <hr className="my-2 border-gray-300" />
                    </div>
                  </div>
                </>
              ))}
            {contextData.timeComparisonMode === 'text' && (
              <>
                <div className="w-full h-full">
                  <div className="bg-gray-100 px-2 py-1 mb-2 font-semibold">
                    Comparisons
                  </div>
                  <div className="text-muted-foreground">
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          stats?.comparisons &&
                          stats?.comparisons[0] &&
                          stats?.comparisons[0].markup,
                      }}
                    />
                  </div>
                  <hr className="my-2 border-gray-300" />
                  <div className="text-muted-foreground">
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          stats.comparisons &&
                          stats?.comparisons[1] &&
                          stats?.comparisons[1].markup,
                      }}
                    />
                  </div>
                  <hr className="my-2 border-gray-300" />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-row flex-grow-0 mt-2">
          {insights && insights.length > 0 && contextData.showPulseTopInsight === 'true' && (
            <div className="w-full h-full">
              <div className="bg-gray-100 px-2 py-1 mb-2 font-semibold"
                            style={{
                              color: contextData.options.cardText.color,
                              backgroundColor: contextData.options.cardText.color
                                ? adjustLightness(contextData.options.cardText.color)
                                : 'initial',
                            }}
              >Insights</div>
              <div className="text-xs font-normal">Insight Type</div>
              <div className="text-muted-foreground">{insights[0].typeText}</div>
              <hr className="my-2 border-gray-300" />
              <div className="text-xs font-normal">Insight Question</div>
              <div className="text-muted-foreground">{insights[0].question}</div>
              <hr className="my-2 border-gray-300" />
              <div className="text-xs font-normal">Insight Description</div>
              <div className="text-muted-foreground">
                {insights[0].markup.includes('<span') ? (
                  <div dangerouslySetInnerHTML={{ __html: insights[0].markup }} />
                ) : (
                  <div>{insights[0].markup}</div>
                )}
              </div>
              <hr className="my-2 border-gray-300" />
            </div>
          )}
        </div>

        {viz && contextData.showPulseAnchorChart === 'true' && (
          <div>
            <div className="text-xs font-normal">Insight Viz</div>
            <VegaLiteViz height={'150'} width={'100%'} spec={viz} testId={undefined} />
          </div>
        )}

        <div className="text-xs font-normal pl-2">All Insights</div>
        <div className="pl-2">
          <Dialog>
            <DialogTrigger
              className="bg-white"
              onClick={() => {
                const metricId = (metric as any).specification_id;
                console.log(`calling handleSetVal with ${metricId}`);

                if (contextData.companionMode === 'source') {
                  contextData.handleSetVal(metricId);
                } else if (contextData.companionMode === 'popup') {
                  // Define the popup URL
                  const popupUrl = `/pulseExtensionInsightsPopup?metricId=${metricId}`;

                  // Check if the popup window is already open and valid
                  if (!popupWindowRef || popupWindowRef.closed) {
                    // Open a new popup window and store the reference
                    popupWindowRef = window.open(
                      popupUrl,
                      'insightsPopup',
                      'width=1225,height=645'
                    );
                  } else {
                    // If the popup is already open, just update the URL and bring it to focus
                    popupWindowRef.location.href = popupUrl;
                    popupWindowRef.focus();
                  }
                }
              }}
            >
              <Badge
                className={`${stats.badge} text-stone-50 max-h-6`}
                variant="undefined"
                style={{
                  backgroundColor:
                    stats?.sentiment === 'positive'
                      ? contextData.options.positiveSentimentColor
                      : stats?.sentiment === 'negative'
                      ? contextData.options.negativeSentimentColor
                      : contextData?.options?.neutralSentimentColor,
                  color:
                    adjustLightness(
                      stats?.sentiment === 'positive'
                        ? contextData.options.positiveSentimentColor
                        : stats?.sentiment === 'negative'
                        ? contextData.options.negativeSentimentColor
                        : contextData?.options?.neutralSentimentColor
                    ) ?? 'initial',
                }}
              >
                <IconSparkles width={15} height={15} className="mr-1" />
                Insights: {bundleCount}
              </Badge>
            </DialogTrigger>
            {contextData.companionMode === 'none' || contextData.companionMode === 'target' ? (
              <InsightsModal metric={metric} stats={stats} />
            ) : null}
          </Dialog>
          <hr className="my-2 border-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-8 grid grid-rows-3">
        <div className="text-stone-500 dark:text-stone-300 leading-5 font-bold pl-3 whitespace-nowrap overflow-hidden p-3 pb-0">
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="flex items-center justify-end col-span-7 text-2xl font-bold text-right mr-1">
          <Skeleton className="h-7 w-20" />
        </div>
        <Skeleton className="h-5 w-24 my-auto ml-6" />
      </div>
      <div
        className={`col-span-4 grid justify-evenly items-end text-xs text-muted-foreground ${stats.color} py-2`}
      >
        <div>
          <Skeleton className="h-4 w-7" />
        </div>
        <div>
          <Skeleton className="h-4 w-7" />
        </div>
        <div>
          <Skeleton className="h-4 w-7" />
        </div>
        <div>
          <Skeleton className="h-4 w-7" />
        </div>
      </div>
    </div>
  );
};
