// metric object used to parse Tableau Pulse results and return a minimal result for embedding
class Metric {
  constructor(session, metric) {
    this.session = session;
    this.metric = metric;
  }

  parseScopedMetric = (metrics) => {
    let scopedMetrics = new Object;
    return scopedMetrics;
  }

  parseCoreMetric = (scopedMetrics) => {
    let coreMetrics = new Object;
    return coreMetrics;
  }

  parseInsights = () => {
    let insights = new Object;
    return insights;
  }
}