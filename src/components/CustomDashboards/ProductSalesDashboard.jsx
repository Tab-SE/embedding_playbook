"use client";

import { VegaLiteViz } from '@/components/Insights/VegaLiteViz';
import { generateProductData, generateCrossSellData, generateRegionalData, generateProductBundlingData, generateSupplierByRegionData } from '@/app/demo/telarus/data/dashboardData';
import { useState } from 'react';

export const ProductSalesDashboard = ({ selectedProduct = null }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const productData = generateProductData(selectedProduct);
  const crossSellData = generateCrossSellData(selectedProduct);
  const regionalData = generateRegionalData(selectedProduct);
  const bundlingData = generateProductBundlingData(selectedProduct);
  const supplierData = generateSupplierByRegionData(selectedProduct, selectedRegion);

  // Get unique regions from regional data
  const availableRegions = [...new Set(regionalData.map(d => d.region))];

  // Get top recommended vendor for current product/region
  const topVendor = supplierData.length > 0 ? supplierData.find(d => d.isRecommended) || supplierData[0] : null;

  // Sales trend over time
  const salesTrendSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Product Sales Trends',
    width: 'container',
    height: 300,
    data: { values: productData },
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
        field: 'sales',
        type: 'quantitative',
        title: 'Sales ($)',
        axis: { format: '$,.0f' },
      },
      color: {
        field: 'product',
        type: 'nominal',
        title: 'Product',
        scale: {
          scheme: 'tableau20',
        },
      },
      tooltip: [
        { field: 'product', type: 'nominal', title: 'Product' },
        { field: 'month', type: 'ordinal', title: 'Month' },
        { field: 'sales', type: 'quantitative', title: 'Sales', format: '$,.0f' },
        { field: 'orders', type: 'quantitative', title: 'Orders' },
      ],
    },
  };

  // Cross-sell opportunities
  const crossSellSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Cross-Sell Opportunities',
    width: 'container',
    height: 300,
    data: { values: crossSellData },
    mark: {
      type: 'bar',
      tooltip: true,
    },
    encoding: {
      x: {
        field: 'product',
        type: 'nominal',
        title: 'Base Product',
      },
      y: {
        field: 'attachRate',
        type: 'quantitative',
        title: 'Attach Rate',
        axis: { format: '.0%' },
      },
      color: {
        field: 'crossSell',
        type: 'nominal',
        title: 'Cross-Sell Product',
        scale: {
          scheme: 'category10',
        },
      },
      tooltip: [
        { field: 'product', type: 'nominal', title: 'Base Product' },
        { field: 'crossSell', type: 'nominal', title: 'Cross-Sell' },
        { field: 'attachRate', type: 'quantitative', title: 'Attach Rate', format: '.1%' },
        { field: 'revenue', type: 'quantitative', title: 'Revenue', format: '$,.0f' },
        { field: 'opportunities', type: 'quantitative', title: 'Opportunities' },
      ],
    },
  };

  // Regional performance
  const regionalSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Regional Performance',
    width: 'container',
    height: 300,
    data: { values: regionalData },
    mark: {
      type: 'bar',
      tooltip: true,
    },
    encoding: {
      x: {
        field: 'region',
        type: 'nominal',
        title: 'Region',
      },
      y: {
        field: 'sales',
        type: 'quantitative',
        title: 'Sales ($)',
        axis: { format: '$,.0f' },
      },
      color: {
        field: 'product',
        type: 'nominal',
        title: 'Product',
        scale: {
          scheme: 'tableau20',
        },
      },
      tooltip: [
        { field: 'region', type: 'nominal', title: 'Region' },
        { field: 'product', type: 'nominal', title: 'Product' },
        { field: 'sales', type: 'quantitative', title: 'Sales', format: '$,.0f' },
        { field: 'growth', type: 'quantitative', title: 'Growth', format: '.1f%' },
        { field: 'marketShare', type: 'quantitative', title: 'Market Share', format: '.1f%' },
      ],
    },
  };

  // Product bundling visualization - shows which products sell together
  const bundlingSpec = bundlingData.length > 0 ? {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Product Bundling & Upsell Opportunities',
    width: 'container',
    height: 400,
    data: { values: bundlingData },
    transform: [
      {
        calculate: selectedProduct
          ? "'" + selectedProduct + "' + ' + ' + datum.product2"
          : "datum.product1 + ' + ' + datum.product2",
        as: 'bundle'
      },
      {
        calculate: "datum.correlation * 100",
        as: 'correlationPercent'
      }
    ],
    layer: [
      {
        mark: {
          type: 'bar',
          tooltip: true,
          opacity: 0.8,
        },
        encoding: {
          x: {
            field: 'bundle',
            type: 'nominal',
            title: selectedProduct ? `Cross-Sell Opportunities for ${selectedProduct}` : 'Product Pair',
            axis: { labelAngle: -45 },
            sort: { field: 'attachRate', order: 'descending' },
          },
          y: {
            field: 'attachRate',
            type: 'quantitative',
            title: 'Bundle Attach Rate',
            axis: { format: '.0%' },
          },
          color: {
            field: 'correlation',
            type: 'quantitative',
            title: 'Correlation Strength',
            scale: {
              scheme: 'viridis',
              domain: [0.5, 1],
            },
            legend: {
              title: 'Strength',
              format: '.0%',
            },
          },
          tooltip: [
            { field: 'bundle', type: 'nominal', title: 'Product Bundle' },
            { field: 'attachRate', type: 'quantitative', title: 'Attach Rate', format: '.1%' },
            { field: 'correlation', type: 'quantitative', title: 'Correlation', format: '.2f' },
            { field: 'upsellProbability', type: 'quantitative', title: 'Upsell Probability', format: '.0f%' },
            { field: 'bundleSales', type: 'quantitative', title: 'Bundle Sales (Count)' },
            { field: 'expectedRevenue', type: 'quantitative', title: 'Expected Revenue', format: '$,.0f' },
          ],
        },
      },
      {
        mark: {
          type: 'text',
          align: 'center',
          baseline: 'bottom',
          dy: -5,
        },
        encoding: {
          x: {
            field: 'bundle',
            type: 'nominal',
          },
          y: {
            field: 'attachRate',
            type: 'quantitative',
          },
          text: {
            field: 'upsellProbability',
            type: 'quantitative',
            format: '.0f%',
          },
          color: { value: '#000' },
          size: { value: 12 },
          fontWeight: { value: 'bold' },
        },
      },
    ],
  } : null;

  // Upsell probability heatmap - show as bar chart when filtered, heatmap when all products
  const upsellHeatmapSpec = bundlingData.length > 0 ? (selectedProduct ? {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Cross-Sell Probability for Selected Product',
    width: 'container',
    height: 350,
    data: { values: bundlingData },
    mark: {
      type: 'bar',
      tooltip: true,
      cornerRadiusTopLeft: 4,
      cornerRadiusTopRight: 4,
    },
    encoding: {
      x: {
        field: 'product2',
        type: 'nominal',
        title: `What pairs with ${selectedProduct}?`,
        sort: { field: 'upsellProbability', order: 'descending' },
        axis: { labelAngle: -45 },
      },
      y: {
        field: 'upsellProbability',
        type: 'quantitative',
        title: 'Upsell Probability (%)',
        axis: { format: '.0f%' },
      },
      color: {
        field: 'upsellProbability',
        type: 'quantitative',
        title: 'Probability',
        scale: {
          scheme: 'yellowgreenblue',
          domain: [55, 100],
        },
        legend: {
          title: 'Probability',
          format: '.0f%',
        },
      },
      tooltip: [
        { field: 'product2', type: 'nominal', title: 'Cross-Sell Product' },
        { field: 'attachRate', type: 'quantitative', title: 'Attach Rate', format: '.1%' },
        { field: 'upsellProbability', type: 'quantitative', title: 'Upsell Probability', format: '.0f%' },
        { field: 'correlation', type: 'quantitative', title: 'Correlation', format: '.2f' },
        { field: 'bundleSales', type: 'quantitative', title: 'Bundle Sales' },
        { field: 'expectedRevenue', type: 'quantitative', title: 'Expected Revenue', format: '$,.0f' },
      ],
    },
  } : {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Product Upsell Probability Matrix',
    width: 'container',
    height: 400,
    data: { values: bundlingData.slice(0, 20) }, // Limit to top 20 for readability
    mark: {
      type: 'rect',
      tooltip: true,
      stroke: '#fff',
      strokeWidth: 2,
    },
    encoding: {
      x: {
        field: 'product1',
        type: 'nominal',
        title: 'Primary Product',
        axis: { labelAngle: -45 },
      },
      y: {
        field: 'product2',
        type: 'nominal',
        title: 'Cross-Sell Product',
      },
      color: {
        field: 'upsellProbability',
        type: 'quantitative',
        title: 'Upsell Probability',
        scale: {
          scheme: 'yellowgreenblue',
          domain: [55, 85],
        },
        legend: {
          title: 'Probability',
          format: '.0f%',
        },
      },
      size: {
        field: 'bundleSales',
        type: 'quantitative',
        title: 'Sales Volume',
        scale: { range: [100, 2000] },
        legend: {
          title: 'Bundle Sales',
          format: ',.0f',
        },
      },
      tooltip: [
        { field: 'product1', type: 'nominal', title: 'Primary Product' },
        { field: 'product2', type: 'nominal', title: 'Cross-Sell Product' },
        { field: 'attachRate', type: 'quantitative', title: 'Attach Rate', format: '.1%' },
        { field: 'upsellProbability', type: 'quantitative', title: 'Upsell Probability', format: '.0f%' },
        { field: 'correlation', type: 'quantitative', title: 'Correlation', format: '.2f' },
        { field: 'bundleSales', type: 'quantitative', title: 'Bundle Sales' },
        { field: 'expectedRevenue', type: 'quantitative', title: 'Expected Revenue', format: '$,.0f' },
      ],
    },
  }) : null;

  // Summary stats
  const totalSales = productData.reduce((sum, d) => sum + d.sales, 0);
  const totalOrders = productData.reduce((sum, d) => sum + d.orders, 0);
  const avgCrossSell = crossSellData.reduce((sum, d) => sum + d.attachRate, 0) / crossSellData.length;
  const topUpsellPair = bundlingData.length > 0 ? bundlingData[0] : null;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Total Sales</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            ${(totalSales / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium">Total Orders</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{totalOrders.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="text-sm text-orange-600 font-medium">Avg Cross-Sell Rate</div>
          <div className="text-2xl font-bold text-orange-900 mt-1">{(avgCrossSell * 100).toFixed(1)}%</div>
        </div>
        {topUpsellPair && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-purple-600 font-medium">Top Upsell Opportunity</div>
            <div className="text-sm font-semibold text-purple-900 mt-1">
              {topUpsellPair.product1} + {topUpsellPair.product2}
            </div>
            <div className="text-xl font-bold text-purple-900">
              {topUpsellPair.upsellProbability.toFixed(0)}% probability
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg border-2 p-4">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Sales Trends</h3>
        <VegaLiteViz spec={salesTrendSpec} width="100%" height="300px" />
      </div>

      {/* Top Opportunities Table - Moved here */}
      {bundlingData.length > 0 && (
          <div className="bg-white rounded-lg border-2 p-4">
            <h3 className="text-lg font-semibold mb-2 text-slate-800">
              Top Cross-Sell Opportunities{selectedProduct ? ` for ${selectedProduct}` : ''}
            </h3>
          <p className="text-sm text-slate-600 mb-4">
            {selectedProduct
              ? `Products that sell well with ${selectedProduct} - ranked by probability`
              : 'Product bundles with the highest upsell potential - ranked by correlation'
            }
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-[#0d47a1] to-[#1565c0] text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">
                    {selectedProduct ? 'Cross-Sell Product' : 'Product Bundle'}
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">Attach Rate</th>
                  <th className="text-left px-4 py-3 font-semibold">Upsell Probability</th>
                  <th className="text-left px-4 py-3 font-semibold">Bundle Sales</th>
                  <th className="text-left px-4 py-3 font-semibold">Expected Revenue</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {bundlingData.slice(0, 5).map((pair, idx) => (
                  <tr
                    key={`${pair.product1}-${pair.product2}`}
                    className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {selectedProduct
                        ? pair.product2
                        : `${pair.product1} + ${pair.product2}`
                      }
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
                        {(pair.attachRate * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-purple-100 text-purple-800">
                        {pair.upsellProbability.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{pair.bundleSales}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      ${(pair.expectedRevenue / 1000).toFixed(0)}K
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border-2 p-4">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">
          Cross-Sell Opportunities
          {selectedProduct && ` - Base Product: ${selectedProduct}`}
        </h3>
        <VegaLiteViz spec={crossSellSpec} width="100%" height="300px" />
      </div>

      {/* <div className="bg-white rounded-lg border-2 p-4">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">
          Regional Performance
          {selectedProduct && ` - ${selectedProduct}`}
        </h3>
        <VegaLiteViz spec={regionalSpec} width="100%" height="300px" />
      </div> */}

      {/* Supplier Recommendations - Who Should I Go With? */}
      {selectedProduct && supplierData.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-4">
          <h3 className="text-lg font-semibold mb-2 text-slate-800">
            Who Should I Go With?
            {selectedProduct && ` - ${selectedProduct}`}
            {selectedRegion && ` in ${selectedRegion}`}
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Supplier recommendations based on performance, reliability, and regional expertise
          </p>

          {/* Region selector for supplier recommendations */}
          <div className="mb-4 pb-4 border-b">
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Select Region for Supplier Recommendations:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRegion(null)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  !selectedRegion
                    ? 'bg-[#0d47a1] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Regions
              </button>
              {availableRegions.map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedRegion === region
                      ? 'bg-[#0d47a1] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Top Recommendation Card */}
          {topVendor && (
            <div className="mb-4 p-4 bg-white rounded-lg border-2 border-green-500 shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded">
                      RECOMMENDED
                    </span>
                    <h4 className="text-xl font-bold text-slate-900">{topVendor.vendor}</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    <div>
                      <div className="text-xs text-slate-500">SLA Compliance</div>
                      <div className="text-lg font-semibold text-green-700">{topVendor.slaCompliance}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Delivery Time</div>
                      <div className="text-lg font-semibold text-blue-700">{topVendor.deliveryTime} days</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Satisfaction</div>
                      <div className="text-lg font-semibold text-purple-700">{topVendor.satisfaction} / 5.0</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Success Rate</div>
                      <div className="text-lg font-semibold text-indigo-700">{topVendor.successRate}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Suppliers Comparison */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="text-sm font-semibold mb-3 text-slate-700">All Suppliers - Compare Performance</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Vendor</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">SLA %</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Delivery</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Satisfaction</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Success</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Orders</th>
                    <th className="text-left px-3 py-2 font-semibold text-slate-700">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierData.slice(0, 6).map((supplier, idx) => (
                    <tr
                      key={`${supplier.vendor}-${supplier.region}`}
                      className={`border-b ${supplier.isRecommended ? 'bg-green-50' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                    >
                      <td className="px-3 py-2">
                        <div className="font-semibold text-slate-900">
                          {supplier.vendor}
                          {supplier.isRecommended && (
                            <span className="ml-2 text-xs text-green-600 font-bold">✓ Best</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`font-medium ${
                          supplier.slaCompliance >= 90 ? 'text-green-700' :
                          supplier.slaCompliance >= 85 ? 'text-blue-700' : 'text-slate-600'
                        }`}>
                          {supplier.slaCompliance}%
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`font-medium ${
                          supplier.deliveryTime <= 4 ? 'text-green-700' :
                          supplier.deliveryTime <= 6 ? 'text-blue-700' : 'text-slate-600'
                        }`}>
                          {supplier.deliveryTime}d
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="font-medium text-purple-700">
                          {supplier.satisfaction} / 5.0
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`font-medium ${
                          supplier.successRate >= 90 ? 'text-green-700' :
                          supplier.successRate >= 85 ? 'text-blue-700' : 'text-slate-600'
                        }`}>
                          {supplier.successRate}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-600">{supplier.orderVolume}</td>
                      <td className="px-3 py-2">
                        <span className="font-bold text-slate-900">{supplier.recommendationScore}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Performance Visualization */}
      {selectedProduct && supplierData.length > 0 && (
        <div className="bg-white rounded-lg border-2 p-4">
          <h3 className="text-lg font-semibold mb-2 text-slate-800">
            Supplier Performance Comparison
            {selectedProduct && ` - ${selectedProduct}`}
            {selectedRegion && ` in ${selectedRegion}`}
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Compare vendor performance across key metrics to make the best recommendation
          </p>
          <VegaLiteViz spec={{
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            description: 'Supplier Performance Comparison',
            width: 'container',
            height: 400,
            data: { values: supplierData.slice(0, 6) },
            layer: [
              {
                mark: {
                  type: 'bar',
                  tooltip: true,
                },
                encoding: {
                  x: {
                    field: 'vendor',
                    type: 'nominal',
                    title: 'Vendor',
                    sort: { field: 'recommendationScore', order: 'descending' },
                  },
                  y: {
                    field: 'slaCompliance',
                    type: 'quantitative',
                    title: 'SLA Compliance (%)',
                    axis: { format: '.0f%' },
                  },
                  color: {
                    field: 'isRecommended',
                    type: 'nominal',
                    title: 'Recommended',
                    scale: {
                      domain: [true, false],
                      range: ['#10b981', '#64748b'],
                    },
                  },
                  tooltip: [
                    { field: 'vendor', type: 'nominal', title: 'Vendor' },
                    { field: 'region', type: 'nominal', title: 'Region' },
                    { field: 'slaCompliance', type: 'quantitative', title: 'SLA Compliance', format: '.0f%' },
                    { field: 'deliveryTime', type: 'quantitative', title: 'Delivery Time', format: '.1f days' },
                    { field: 'satisfaction', type: 'quantitative', title: 'Satisfaction', format: '.1f' },
                    { field: 'successRate', type: 'quantitative', title: 'Success Rate', format: '.0f%' },
                    { field: 'recommendationScore', type: 'quantitative', title: 'Recommendation Score' },
                  ],
                },
              },
            ],
          }} width="100%" height="400px" />
        </div>
      )}

      {/* Product Bundling - Key Upsell Section */}
      {bundlingData.length > 0 && bundlingSpec && (
        <>
          <div className="bg-white rounded-lg border-2 p-4">
            <h3 className="text-lg font-semibold mb-2 text-slate-800">
              Product Bundling & Upsell Opportunities
              {selectedProduct && ` - Cross-Sells for ${selectedProduct}`}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {selectedProduct
                ? `Products that frequently sell with ${selectedProduct}. The height shows attach rate (how often they're purchased together), and the color shows correlation strength. Numbers on top show upsell probability.`
                : 'Product pairs that frequently sell together. Higher bars indicate better attach rates, darker colors show stronger correlation. Use this to identify your best cross-sell opportunities.'
              }
            </p>
            {bundlingData.length > 0 ? (
              <VegaLiteViz spec={bundlingSpec} width="100%" height="400px" />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-slate-400">
                Select a product to see bundling opportunities
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border-2 p-4">
            <h3 className="text-lg font-semibold mb-2 text-slate-800">
              {selectedProduct ? `Cross-Sell Probability for ${selectedProduct}` : 'Upsell Probability Matrix'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {selectedProduct
                ? `Ranked list of products that pair best with ${selectedProduct}. Higher bars and darker colors indicate higher upsell probability. Use this to prioritize which products to recommend first.`
                : 'Heatmap showing all product combinations and their upsell probabilities. Darker colors and larger bubbles indicate higher probability and more bundle sales. Perfect for discovering hidden cross-sell opportunities.'
              }
            </p>
            {bundlingData.length > 0 && upsellHeatmapSpec ? (
              <VegaLiteViz spec={upsellHeatmapSpec} width="100%" height={selectedProduct ? "350px" : "400px"} />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-slate-400">
                Select a product to see cross-sell probabilities
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};

