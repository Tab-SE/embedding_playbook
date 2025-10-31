"use client";

import { VegaLiteViz } from '@/components/Insights/VegaLiteViz';
import { generateOrderData } from '@/app/demo/telarus/data/dashboardData';

export const OrderTrackingDashboard = ({ selectedProduct = null }) => {
  const orderData = generateOrderData(selectedProduct);

  // Orders by status
  const statusData = orderData.reduce((acc, d) => {
    const key = d.status;
    if (!acc[key]) {
      acc[key] = { status: key, count: 0, revenue: 0 };
    }
    acc[key].count += d.count;
    acc[key].revenue += d.revenue;
    return acc;
  }, {});

  const statusSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Orders by Status',
    width: 'container',
    height: 300,
    data: { values: Object.values(statusData) },
    mark: {
      type: 'bar',
      tooltip: true,
    },
    encoding: {
      x: {
        field: 'status',
        type: 'nominal',
        title: 'Status',
      },
      y: {
        field: 'count',
        type: 'quantitative',
        title: 'Order Count',
      },
      color: {
        field: 'status',
        type: 'nominal',
        scale: {
          domain: ['Provisioning', 'Installed', 'Active', 'Pending'],
          range: ['#fb8c00', '#4caf50', '#2196f3', '#ff9800'],
        },
        legend: null,
      },
      tooltip: [
        { field: 'status', type: 'nominal', title: 'Status' },
        { field: 'count', type: 'quantitative', title: 'Orders' },
        { field: 'revenue', type: 'quantitative', title: 'Revenue', format: '$,.0f' },
      ],
    },
  };

  // Orders over time by vendor
  const timelineSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Order Trends by Vendor',
    width: 'container',
    height: 300,
    data: { values: orderData },
    mark: {
      type: 'line',
      point: true,
      strokeWidth: 2,
    },
    encoding: {
      x: {
        field: 'month',
        type: 'ordinal',
        title: 'Month',
        axis: { labelAngle: -45 },
      },
      y: {
        field: 'count',
        type: 'quantitative',
        title: 'Order Count',
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
        { field: 'month', type: 'ordinal', title: 'Month' },
        { field: 'status', type: 'nominal', title: 'Status' },
        { field: 'count', type: 'quantitative', title: 'Orders' },
      ],
    },
  };

  // Revenue by vendor
  const revenueData = orderData.reduce((acc, d) => {
    if (!acc[d.vendor]) {
      acc[d.vendor] = { vendor: d.vendor, revenue: 0 };
    }
    acc[d.vendor].revenue += d.revenue;
    return acc;
  }, {});

  const revenueSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Revenue by Vendor',
    width: 'container',
    height: 300,
    data: { values: Object.values(revenueData) },
    mark: {
      type: 'bar',
      tooltip: true,
    },
    encoding: {
      x: {
        field: 'vendor',
        type: 'nominal',
        title: 'Vendor',
        sort: { field: 'revenue', order: 'descending' },
      },
      y: {
        field: 'revenue',
        type: 'quantitative',
        title: 'Revenue ($)',
        axis: { format: '$,.0f' },
      },
      color: {
        field: 'vendor',
        type: 'nominal',
        scale: {
          scheme: 'tableau20',
        },
        legend: null,
      },
      tooltip: [
        { field: 'vendor', type: 'nominal', title: 'Vendor' },
        { field: 'revenue', type: 'quantitative', title: 'Revenue', format: '$,.0f' },
      ],
    },
  };

  const totalOrders = Object.values(statusData).reduce((sum, d) => sum + d.count, 0);
  const totalRevenue = Object.values(statusData).reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Total Orders</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{totalOrders.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium">Total Revenue</div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            ${(totalRevenue / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg border-2 p-4">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Orders by Status</h3>
        <VegaLiteViz spec={statusSpec} width="100%" height="300px" />
      </div>

      <div className="bg-white rounded-lg border-2 p-4">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Order Trends by Vendor</h3>
        <VegaLiteViz spec={timelineSpec} width="100%" height="300px" />
      </div>

      <div className="bg-white rounded-lg border-2 p-4">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Revenue by Vendor</h3>
        <VegaLiteViz spec={revenueSpec} width="100%" height="300px" />
      </div>
    </div>
  );
};

