"use client";

import { VegaLiteViz } from '@/components/Insights/VegaLiteViz';
import { generateSupplierData } from '@/app/demo/telarus/data/dashboardData';

export const SupplierPerformanceDashboard = ({ selectedProduct = null }) => {
  const supplierData = generateSupplierData(selectedProduct);

  // Delivery time comparison
  const deliveryData = supplierData.filter(d => d.metric === 'Delivery Time');
  const deliverySpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Delivery Time by Vendor',
    width: 'container',
    height: 300,
    data: { values: deliveryData },
    mark: {
      type: 'bar',
      tooltip: true,
    },
    encoding: {
      x: {
        field: 'vendor',
        type: 'nominal',
        title: 'Vendor',
        sort: { field: 'value', order: 'ascending' },
      },
      y: {
        field: 'value',
        type: 'quantitative',
        title: 'Days to Delivery',
        axis: { format: '.1f' },
      },
      color: {
        field: 'value',
        type: 'quantitative',
        scale: {
          scheme: 'blues',
          reverse: true,
        },
        legend: null,
      },
      tooltip: [
        { field: 'vendor', type: 'nominal', title: 'Vendor' },
        { field: 'value', type: 'quantitative', title: 'Days', format: '.1f' },
      ],
    },
  };

  // SLA Compliance
  const slaData = supplierData.filter(d => d.metric === 'SLA Compliance');
  const slaSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'SLA Compliance by Vendor',
    width: 'container',
    height: 300,
    data: { values: slaData },
    mark: {
      type: 'bar',
      tooltip: true,
    },
    encoding: {
      x: {
        field: 'vendor',
        type: 'nominal',
        title: 'Vendor',
        sort: { field: 'value', order: 'descending' },
      },
      y: {
        field: 'value',
        type: 'quantitative',
        title: 'SLA Compliance (%)',
        axis: { format: '.1f' },
        scale: { domain: [0, 100] },
      },
      color: {
        field: 'value',
        type: 'quantitative',
        scale: {
          scheme: 'greens',
        },
        legend: null,
      },
      tooltip: [
        { field: 'vendor', type: 'nominal', title: 'Vendor' },
        { field: 'value', type: 'quantitative', title: 'Compliance', format: '.1f%' },
      ],
    },
  };

  // Vendor comparison radar-style (simplified as bar chart)
  const comparisonSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Vendor Performance Comparison',
    width: 'container',
    height: 400,
    data: { values: supplierData },
    mark: {
      type: 'circle',
      tooltip: true,
      opacity: 0.7,
    },
    encoding: {
      x: {
        field: 'metric',
        type: 'nominal',
        title: 'Metric',
        axis: { labelAngle: -45 },
      },
      y: {
        field: 'vendor',
        type: 'nominal',
        title: 'Vendor',
      },
      size: {
        field: 'value',
        type: 'quantitative',
        title: 'Value',
        scale: { type: 'log' },
      },
      color: {
        field: 'vendor',
        type: 'nominal',
        title: 'Vendor',
        scale: {
          scheme: 'category10',
        },
      },
      tooltip: [
        { field: 'vendor', type: 'nominal', title: 'Vendor' },
        { field: 'metric', type: 'nominal', title: 'Metric' },
        { field: 'value', type: 'quantitative', title: 'Value', format: ',.2f' },
      ],
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border-2 p-4">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Delivery Time by Vendor</h3>
        <VegaLiteViz spec={deliverySpec} width="100%" height="300px" />
      </div>

      <div className="bg-white rounded-lg border-2 p-4">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">SLA Compliance</h3>
        <VegaLiteViz spec={slaSpec} width="100%" height="300px" />
      </div>

      <div className="bg-white rounded-lg border-2 p-4">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Vendor Performance Overview</h3>
        <VegaLiteViz spec={comparisonSpec} width="100%" height="400px" />
      </div>
    </div>
  );
};

