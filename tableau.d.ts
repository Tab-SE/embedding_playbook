declare var tableau: any;

interface MetricOptions {
  [key: string]: MetricOption;
}

interface MetricOption {
  name: string;
  nameFilters?: string;
  show: boolean;
  specification_id: string;
}

interface ContextDataWrapper {
  contextData: ContextData;
  updateContextData: (newData: Partial<ContextData>) => void;
}

interface ContextData {
  showPulseAnchorChart: 'true' | 'false';
  showPulseTopInsight: 'true' | 'false';
  companionMode: string;
  displayMode: 'original' | 'singlePane' | 'salesforce' | 'tableau';
  currentFiltersDisplayMode: 'top' | 'bottom';
  handleSetVal: (metricId: string) => void;
  increment: number;
  metricIdParamIsValid: boolean;
  currentMetric: string;
  pulseFilters?: DatasourceFieldData[];
  dashboardFilters?: CategoricalFilter[];
  debug: string;
  showPulseFilters: 'true' | 'false';
  datasourceCollection: DatasourceModelCollection;
  metricCollection: MetricCollection;
  loginData: LoginData
}

interface LoginData {
  tableauUrl: string,
  site_id: string,
  userName: string,
  caClientId: string,
  caSecretId: string,
  caSecretValue: string,
  isDashboardExtension: 'true' | 'false'
}

// Metric definition
interface Metric {
  name: string;
  namePeriod?: string;
  nameFilters?: string;
  description?: string;
  id?: string;
  user_id?: string;
  definition?: Definition;
  extension_options?: ExtensionOptions;
  representation_options?: RepresentationOptions;
  insights_options?: InsightsOptions;
  specification_id?: string;
  specification?: SpecificationDetails;
  subscription_id?: string;
  created?: string;
  updated?: string;
  insights?: any[];
}

interface Definition {
  datasource: {
    id: string;
  };
  is_running_total: boolean;
  viz_state_specification: {
    viz_state_string: string;
  };
}

interface SpecificationDetails {
  filters: any[];
  measurement_period: MeasurementPeriod;
  comparison: Comparison;
}

interface MeasurementPeriod {
  granularity: string;
  range: string;
}

interface Comparison {
  comparison: string;
}

interface ExtensionOptions {
  allowed_dimensions: string[];
  allowed_granularities: string[];
  offset_from_today: number;
}

interface RepresentationOptions {
  type: string;
  number_units: NumberUnits;
  sentiment_type: string;
  row_level_id_field: RowLevelIdField;
  row_level_entity_names: RowLevelEntityNames;
  row_level_name_field: RowLevelNameField;
  currency_code: string;
}

interface NumberUnits {
  singular_noun: string;
  plural_noun: string;
}

interface RowLevelIdField {
  identifier_col: string;
  identifier_label: string;
}

interface RowLevelEntityNames {
  entity_name_singular: string;
  entity_name_plural: string;
}

interface RowLevelNameField {
  name_col: string;
}

// Stats props
interface StatsProps {
  isSuccess: boolean;
  stats: {
    units: ReactNode;
    value?: string;
    absolute?: string;
    relative?: string;
    direction?: string;
    color?: string;
    badge?: string;
    markup?: string;
  };
  bundleCount: number | null;
  metric: Metric;
  insights?: InsightsModel[];
  viz?: {};
}

// Field result
interface FieldResult {
  status: string;
  data: {
    datasourceId: string;
    field: string;
    categorical_values: CategoricalValues[];
  };
  error: any;
}

interface CategoricalValues {
  values: string[];
}

type FieldData = {
  field: string;
  id?: string;
  label?: string;
  values: ValueOption[];
  datasourceId?: string;
};

type ValueOption = {
  label: string;
  value: string;
};

type DatasourceFieldData = {
  datasourceId: string;
  fields: FieldData[];
};

interface DatasourceFieldResult {
  field: string;
  status: string;
  data: DatasourceCategoricalValues[] | [];
  error: any;
}

interface DatasourceCategoricalValues {
  values: string[];
}

interface ExtendedDatasource extends DataSource {
  [x: string]: any;
  datasourceId: string;
}

// DataSource model
type DataSource = {
  id: string;
};

// Insights options
interface InsightsOptions {
  show_insights: boolean;
  settings: InsightSettings[];
}

type InsightSettings = any[];

// Datasource and metric collections
// interface DatasourceModelCollection {
//   [key: string]: ExtendedDatasource;
// }

// interface MetricCollection {
//   [key: string]: Metric;
// }

interface Specification {
  definition_id: string;
  specification: SpecificationDetails;
  specification_id: string;
  is_default: boolean
}

interface Subscription {
  subscription_id: string;
  metric_id: string;
  create_time: string;
  update_time: string;
}

interface SubscriptionObjects {
  [key: string]: Subscription;
}

interface SpecificationObjects {
  [key: string]: Specification;
}

interface MetricObjects {
  [key: string]: Metric;
}