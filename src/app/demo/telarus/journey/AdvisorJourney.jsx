"use client";

import { useState, useEffect } from 'react';
import { Package, Building2, List, Truck, ArrowLeft, ArrowRight, CheckCircle2, Clock, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";

import { TableauEmbed } from '@/components';

export const description = "Complete advisor journey from product selection to order tracking";

// Mock data for demonstration
const mockVendors = {
  'Internet': [
    { 
      id: 'fastfiber', 
      name: 'FastFiber', 
      logo: '/img/tableau/logo_text.png', 
      summary: 'Nationwide fiber with competitive SLAs',
      pastSelections: 42,
      offerings: ['Fiber Internet 100-1000 Mbps', 'Dedicated Internet Access', 'SD-WAN Solutions', 'Network Security']
    },
    { 
      id: 'netwave', 
      name: 'NetWave', 
      logo: '/img/tableau/logo_text_gray.png', 
      summary: 'High-availability broadband portfolio',
      pastSelections: 31,
      offerings: ['Broadband Internet', 'Wi-Fi Solutions', 'Business Internet', 'Managed Services']
    },
  ],
  'Voice': [
    { 
      id: 'clearcall', 
      name: 'ClearCall', 
      logo: '/img/tableau/logo_text.png', 
      summary: 'SIP trunking and UCaaS at scale',
      pastSelections: 25,
      offerings: ['SIP Trunking', 'VoIP Phone Systems', 'Cloud PBX', 'Video Conferencing']
    },
  ],
  'Cloud': [
    { 
      id: 'skycompute', 
      name: 'SkyCompute', 
      logo: '/img/tableau/logo_text.png', 
      summary: 'Elastic compute and storage',
      pastSelections: 18,
      offerings: ['Cloud Storage', 'Virtual Servers', 'Database Hosting', 'Backup Solutions']
    },
  ],
};

const mockSkus = {
  'fastfiber': [
    { sku: 'FF-100', name: 'FastFiber 100 Mbps', price: '$120/mo', description: '100 Mbps symmetrical fiber connection' },
    { sku: 'FF-500', name: 'FastFiber 500 Mbps', price: '$220/mo', description: '500 Mbps symmetrical fiber connection' },
    { sku: 'FF-1000', name: 'FastFiber 1000 Mbps', price: '$350/mo', description: '1 Gbps symmetrical fiber connection' },
  ],
  'netwave': [
    { sku: 'NW-Ultra', name: 'NetWave Ultra Broadband', price: '$99/mo', description: 'Ultra-fast broadband connection' },
    { sku: 'NW-Business', name: 'NetWave Business', price: '$149/mo', description: 'Business-grade broadband with priority support' },
  ],
  'clearcall': [
    { sku: 'CC-SIP-10', name: 'ClearCall SIP Trunk 10 Channel', price: '$45/mo', description: '10 concurrent call channels' },
    { sku: 'CC-PBX-Pro', name: 'ClearCall PBX Professional', price: '$29/user/mo', description: 'Full-featured cloud PBX per user' },
  ],
  'skycompute': [
    { sku: 'SC-Standard', name: 'SkyCompute Standard', price: '$89/mo', description: 'Standard cloud compute resources' },
    { sku: 'SC-Premium', name: 'SkyCompute Premium', price: '$199/mo', description: 'Premium cloud compute with SLA' },
  ],
};

const mockOrders = [
  { id: 'ORD-1001', vendor: 'FastFiber', sku: 'FF-100', status: 'Provisioning', tracking: 'TRK-7781', date: '2024-01-15' },
  { id: 'ORD-1002', vendor: 'NetWave', sku: 'NW-Ultra', status: 'Installed', tracking: 'TRK-7782', date: '2024-01-10' },
  { id: 'ORD-1003', vendor: 'ClearCall', sku: 'CC-PBX-Pro', status: 'Provisioning', tracking: 'TRK-7783', date: '2024-01-18' },
];

// Color palette for product tiles
const productColors = ['#0d47a1', '#1565c0', '#1976d2', '#1e88e5', '#2196f3', '#42a5f5'];

export const AdvisorJourney = () => {
  const [step, setStep] = useState(1); // 1: Products, 2: Vendors, 3: SKUs, 4: Orders
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vizReady, setVizReady] = useState(false);

  // Function to get available product values from the viz
  const getProductsFromViz = async (viz) => {
    if (!viz || !viz.workbook) {
      return;
    }

    try {
      const activeSheet = viz.workbook.activeSheet;
      const worksheets = activeSheet.worksheets || [];

      for (const worksheet of worksheets) {
        try {
          const dataTable = await worksheet.getSummaryDataAsync();

          const productColumn = dataTable.columns?.find(col =>
            col.fieldName === 'Product' || 
            col.fieldName === 'Product Type' || 
            col.fieldName === 'Product Category' ||
            col.fieldName?.toLowerCase().includes('product')
          );

          if (productColumn) {
            const productColumnIndex = productColumn.index;
            const productValues = new Set();

            dataTable.data?.forEach(row => {
              const cell = row[productColumnIndex];
              if (cell && cell.value) {
                productValues.add(cell.value);
              }
            });

            if (productValues.size > 0) {
              const sortedProducts = Array.from(productValues).sort();
              setAvailableProducts(sortedProducts);
              return;
            }
          }
        } catch (error) {
          console.error('Error getting summary data from worksheet:', error);
        }
      }
    } catch (error) {
      console.error('Error getting products from viz:', error);
    }
  };

  // Listen for viz interactive event to get product values
  useEffect(() => {
    if (step !== 1) return; // Only setup on Products step

    const setupListeners = () => {
      let productViz = document.getElementById('advisorProductDashboard');

      if (!productViz) {
        const tableauVizElements = document.querySelectorAll('tableau-viz');
        if (tableauVizElements.length > 0) {
          productViz = tableauVizElements[0];
        }
      }

      if (productViz) {
        const handleFirstInteractive = async (event) => {
          setVizReady(true);
          await getProductsFromViz(productViz);
        };

        productViz.addEventListener('firstinteractive', handleFirstInteractive);
        window._advisorVizRef = { productViz, handleFirstInteractive };
      } else {
        setTimeout(() => setupListeners(), 500);
      }
    };

    const timer = setTimeout(() => setupListeners(), 500);

    return () => {
      clearTimeout(timer);
      if (window._advisorVizRef) {
        const { productViz, handleFirstInteractive } = window._advisorVizRef;
        if (productViz && handleFirstInteractive) {
          productViz.removeEventListener('firstinteractive', handleFirstInteractive);
        }
        delete window._advisorVizRef;
      }
    };
  }, [step]);

  // Apply filter when selectedProduct changes
  useEffect(() => {
    if (!vizReady || !selectedProduct || step !== 1) return;

    const applyFilter = async () => {
      const fieldName = 'Product';
      const filterValue = [selectedProduct];

      const applyFilterToViz = async () => {
        let viz = document.getElementById('advisorProductDashboard');

        if (!viz) {
          const tableauVizElements = document.querySelectorAll('tableau-viz');
          if (tableauVizElements.length > 0) {
            viz = tableauVizElements[0];
          }
        }

        if (!viz) {
          setTimeout(() => applyFilterToViz(), 500);
          return;
        }

        try {
          if (!viz.workbook) {
            setTimeout(() => applyFilterToViz(), 500);
            return;
          }

          const activeSheet = viz.workbook.activeSheet;
          if (!activeSheet) {
            setTimeout(() => applyFilterToViz(), 500);
            return;
          }

          if (activeSheet.sheetType === 'dashboard') {
            const worksheets = activeSheet.worksheets;
            for (const worksheet of worksheets) {
              await worksheet.applyFilterAsync(fieldName, filterValue, 'replace');
            }
          } else {
            await activeSheet.applyFilterAsync(fieldName, filterValue, 'replace');
          }
        } catch (error) {
          console.error('Error applying filter:', error);
        }
      };

      await applyFilterToViz();
    };

    applyFilter();
  }, [selectedProduct, vizReady, step]);

  const handleProductSelect = (productName) => {
    setSelectedProduct(productName);
  };

  const handleContinueToVendors = () => {
    if (selectedProduct) {
      setStep(2);
      setSelectedVendor(null);
    }
  };

  const handleVendorSelect = (vendorId) => {
    setSelectedVendor(vendorId);
  };

  const handleContinueToSkus = () => {
    if (selectedVendor) {
      setStep(3);
    }
  };

  const handleSkuSelect = (sku) => {
    // Add to orders (in real app would create order)
    setStep(4);
  };

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

  // Step 1: Product Selection
  if (step === 1) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card className='shadow-xl bg-white'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[#0d47a1]" />
                Step 1: Select Product Type
              </CardTitle>
              <CardDescription>
                Choose a product category to explore suppliers and find cross-sell opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableProducts.length > 0 ? (
                  availableProducts.map((productName, index) => {
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
                  })
                ) : (
                  <div className="col-span-full text-center text-slate-500 py-8">
                    Loading products from dashboard...
                  </div>
                )}
              </div>

              {selectedProduct && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleContinueToVendors}
                    className="bg-[#0d47a1] hover:bg-[#1565c0] text-white"
                  >
                    View Vendors for {selectedProduct}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="mt-8">
                <Card className='border-2'>
                  <CardHeader>
                    <CardTitle className="text-lg">Product Sales & Cross-Sell Insights</CardTitle>
                    <CardDescription>
                      Interactive dashboard showing product sales trends, performance metrics, and cross-sell opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                    <div className="w-full overflow-auto">
                      <TableauEmbed
                        id="advisorProductDashboard"
                        src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/TelarusDemo/SoftSalesDashboard'
                        hideTabs={true}
                        toolbar='hidden'
                        width='100%'
                        height='1200px'
                        className='w-full'
                        layouts={{
                          'xs': { width: 1200, height: 1200, device: 'desktop' },
                          'sm': { width: 1200, height: 1200, device: 'desktop' },
                          'md': { width: 1400, height: 1200, device: 'desktop' },
                          'lg': { width: 1600, height: 1200, device: 'desktop' },
                          'xl': { width: 1800, height: 1200, device: 'desktop' },
                          'xl2': { width: 2000, height: 1200, device: 'desktop' },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Step 2: Vendor Selection
  if (step === 2) {
    const vendors = mockVendors[selectedProduct] || [];

    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card className='shadow-xl bg-white'>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#0d47a1]" />
                    Step 2: Select Vendor for {selectedProduct}
                  </CardTitle>
                  <CardDescription>
                    Choose a supplier based on performance metrics, past selections, and offerings
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {vendors.map(vendor => {
                  const isSelected = selectedVendor === vendor.id;
                  return (
                    <button
                      key={vendor.id}
                      onClick={() => handleVendorSelect(vendor.id)}
                      className={`rounded-xl border-2 bg-gradient-to-br from-white to-slate-50 p-6 hover:border-[#fb8c00] hover:shadow-lg transition-all text-left group ${
                        isSelected ? 'border-[#fb8c00] shadow-lg bg-blue-50' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <img src={vendor.logo} alt={vendor.name} className="h-12 w-12 object-contain"/>
                        <div className="flex-1">
                          <div className={`font-semibold text-lg transition-colors ${
                            isSelected ? 'text-[#0d47a1]' : 'text-slate-900 group-hover:text-[#0d47a1]'
                          }`}>
                            {vendor.name}
                          </div>
                          <div className="text-sm text-slate-600 mt-1">{vendor.summary}</div>
                          
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                {vendor.pastSelections} past selections
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="text-xs font-semibold text-slate-700 mb-1">What they offer:</div>
                              <ul className="text-xs text-slate-600 space-y-1">
                                {vendor.offerings.slice(0, 3).map((offering, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="mr-1">•</span>
                                    <span>{offering}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedVendor && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleContinueToSkus}
                    className="bg-[#0d47a1] hover:bg-[#1565c0] text-white"
                  >
                    View SKUs for {vendors.find(v => v.id === selectedVendor)?.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="mt-8">
                <Card className='border-2'>
                  <CardHeader>
                    <CardTitle className="text-lg">Supplier Performance & Insights</CardTitle>
                    <CardDescription>
                      Interactive dashboard showing supplier metrics, product sales trends, and cross-sell opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TableauEmbed
                      id="advisorVendorMetrics"
                      src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/TelarusDemo/SoftSalesDashboard'
                      hideTabs={true}
                      toolbar='hidden'
                      width='100%'
                      height='800px'
                      className='w-full'
                      layouts={{
                        'xs': { width: 1200, height: 800, device: 'desktop' },
                        'sm': { width: 1200, height: 800, device: 'desktop' },
                        'md': { width: 1400, height: 800, device: 'desktop' },
                        'lg': { width: 1600, height: 800, device: 'desktop' },
                        'xl': { width: 1800, height: 800, device: 'desktop' },
                        'xl2': { width: 2000, height: 800, device: 'desktop' },
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Step 3: SKU Selection
  if (step === 3) {
    const skus = mockSkus[selectedVendor] || [];
    const selectedVendorData = mockVendors[selectedProduct]?.find(v => v.id === selectedVendor);

    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card className='shadow-xl bg-white'>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5 text-[#0d47a1]" />
                    Step 3: Select SKU from {selectedVendorData?.name}
                  </CardTitle>
                  <CardDescription>
                    Choose a product SKU and pricing option for your customer
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {skus.map(sku => (
                  <button
                    key={sku.sku}
                    onClick={() => handleSkuSelect(sku)}
                    className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 hover:border-[#fb8c00] hover:shadow-lg transition-all text-left group"
                  >
                    <div className="font-semibold text-lg text-slate-900 group-hover:text-[#0d47a1] transition-colors">
                      {sku.name}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">{sku.description}</div>
                    <div className="mt-3 text-xl font-bold text-[#0d47a1]">{sku.price}</div>
                    <div className="mt-2 text-xs font-mono text-slate-500">SKU: {sku.sku}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Step 4: Order Tracking
  if (step === 4) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card className='shadow-xl bg-white'>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[#0d47a1]" />
                    Step 4: Order Tracking
                  </CardTitle>
                  <CardDescription>
                    Track your orders and view order details
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2"
                >
                  Start New Journey
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    {mockOrders.map((order, idx) => (
                      <tr
                        key={order.id}
                        className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
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
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <Card className='border-2'>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Details Dashboard</CardTitle>
                    <CardDescription>
                      Interactive dashboard showing detailed order information and tracking data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                    <div className="w-full overflow-auto">
                      <TableauEmbed
                        id="advisorOrderDetails"
                        src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/TelarusDemo/OrderDetails'
                        hideTabs={true}
                        toolbar='hidden'
                        width='100%'
                        height='1200px'
                        className='w-full'
                        layouts={{
                          'xs': { width: 1200, height: 1200, device: 'desktop' },
                          'sm': { width: 1200, height: 1200, device: 'desktop' },
                          'md': { width: 1400, height: 1200, device: 'desktop' },
                          'lg': { width: 1600, height: 1200, device: 'desktop' },
                          'xl': { width: 1800, height: 1200, device: 'desktop' },
                          'xl2': { width: 2000, height: 1200, device: 'desktop' },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return null;
};

