import { parseSubscriptions, parseScopedMetrics, parseCoreMetrics } from './controller/utils';

// Class containing Tableau Pulse core metrics with minimal data for the frontend
class Metrics {
  constructor(session, subscriptions, scopedMetrics, coreMetrics) {
    this.session = session;
    this.subscriptions = this.parseSubscriptions(subscriptions);
    this.scoped_metrics = this.parseScopedMetrics(scopedMetrics);
    this.core_metrics = this.parseCoreMetrics(coreMetrics);
    this.metrics = [];
  }

  // parsing utilities defined in controller.js
  parseSubscriptions = parseSubscriptions;
  parseScopedMetrics = parseScopedMetrics;
  parseCoreMetrics = parseCoreMetrics;
}

export default Metrics;
