import { useState, useEffect, useContext } from 'react';
import { IconSparkles } from '@tabler/icons-react';
import Filters from '../../Filters';

import { Skeleton } from '../../../ui';
import { Badge } from '../../../ui';
import { Dialog, DialogTrigger } from '../../../ui';

import { useInsights } from '../../../../hooks';
import { parseInsights } from '../../../../utils';
import { InsightsModal, VegaLiteViz } from '../../..';
import { ExtensionDataContext } from '../../../ExtensionDataProvider';
import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { InsightsModel } from 'models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  // const [datasourceIds, setDatasourceIds] = useState<DatasourceFieldData[]>([]);
  let result; // contains question, markup and facts
  let facts; // contains values, absolute and relative changes
  let stats: any = { sentiment: undefined }; // prop storing key facts
  // tanstack query hook
  const { data, error, isError, isSuccess, failureCount, failureReason } = useInsights(metric);
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  const [filterReady, setFilterReady] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<React.ReactNode>(() => <div></div>);
  // const [mergedFieldData, setMergedFieldData] = useState<FieldResult[]>([]);
  // const [currDatasourceFilterFields, setCurrDatasourceFilterFields] = useState<any[]>([]);
  const [filtersApplied, setFiltersApplied] = useState<'flex' | 'hidden'>('hidden');
  const currDatasourceFilterFields = extension_options.allowed_dimensions;
  const [insights, setInsights] = useState<InsightsModel[]>([]);

  useEffect(() => {
    let mff = contextData?.datasourceCollection?.getDatasource(datasourceId)?.metricFilterFields;
    if (mff && mff.length > 0) {
      setFilterReady(true);
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
  if (isSuccess) {
    const insight_groups = data?.bundle_response?.result.insight_groups;
    if (Array.isArray(insight_groups)) {
      insight_groups.forEach((insight) => {
        // uses the ban insight to generate stats
        if (insight.type === 'ban') {
          // BAN responses only have 1 insight_groups and 1 insights
          result = data?.bundle_response?.result.insight_groups[0].insights[0].result;
          facts = result?.facts;
          // formatted current value
          stats.value = facts?.target_period_value.formatted;
          // control for plural or singular values
          if (stats.value === 1) {
            stats.plural = false;
          } else {
            stats.plural = true;
          }
          if (stats.plural === true) {
            stats.units = metric.representation_options?.number_units.plural_noun;
          } else {
            stats.units = metric.representation_options?.number_units.singular_noun;
          }

          // absolute difference in unit of measurement
          stats.absolute = facts?.difference.absolute.formatted;
          // always a percentage
          stats.relative = facts?.difference.relative.formatted;
          // show a plus sign for increments
          if (stats.absolute) {
            if (!stats?.absolute.startsWith('-')) {
              stats.absolute = '+' + stats.absolute;
              stats.relative = '+' + stats.relative;
            }
          }

          // direction of the arrow icon -- new Logical/sentimental version dschober
          const dir = facts?.difference.direction;
          const sent = facts?.sentiment;

          if (dir === 'up') {
            stats.direction = 'Up ↗︎';
          } else if (dir === 'down') {
            stats.direction = 'Down ↘︎';
          } else if (dir === 'flat') {
            stats.direction = 'Flat →';
          }

          if (sent === 'positive') {
            stats.color = 'text-green-500 ';
            stats.badge = 'bg-sky-600 dark:bg-sky-600';
          } else if (sent === 'negative') {
            stats.color = 'text-orange-500';
            stats.badge = 'bg-orange-600 dark:bg-orange-600';
          } else if (sent === 'neutral') {
            stats.color = 'text-black-500';
            stats.badge = 'bg-stone-500 dark:bg-stone-400';
          }
        }
      });
    }
  }

  const myIcon: IconProp = faFilter;

  async function handleMetricFilter(datasourceId: string, filterId: string, fields: string[]) {
    console.log(
      `field passed to handleMetricFilter: ${datasourceId} ${filterId} ${fields} in metric ${metric.name}${metric.nameFilters}`
    );
    propogateMetricFilter(datasourceId, filterId, fields);
  }

  return (
    <div className="p-4 h-full flex flex-col bg-white border border-gray-200 shadow-sm">
      {/* Mimic SLDS box and theme */}
      <div className="flex items-end">
        <div>
          <div className="w-full">
            <div className="border-b border-gray-200 pb-1">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                <li className="mr-2 text-2xl">{metric.name}</li>
                {/*               <li className="mr-2">
                <a href="#" className="inline-block p-4 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300">
                Insights
                </a>
              </li>
              <li className="mr-2">
                <a href="#" className="inline-block p-4 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300">
                Filters
                </a>
              </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col pt-2">
        {/* Row 1: Metric Period */}
        <div className="flex items-end mb-2">
          <div className="w-1/2 pr-2">
            <div className="text-xs font-normal">Metric Period</div>
            <div className="text-muted-foreground">{metric.namePeriod}</div>
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
          viz={data?.bundle_response?.result?.insight_groups[1]?.summaries[0]?.result?.viz}
        />
        {metric.description && metric.description.length > 0 && (
          <div>
            <div className="bg-gray-100 text-gray-700 px-2 py-1 mb-2 font-semibold">
              Metric Description
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
          <div className="bg-gray-100 text-gray-700 px-2 py-1 mb-2 font-semibold">Filters</div>
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
        <div className="flex flex-col">
          {/* Row 1: Metric Value */}
          <div className="flex items-end mb-2">
            <div className="w-1/2 pr-2">
              <div className="text-xs font-normal">Metric Value</div>
              <div className="text-muted-foreground text-3xl">
                {stats.value ? stats.value : null}
              </div>
              <hr className="my-2 border-gray-300" />
            </div>
            <div className="w-1/2 pl-2">
              <div className="text-xs font-normal">Metric Ind.</div>
              <div className={`text-muted-foreground text-3xl ${stats.color}`}>
                {stats.direction}
              </div>
              <hr className="my-2 border-gray-300" />
            </div>
          </div>

          {/* Row 2: Metric Change % */}
          <div className="flex items-end mb-2">
            <div className="w-1/2 pr-2">
              <div className="text-xs font-normal">Metric Change %</div>
              <div className="text-muted-foreground">
                {stats.relative ? `${stats.relative}` : null}
              </div>
              <hr className="my-2 border-gray-300" />
            </div>
            <div className="w-1/2 pl-2"></div> {/* Placeholder for alignment */}
          </div>

          {/* Row 3: Metric Delta */}
          <div className="flex items-end">
            <div className="w-1/2 pr-2">
              <div className="text-xs font-normal">Metric Delta</div>
              <div className="text-muted-foreground">△{stats.absolute}</div>
              <hr className="my-2 border-gray-300" />
            </div>
            <div className="w-1/2 pl-2"></div> {/* Placeholder for alignment */}
          </div>
        </div>

        <div className="flex flex-row flex-grow-0 mt-2">
          {insights && insights.length > 0 && contextData.showPulseTopInsight === 'true' && (
            <div className="w-full h-full">
              <div className="bg-gray-100 text-gray-700 px-2 py-1 mb-2 font-semibold">Insights</div>
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

        <div className="text-xs font-normal">All Insights</div>
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
                  popupWindowRef = window.open(popupUrl, 'insightsPopup', 'width=1225,height=645');
                } else {
                  // If the popup is already open, just update the URL and bring it to focus
                  popupWindowRef.location.href = popupUrl;
                  popupWindowRef.focus();
                }
              }
            }}
          >
            <Badge className={`${stats.badge} text-stone-50 max-h-6`} variant="undefined">
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
