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
import { parseInsights } from '../../../../utils';
import { InsightsModal, VegaLiteViz } from '../../..';
import { ExtensionDataContext } from '../../../ExtensionDataProvider';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { InsightsModel } from 'models';
import { parseStats } from 'utils/parse';

export const MetricTableauDetails: React.FC<{
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
  // const [datasourceIds, setDatasourceIds] = useState<DatasourceFieldData[]>([]);
  let result; // contains question, markup and facts
  let facts; // contains values, absolute and relative changes
  let stats: any = { sentiment: undefined }; // prop storing key facts
  // tanstack query hook
  const { data, error, isError, isSuccess, failureCount, failureReason } = useInsights(metric);
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  const [filterReady, setFilterReady] = useState<boolean>(false);

  // const [mergedFieldData, setMergedFieldData] = useState<FieldResult[]>([]);
  // const [currDatasourceFilterFields, setCurrDatasourceFilterFields] = useState<any[]>([]);

  const currDatasourceFilterFields = extension_options.allowed_dimensions;
  const [insights, setInsights] = useState<InsightsModel[]>([]);
  let popupWindowRef: Window | null = null;

  useEffect(() => {
    let mff = contextData?.datasourceCollection?.getDatasource(datasourceId)?.metricFilterFields;
    if (mff && mff.length > 0) {
      setFilterReady(true);
    } else {
      setFilterReady(false);
    }
  }, [() => contextData.datasourceCollection.getDatasource(datasourceId)?.metricFilterFields]);

  useEffect(() => {
    if (isSuccess) {
      // main data found in insight groups
      const details = parseInsights(data);
      setInsights(details);
      setBundleCount(details.length);
    }
  }, [isSuccess, data]);

  async function handleMetricFilter(datasourceId: string, filterId: string, fields: string[]) {
    console.log(
      `field passed to handleMetricFilter: ${datasourceId} ${filterId} ${fields} in metric ${metric.name}${metric.nameFilters}`
    );
    propogateMetricFilter(datasourceId, filterId, fields);
  }

  if (isError) {
    console.debug(error);
  }
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
  }

  // fully loaded state
  return (
    <div>
      <Stats
        isSuccess={isSuccess}
        stats={stats}
        bundleCount={bundleCount}
        metric={metric}
        insights={insights}
        viz={data?.bundle_response?.result?.insight_groups[1]?.summaries[0]?.result?.viz}
      />
      {filterReady &&
        contextData.showPulseFilters === 'true' &&
        currDatasourceFilterFields.map((filter: string) => {
          return (
            <Filters
              key={datasourceId + '-' + metric.id + '-' + filter}
              datasourceId={datasourceId}
              filterId={filter}
              handleMetricFilter={handleMetricFilter}
              passedValues={selectedValues}
              metric={metric}
            />
          );
        })}
    </div>
  );
};

