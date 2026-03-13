"use client";
import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#17a2b8'];

/**
 * Smart Chart Component - Auto-detects chart type from data
 * Based on e-bikes demo pattern
 */
export function SmartChart({ data, title }) {
  if (!data || data.length === 0) return null;

  const chartConfig = detectChartType(data);
  if (!chartConfig) return null;

  return (
    <div className="my-6 p-4 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-stone-900 dark:text-stone-100">
          📊 {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        {chartConfig.type === 'line' ? (
          <LineChart data={chartConfig.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey={chartConfig.xKey}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => formatNumber(value, chartConfig.yKey, true)}
            />
            <Tooltip
              formatter={(value) => formatNumber(value, chartConfig.yKey, false)}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={chartConfig.yKey}
              stroke={COLORS[0]}
              strokeWidth={3}
              dot={{ fill: COLORS[0], r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        ) : (
          <BarChart data={chartConfig.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey={chartConfig.xKey}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => formatNumber(value, chartConfig.yKey, true)}
            />
            <Tooltip
              formatter={(value) => formatNumber(value, chartConfig.yKey, false)}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar
              dataKey={chartConfig.yKey}
              fill={COLORS[0]}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

// Detect if a field represents currency
function isCurrencyField(fieldName) {
  const currencyKeywords = [
    'sales', 'revenue', 'profit', 'income', 'cost', 'price', 'amount',
    'total', 'gross', 'net', 'value', 'margin'
  ];
  const lowerField = fieldName.toLowerCase();
  return currencyKeywords.some(keyword => lowerField.includes(keyword));
}

// Smart number formatter
function formatNumber(value, fieldName, useShortForm = true) {
  if (typeof value !== 'number') return value;

  if (isCurrencyField(fieldName)) {
    // Currency formatting
    if (useShortForm) {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
      return `$${value.toLocaleString()}`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  } else {
    // Non-currency formatting
    if (useShortForm) {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value.toLocaleString();
    } else {
      return value.toLocaleString();
    }
  }
}

// Auto-detect chart type from data structure
function detectChartType(data) {
  if (!data || data.length === 0) return null;

  const firstRow = data[0];
  const keys = Object.keys(firstRow);

  if (keys.length < 2) return null;

  // Find numeric columns
  const numericKeys = keys.filter(key => {
    return data.some(row => typeof row[key] === 'number');
  });

  if (numericKeys.length === 0) return null;

  // Detect date/time columns
  const dateKeys = keys.filter(key => {
    const isDateFieldName = /date|time|year|month|quarter|period|day|week/i.test(key);

    if (isDateFieldName) {
      return data.some(row => {
        const value = row[key];
        if (typeof value === 'number') {
          return value >= 1900 && value <= 2100; // Year range
        }
        if (typeof value === 'string') {
          return (
            /^\d{4}$/.test(value) || // Year only
            /\d{4}-\d{2}-\d{2}/.test(value) || // YYYY-MM-DD
            /\w+ \d{4}/.test(value) // Month Year
          );
        }
        return false;
      });
    }
    return false;
  });

  // Smart chart type selection
  let chartType = 'bar';
  let xKey = keys[0];
  let yKey = numericKeys[0];

  // If we have date fields, use line chart for trends
  if (dateKeys.length > 0) {
    chartType = 'line';
    xKey = dateKeys[0];

    // Sort by date for proper chronological order
    data.sort((a, b) => {
      const aVal = a[xKey];
      const bVal = b[xKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal - bVal;
      }
      return String(aVal).localeCompare(String(bVal));
    });
  }

  return {
    type: chartType,
    data: data,
    xKey: xKey,
    yKey: yKey,
    title: `${xKey} vs ${yKey}`
  };
}

/**
 * Parse markdown table from text
 */
export function parseMarkdownTable(text) {
  if (!text) return null;

  try {
    // Find markdown table pattern
    const tableRegex = /\|(.+)\|\s*\n\s*\|[\s\-\|:]+\|\s*\n((?:\s*\|.+\|\s*\n?)+)/g;
    const match = tableRegex.exec(text);

    if (!match) return null;

    const headerRow = match[1];
    const dataRows = match[2];

    // Parse headers
    const headers = headerRow.split('|')
      .map(h => h.trim())
      .filter(h => h.length > 0);

    if (headers.length === 0) return null;

    // Parse data rows
    const rows = dataRows.split('\n')
      .filter(row => row.trim().length > 0)
      .map(row => {
        const cells = row.split('|')
          .map(cell => cell.trim())
          .filter((cell, index, arr) => {
            // Filter out empty cells at start/end
            return !(cell === '' && (index === 0 || index === arr.length - 1));
          });

        const rowObj = {};
        headers.forEach((header, index) => {
          if (index < cells.length) {
            let value = cells[index];

            // Clean up formatting and convert to numbers
            if (value.startsWith('$')) {
              const numValue = parseFloat(value.replace(/[$,]/g, ''));
              rowObj[header] = isNaN(numValue) ? value : numValue;
            } else if (!isNaN(Number(value.replace(/,/g, ''))) && value !== '') {
              rowObj[header] = Number(value.replace(/,/g, ''));
            } else {
              rowObj[header] = value;
            }
          }
        });

        return rowObj;
      })
      .filter(row => Object.keys(row).length > 0);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.warn('Error parsing markdown table:', error);
    return null;
  }
}
