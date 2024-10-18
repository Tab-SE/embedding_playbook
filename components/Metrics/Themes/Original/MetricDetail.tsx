import { useState, useEffect, useContext } from 'react';
import {
  IconSparkles,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowNarrowRight,
} from '@tabler/icons-react';
import { Filters } from 'components';

import { Card, CardContent, CardHeader, CardTitle } from '../../../ui';
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

export const MetricDetail: React.FC<{
  metric: InsightsModel;
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

  const myIcon: IconProp = faFilter;

  async function handleMetricFilter(datasourceId: string, filterId: string, fields: string[]) {
    console.log(
      `field passed to handleMetricFilter: ${datasourceId} ${filterId} ${fields} in metric ${metric.name}${metric.nameFilters}`
    );
    propogateMetricFilter(datasourceId, filterId, fields);
  }

  // fully loaded state
  return (
    // tslint: disable-next-line
    <Card className="flex flex-col flex-grow rounded-xl border border-stone-200 bg-white text-stone-950 shadow dark:border-stone-800 dark:text-stone-50 min-h-[111px] max-w-[350px] dark:bg-stone-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-0">
        <CardTitle className="text-stone-500 dark:text-stone-300 leading-5 font-bold pl-3 overflow-hidden">
          {metric.name}
          <span className="font-normal text-xs block">
            {metric.namePeriod} ({stats?.target_time_period_range})
            <br />
            {contextData.currentFiltersDisplayMode === 'top' &&
              metric.nameFilters &&
              `${metric.nameFilters}`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Stats
          isSuccess={isSuccess}
          stats={stats}
          bundleCount={bundleCount}
          metric={metric}
          insights={insights}
          viz={data?.bundle_response?.result?.insight_groups[1]?.summaries[0]?.result?.viz}
        />
        {contextData.currentFiltersDisplayMode === 'bottom' && (
          <div
            className={`text-stone-500 dark:text-stone-300 leading-5 pl-3 overflow-hidden ${filtersApplied}`}
          >
            <FontAwesomeIcon icon={myIcon} />
            {appliedFilters}
          </div>
        )}
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
      </CardContent>
    </Card>
  );
};

const Stats: React.FC<StatsProps> = (props) => {
  const { isSuccess, stats, bundleCount, metric, viz, insights } = props;
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  let popupWindowRef: Window | null = null;

  if (isSuccess) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="pl-1">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{stats.value ? stats.value : null}</div>
              <div className="text-xs text-muted-foreground -mt-2">{stats.units}</div>
              <div className="mt-2">
                <Dialog>
                  <DialogTrigger>
                    <Badge
                      className={`${stats.badge} text-stone-50 h-6 flex items-center justify-center whitespace-nowrap w-min px-2`}
                      variant={undefined}
                    >
                      <IconSparkles width={15} height={15} className="mr-1" />
                      <span className="inline-block">{bundleCount}</span>
                    </Badge>
                  </DialogTrigger>
                  <InsightsModal metric={metric} stats={stats} />
                </Dialog>
              </div>
            </div>
            
            
         
        </div>
        <div className="flex flex-col flex-grow items-start text-xs text-muted-foreground mx-4">
          {contextData.timeComparisonMode !== 'text' && stats?.comparisons?.[0] && (
            <>
              <div className={`flex space-x-2 items-center ${stats.color}`}>
                <div>{stats.comparisons[0].directionIcon}</div>
                <div>{stats.comparisons[0].absolute}</div>
                <div>
                  {stats.comparisons[0].relative ? `${stats.comparisons[0].relative} △` : null}
                </div>
              </div>
              <div className="text-stone-500 dark:text-stone-300 text-xs text-muted-foreground -mt-2 ml-10">
                {stats.comparisons[0].comparison}
              </div>
            </>
          )}
          {contextData.timeComparisonMode === 'both' && stats?.comparisons?.[1] && (
            <>
              <div className={`flex space-x-2 items-center ${stats?.comparisons[1].color} -mt-1`}>
                <div>{stats?.comparisons[1].directionIcon}</div>
                <div>{stats?.comparisons[1].absolute}</div>
                <div>
                  {stats?.comparisons[1].relative ? `${stats?.comparisons[1].relative} △` : null}
                </div>
              </div>
              <div className="text-stone-500 dark:text-stone-300 text-xs text-muted-foreground -mt-2 ml-10">
                {stats?.comparisons[1].comparison}
              </div>
            </>
          )}
        </div>
</div>
        {contextData.timeComparisonMode === 'text' && (
          <div className="pl-3 text-xs text-muted-foreground text-stone-500 dark:text-stone-300">
            <br />
            <span
              dangerouslySetInnerHTML={{
                __html: stats?.comparisons && stats?.comparisons[0] && stats?.comparisons[0].markup,
              }}
            />
            <br />
            <span
              dangerouslySetInnerHTML={{
                __html: stats.comparisons && stats?.comparisons[1] && stats?.comparisons[1].markup,
              }}
            />
          </div>
        )}

        {viz && contextData.showPulseAnchorChart === 'true' && (
          <VegaLiteViz height={'140'} width={'100%'} spec={viz} testId={undefined} />
        )}

        {insights && insights.length > 0 && contextData.showPulseTopInsight === 'true' && (
          <div className="flex flex-col mt-2">
            <div className="inline-block text-white py-0 px-2 rounded-full bg-[#003a6ae0] text-[0.8rem] self-start">
              {insights[0].typeText}
            </div>
            <div className="text-[#030303e0] mt-1 text-[0.9rem] font-medium">
              {insights[0].question}
            </div>
            <div className="text-[#003a6ae0] mt-1 text-[0.9rem] font-medium">
              {insights[0].markup.includes('<span') ? (
                <p dangerouslySetInnerHTML={{ __html: insights[0].markup }} />
              ) : (
                <p>{insights[0].markup}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-row">
          <Dialog>
            <DialogTrigger
              onClick={() => {
                const metricId = (metric as any).specification_id;
                console.log(`calling handleSetVal with ${metricId}`);

                if (contextData.companionMode === 'source') {
                  contextData.handleSetVal(metricId);
                } else if (contextData.companionMode === 'popup') {
                  const popupUrl = `/pulseExtension/pulseExtensionInsightsPopup?metricId=${metricId}`;

                  if (!popupWindowRef || popupWindowRef.closed) {
                    popupWindowRef = window.open(
                      popupUrl,
                      'insightsPopup',
                      'width=1225,height=645'
                    );
                  } else {
                    popupWindowRef.location.href = popupUrl;
                    popupWindowRef.focus();
                  }
                }
              }}
            ></DialogTrigger>
            {contextData.companionMode === 'none' || contextData.companionMode === 'target' ? (
              <InsightsModal metric={metric} stats={stats} />
            ) : null}
          </Dialog>
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