const Stats: React.FC<StatsProps> = (props) => {
  const { isSuccess, stats, bundleCount, metric, insights, viz } = props;
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  const [filtersApplied, setFiltersApplied] = useState<'flex' | 'hidden'>('hidden');
  const [appliedFilters, setAppliedFilters] = useState<React.ReactNode>(() => <div></div>);
  let popupWindowRef: Window | null = null;

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
  const myIcon: IconProp = faFilter;

  if (isSuccess && insights && insights.length) {
    return (
      <div className="" key={metric.specification_id}>
        <div className="bg-white border border-blue-100 rounded-xl shadow-md p-8 mb-4 hover:shadow-lg cursor-pointer  flex flex-col h-full">
          {/* Card Header */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium truncate">{metric.name}</h2>
              <button className="text-gray-500 hover:text-gray-700" aria-label="More Actions">
                {/* More actions button */}
                •••
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {`${metric.namePeriod} ${
                contextData.currentFiltersDisplayMode === 'top' && metric.nameFilters
                  ? `- ${metric.nameFilters}`
                  : ''
              }`}
            </div>
            {/* Flex container to align the stats and relative values */}
            <div className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <span className="font-normal mr-3 text-[2.625rem] leading-[3rem]">
                  {stats.value}&nbsp;
                </span>
                <span className="font-normal text-[1rem]">{stats.units}&nbsp;</span>
              </div>
              {contextData.timeComparisonMode !== 'text' && (
                <div className={`${stats?.comparisons?.[0].color}`}>
                  <div className="text-xs">{stats?.comparisons?.[0].comparison}</div>
                  <div>{stats?.comparisons?.[0].directionIcon}</div>
                  <div>
                    {stats?.comparisons?.[0].relative
                      ? `${stats?.comparisons?.[0].relative}`
                      : null}
                  </div>
                  <div className="block mt-[-2px] leading-none">
                    △ {stats?.comparisons?.[0].absolute}
                  </div>
                </div>
              )}
              {contextData.timeComparisonMode === 'both' && stats?.comparisons?.[1] &&
              (stats?.comparisons[1].is_nan ? (
                <div className="text-xs text-muted-foreground text-stone-500 dark:text-stone-300">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: stats?.comparisons[1].markup,
                    }}
                  />
                </div>
              ) : (
                <div className={`${stats?.comparisons?.[1]?.color} ml-3`}>
                  <div className="text-xs">{stats?.comparisons?.[1].comparison}</div>
                  <div>{stats?.comparisons?.[1].directionIcon}</div>
                  <div>
                    {stats?.comparisons?.[1].relative
                      ? `${stats?.comparisons?.[1].relative}`
                      : null}
                  </div>
                  <div className="block mt-[-2px] leading-none">
                    △ {stats?.comparisons?.[1].absolute}
                  </div>
                </div>
              ))}
            </div>
            {contextData.timeComparisonMode === 'text' && (
              <div className="pl-3 text-sm text-muted-foreground text-stone-500 dark:text-stone-300">
                <br />
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      stats?.comparisons && stats?.comparisons[0] && stats?.comparisons[0].markup,
                  }}
                />
                <br />
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      stats.comparisons && stats?.comparisons[1] && stats?.comparisons[1].markup,
                  }}
                />
              </div>
            )}
            {/* Card Content */}
            <div className="mb-4">
              {viz && contextData.showPulseAnchorChart === 'true' && (
                <div className="mb-4">
                  <VegaLiteViz height="140" width="100%" spec={viz} testId={undefined} />
                </div>
              )}
              <p>
                {stats && stats?.markup && stats?.markup.includes('<span') ? (
                  <span dangerouslySetInnerHTML={{ __html: stats.markup }} />
                ) : (
                  stats.markup
                )}
              </p>

              {/* Insights Section */}
              {contextData.showPulseTopInsight === 'true' && insights && (
                <div>
                  {/* Card Divider */}
                  <hr className="border-gray-300 my-4" />

                  <div className="insights">
                    <div className="mb-4">
                      {Object.keys(insights[0].viz).length > 0 && (
                        <VegaLiteViz
                          height="140"
                          width="100%"
                          spec={insights[0]?.viz}
                          testId={undefined}
                        />
                      )}
                    </div>
                    <article className="text-gray-800">
                      <span dangerouslySetInnerHTML={{ __html: insights[0].markup }} />
                    </article>
                  </div>
                </div>
              )}
            </div>
          </div>

          {contextData.currentFiltersDisplayMode === 'bottom' && (
            <div
              className={`text-stone-500 dark:text-stone-300 leading-5 pl-3 overflow-hidden ${filtersApplied}`}
            >
              <FontAwesomeIcon icon={myIcon} />
              {appliedFilters}
            </div>
          )}

          <div className="flex flex-row mt-3">
            <Dialog>
              <DialogTrigger
                // onClick={() => {
                //   console.log(`calling handleSetVal with ${(metric as any).specification_id}`);
                //   // handleSetVal(metric.id);
                //   contextData.companionMode === 'source' ? contextData.handleSetVal((metric as any).specification_id) : null;
                // }}
                onClick={() => {
                  const metricId = (metric as any).specification_id;
                  console.log(`calling handleSetVal with ${metricId}`);

                  if (contextData.companionMode === 'source') {
                    contextData.handleSetVal(metricId);
                  } else if (contextData.companionMode === 'popup') {
                    // Define the popup URL
                    const popupUrl = `/pulseExtension/pulseExtensionInsightsPopup?metricId=${metricId}`;

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
                  className={`${stats.badge} text-stone-50 max-h-6 my-auto ml-6`}
                  variant="undefined"
                >
                  <IconSparkles width={15} height={15} className="mr-1" />
                  Insights: {bundleCount}
                </Badge>
              </DialogTrigger>
              {contextData.companionMode === 'none' || contextData.companionMode === 'target' ? (
                <InsightsModal metric={metric} stats={stats} />
              ) : null}
            </Dialog>
          </div>
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
