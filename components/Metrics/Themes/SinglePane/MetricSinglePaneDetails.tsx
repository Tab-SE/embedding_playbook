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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { InsightsModel } from 'models';

export const MetricSinglePaneDetails: React.FC<{
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
    }
    else {
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
          }
          else {
            stats.plural = true;
          }
          if (stats.plural === true) {
            stats.units = metric.representation_options.number_units.plural_noun;
          }
          else {
            stats.units = metric.representation_options.number_units.singular_noun;
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
            stats.color =
              'w-[80px] h-[30px] m-1.5 text-xs font-bold rounded-full bg-[#0e9714] text-[#f5f4f4] text-center leading-[30px]';
            stats.badge = 'bg-sky-600 dark:bg-sky-600';
          } else if (sent === 'negative') {
            stats.color =
              'w-[80px] h-[30px] m-1.5 text-xs font-bold rounded-full bg-[#cf0d0d] shadow-[0_0_2px_2px_rgba(202,202,202,0.882)] text-[#f5f4f4] text-center leading-[30px]';
            stats.badge = 'bg-orange-600 dark:bg-orange-600';
          } else if (sent === 'neutral') {
            stats.color =
              'w-[80px] h-[30px] m-1.5 text-xs font-bold rounded-full bg-[#e2e2e2] text-[#000] text-center leading-[30px]';
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

  // fully loaded state
  return (
    // tslint: disable-next-line
    <div>
      <div className="flex items-center justify-between m-0">
        <div>
          <h1 className="text-base mt-1 text-[#003f72] font-sans">{metric.name}</h1>
          <span className="font-normal text-xs block mt-[-3px]">
            {metric.namePeriod}
            {contextData.currentFiltersDisplayMode === 'top' && metric.nameFilters
              && `- ${metric.nameFilters}`}
          </span>
        </div>
        <p className={`${stats.color}`}>{stats.direction}</p>
      </div>
      <div className="">
        <Stats
          isSuccess={isSuccess}
          stats={stats}
          bundleCount={bundleCount}
          metric={metric}
          insights={insights}
          viz={data?.bundle_response?.result?.insight_groups[1]?.summaries[0]?.result?.viz}
          />
          {metric.description && (
            <div className="text-gray-500 mt-[0.5px] text-[0.7rem]">
              {metric.description.split(' ').map((word, index) => {
              const urlPattern = /(https?:\/\/[^\s]+)/g;
              if (urlPattern.test(word)) {
                return (
                <a key={index} href={word} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {word}
                </a>
                );
              }
              return <span key={index}>{word} </span>;
              })}
            </div>
          )}

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
      <div className="grid auto-rows-auto">
        <div className="flex justify-center items-center">
          <div className="text-3xl font-extrabold text-right mr-1 text-[#003a6a]">
            <div>{stats.value ? stats.value : null}</div>
          </div>
          <div className="text-muted-foreground">
            {stats.relative ? `${stats.relative}` : null}
            <span className="block mt-[-2px] leading-none">△ {stats.absolute}</span>
          </div>
        </div>

        <div className="flex flex-row flex-grow-0 mt-2">
          {insights && insights.length > 0 && contextData.showPulseTopInsight === 'true' && (
            <div className="w-full h-full">
              <div className="inline-block text-white py-0 px-2 rounded-full bg-[#003a6ae0] ml-1 text-[0.8rem]">
                {insights[0].typeText}
              </div>
              <div className="text-[#030303e0] mt-0 mx-1 text-[0.9rem] font-medium">
                {insights[0].question}
              </div>
              <div className="text-[#003a6ae0] mt-0 mx-2 mb-1 text-[0.9rem] font-medium">
                {insights[0].markup.includes('<span') ? (
                  <p dangerouslySetInnerHTML={{ __html: insights[0].markup }} />
                ) : (
                  <p>{insights[0].markup}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {viz && contextData.showPulseAnchorChart === 'true' && (
          <VegaLiteViz height={'150'} width={'100%'} spec={viz} testId={undefined} />
        )}
        <div className="flex flex-row">
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
      <div className={`col-span-4 grid justify-evenly items-end text-xs text-muted-foreground ${stats.color} py-2`}>
        <div><Skeleton className="h-4 w-7" /></div>
        <div><Skeleton className="h-4 w-7" /></div>
        <div><Skeleton className="h-4 w-7" /></div>
        <div><Skeleton className="h-4 w-7" /></div>
      </div>
    </div>
  )
};
