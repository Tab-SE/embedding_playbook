"use client";

import { useState } from 'react';
import { Package } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { ProductSalesDashboard } from '@/components/CustomDashboards';

export const description = "Select a product type to find the right supplier - Insights Dashboard";

// Color palette for product tiles
const productColors = ['#0d47a1', '#1565c0', '#1976d2', '#1e88e5', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9'];

const availableProducts = ['Internet', 'Voice', 'Cloud', 'Security', 'Managed Services', 'SD-WAN'];

export const InsightsProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = (productName) => {
    // Toggle selection - if same product clicked, deselect it
    setSelectedProduct(productName === selectedProduct ? null : productName);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className='shadow-xl bg-white'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#0d47a1]" />
              Select Product Type
            </CardTitle>
            <CardDescription>
              Choose a product category to explore suppliers and find cross-sell opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableProducts.map((productName, index) => {
                const isSelected = selectedProduct === productName;
                const colorIndex = index % productColors.length;
                return (
                  <button
                    key={productName}
                    onClick={() => handleProductSelect(productName)}
                    className={`rounded-xl border-2 bg-gradient-to-br from-white to-slate-50 p-6 hover:border-[#fb8c00] hover:shadow-lg transition-all text-left group ${
                      isSelected ? 'border-[#fb8c00] shadow-lg' : 'border-slate-200'
                    }`}
                  >
                    <div
                      className="h-12 w-12 rounded-lg mb-3 flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: productColors[colorIndex] }}
                    >
                      {productName.charAt(0)}
                    </div>
                    <div className={`font-semibold transition-colors ${
                      isSelected ? 'text-[#0d47a1]' : 'text-slate-900 group-hover:text-[#0d47a1]'
                    }`}>
                      {productName}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <Card className='border-2'>
                <CardHeader>
                  <CardTitle className="text-lg">Product Sales & Cross-Sell Insights</CardTitle>
                  <CardDescription>
                    Interactive dashboard showing product sales trends, cross-sell opportunities, and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ProductSalesDashboard selectedProduct={selectedProduct} />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

