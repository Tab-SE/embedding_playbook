"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Truck, ArrowLeft, CheckCircle2, Clock, Package } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { OrderTrackingDashboard } from '@/components/CustomDashboards';
import { orders } from '../data/mockData';

export const description = "Track your orders and view order details - Custom Dashboard Demo";

const CustomOrderTrackingContent = () => {
  const params = useSearchParams();
  const router = useRouter();
  const orderSku = params.get('order');
  const vendorId = params.get('vendor');

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'installed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'provisioning':
        return <Clock className="h-5 w-5 text-[#fb8c00]" />;
      default:
        return <Package className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push(`/demo/telarus/custom/vendors?product=${vendorId || ''}`)}
            className="flex items-center gap-2 text-slate-600 hover:text-[#0d47a1]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vendors
          </button>
        </div>

        <Card className='shadow-xl bg-white'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#0d47a1]" />
              Order Tracking
            </CardTitle>
            <CardDescription>
              View order status and tracking information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-[#0d47a1] to-[#1565c0] text-white">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold">Order ID</th>
                    <th className="text-left px-6 py-3 font-semibold">Vendor</th>
                    <th className="text-left px-6 py-3 font-semibold">SKU</th>
                    <th className="text-left px-6 py-3 font-semibold">Status</th>
                    <th className="text-left px-6 py-3 font-semibold">Tracking</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {orders.map((order, idx) => {
                    const isNewOrder = orderSku && order.sku === orderSku;
                    return (
                      <tr
                        key={order.id}
                        className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} ${isNewOrder ? 'bg-blue-50 border-l-4 border-l-[#0d47a1]' : ''}`}
                      >
                        <td className="px-6 py-4 font-mono text-slate-700">{order.id}</td>
                        <td className="px-6 py-4 text-slate-900">{order.vendor}</td>
                        <td className="px-6 py-4 font-mono text-slate-700">{order.sku}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="text-slate-900">{order.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">{order.tracking}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {orders.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No orders found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card className='border-2'>
            <CardHeader>
              <CardTitle className="text-lg">Order Details Dashboard</CardTitle>
              <CardDescription>
                Interactive dashboard showing detailed order information and tracking data
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <OrderTrackingDashboard selectedProduct={null} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export const CustomOrderTracking = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomOrderTrackingContent />
    </Suspense>
  );
};

