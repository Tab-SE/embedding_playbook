"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Building2, ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { SupplierPerformanceDashboard } from '@/components/CustomDashboards';
import { vendors, products } from '../data/mockData';

export const description = "Select a vendor and view supplier metrics - Custom Dashboard Demo";

const CustomVendorsContent = () => {
  const params = useSearchParams();
  const router = useRouter();
  const productId = params.get('product') || 'internet';
  const product = products.find(p => p.id === productId);
  const vendorList = vendors[productId] || [];

  // Map productId to product name for dashboard filtering
  const productNameMap = {
    'internet': 'Internet',
    'voice': 'Voice',
    'cloud': 'Cloud',
    'security': 'Security',
  };
  const selectedProductName = productNameMap[productId] || null;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push('/demo/telarus/custom')}
            className="flex items-center gap-2 text-slate-600 hover:text-[#0d47a1]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>
        </div>

        <Card className='shadow-xl bg-white'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#0d47a1]" />
              Select Vendor for {product?.name}
            </CardTitle>
            <CardDescription>
              Choose a supplier based on performance metrics and your past selections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {vendorList.map(vendor => (
                <button
                  key={vendor.id}
                  onClick={() => router.push(`/demo/telarus/custom/tracking?vendor=${vendor.id}&product=${productId}`)}
                  className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 hover:border-[#fb8c00] hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <img src={vendor.logo} alt={vendor.name} className="h-12 w-12 object-contain"/>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-slate-900 group-hover:text-[#0d47a1] transition-colors">
                        {vendor.name}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">{vendor.summary}</div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {vendor.pastSelections} past selections
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Card className='border-2'>
                <CardHeader>
                  <CardTitle className="text-lg">Supplier Performance & Insights</CardTitle>
                  <CardDescription>
                    Interactive dashboard showing supplier metrics, product sales trends, and cross-sell opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <SupplierPerformanceDashboard selectedProduct={selectedProductName} />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export const CustomVendors = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomVendorsContent />
    </Suspense>
  );
};

