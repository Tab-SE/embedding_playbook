"use client";

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { TableauEmbed } from '@/components';

export const description = "Select a product type to find the right supplier";

// Color palette for product tiles
const productColors = ['#0d47a1', '#1565c0', '#1976d2', '#1e88e5', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9'];

export const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [vizReady, setVizReady] = useState(false);

  // Function to get available product values from the viz
  const getProductsFromViz = async (viz) => {
    if (!viz || !viz.workbook) {
      return;
    }

    try {
      const activeSheet = viz.workbook.activeSheet;
      const worksheets = activeSheet.worksheets || [];

      console.log('Number of worksheets:', worksheets.length);

      // Try to get product values from all worksheets
      for (const worksheet of worksheets) {
        try {
          console.log('Getting summary data from worksheet:', worksheet.name);
          const dataTable = await worksheet.getSummaryDataAsync();
          console.log('Data table:', dataTable);
          console.log('Data table columns:', dataTable.columns);

          // Log all column names to debug
          if (dataTable.columns) {
            console.log('Available columns:', dataTable.columns.map(col => col.fieldName));
          }

          // Look for Product column in the data - try common variations
          const productColumn = dataTable.columns?.find(col =>
            col.fieldName === 'Product' ||
            col.fieldName === 'Product Type' ||
            col.fieldName === 'Product Category' ||
            col.fieldName?.toLowerCase().includes('product')
          );

          console.log('Product column found:', productColumn);

          if (productColumn) {
            const productColumnIndex = productColumn.index;
            const productValues = new Set();

            console.log('Processing data rows:', dataTable.data?.length);
            dataTable.data?.forEach(row => {
              const cell = row[productColumnIndex];
              if (cell && cell.value) {
                productValues.add(cell.value);
              }
            });

            console.log('Unique products found:', Array.from(productValues));

            if (productValues.size > 0) {
              const sortedProducts = Array.from(productValues).sort();
              setAvailableProducts(sortedProducts);
              return; // Found products, exit
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
    const setupListeners = () => {
      let productViz = document.getElementById('telarusProductSales');

      // If not found by ID, try finding any tableau-viz element
      if (!productViz) {
        const tableauVizElements = document.querySelectorAll('tableau-viz');
        if (tableauVizElements.length > 0) {
          productViz = tableauVizElements[0];
        }
      }

      console.log('🔍 Setting up product listeners...');
      console.log('🔍 Product Viz found:', !!productViz);

      if (productViz) {
        // Remove any existing listeners to avoid duplicates
        const handleFirstInteractive = async (event) => {
          console.log('🎉 Product dashboard is now interactive!');
          setVizReady(true);

          // Get available products once the viz is interactive
          console.log('Calling getProductsFromViz...');
          await getProductsFromViz(productViz);
          console.log('getProductsFromViz completed');
        };

        productViz.addEventListener('firstinteractive', handleFirstInteractive);

        // Store reference for cleanup
        window._telarusVizRef = { productViz, handleFirstInteractive };
      } else {
        console.log('❌ Product Viz NOT FOUND! Retrying...');
        // Retry after a delay if viz not found
        setTimeout(() => setupListeners(), 500);
        return;
      }
    };

    // Start trying to setup listeners after initial delay
    const timer = setTimeout(() => {
      setupListeners();
    }, 500);

    return () => {
      clearTimeout(timer);
      // Cleanup event listener if it was set up
      if (window._telarusVizRef) {
        const { productViz, handleFirstInteractive } = window._telarusVizRef;
        if (productViz && handleFirstInteractive) {
          productViz.removeEventListener('firstinteractive', handleFirstInteractive);
        }
        delete window._telarusVizRef;
      }
    };
  }, []);

  // Apply filter when selectedProduct changes
  useEffect(() => {
    // Don't apply filter if viz is not ready yet
    if (!vizReady) {
      return;
    }

    const applyFilter = async () => {
      const fieldName = 'Product'; // Adjust field name if needed
      const filterValue = selectedProduct ? [selectedProduct] : [];

      const applyFilterToViz = async () => {
        let viz = document.getElementById('telarusProductSales');

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
          // Check if workbook exists by accessing it safely
          if (!viz.workbook) {
            setTimeout(() => applyFilterToViz(), 500);
            return;
          }
        } catch (error) {
          // Viz workbook not ready yet
          setTimeout(() => applyFilterToViz(), 500);
          return;
        }

        try {
          const activeSheet = viz.workbook.activeSheet;

          if (!activeSheet) {
            setTimeout(() => applyFilterToViz(), 500);
            return;
          }

          if (activeSheet.sheetType === 'dashboard') {
            const worksheets = activeSheet.worksheets;

            for (const worksheet of worksheets) {
              if (filterValue.length === 0) {
                await worksheet.clearFilterAsync(fieldName);
              } else {
                await worksheet.applyFilterAsync(fieldName, filterValue, 'replace');
              }
            }
          } else {
            if (filterValue.length === 0) {
              await activeSheet.clearFilterAsync(fieldName);
            } else {
              await activeSheet.applyFilterAsync(fieldName, filterValue, 'replace');
            }
          }
        } catch (error) {
          console.error('Error applying filter:', error);
          // Try alternative field names if first attempt fails
          try {
            const activeSheet = viz.workbook?.activeSheet;
            if (!activeSheet) {
              setTimeout(() => applyFilterToViz(), 500);
              return;
            }

            const alternativeNames = ['Product Type', 'Product Category'];
            for (const altName of alternativeNames) {
              try {
                if (activeSheet.sheetType === 'dashboard') {
                  const worksheets = activeSheet.worksheets;
                  for (const worksheet of worksheets) {
                    if (filterValue.length === 0) {
                      await worksheet.clearFilterAsync(altName);
                    } else {
                      await worksheet.applyFilterAsync(altName, filterValue, 'replace');
                    }
                  }
                } else {
                  if (filterValue.length === 0) {
                    await activeSheet.clearFilterAsync(altName);
                  } else {
                    await activeSheet.applyFilterAsync(altName, filterValue, 'replace');
                  }
                }
                break; // Success, exit loop
              } catch (altError) {
                // Continue to next alternative
              }
            }
          } catch (retryError) {
            // If still failing, retry after delay
            setTimeout(() => applyFilterToViz(), 500);
          }
        }
      };

      await applyFilterToViz();
    };

    applyFilter();
  }, [selectedProduct, vizReady]);

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
              Choose a product category to explore suppliers and find the best fit for your customers
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

            <div className="mt-8">
              <Card className='border-2'>
                <CardHeader>
                  <CardTitle className="text-lg">Product Sales Dashboard</CardTitle>
                  <CardDescription>
                    Interactive dashboard showing product sales trends and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
                  <div className="w-full overflow-auto">
                    <TableauEmbed
                      id="telarusProductSales"
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
};

