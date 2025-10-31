// Mock data generator for Telarus dashboards

// Products data
export const generateProductData = (filterProduct = null) => {
  const products = ['Internet', 'Voice', 'Cloud', 'Security', 'Managed Services', 'SD-WAN'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let data = [];
  products.forEach(product => {
    if (filterProduct && product !== filterProduct) return;
    
    months.forEach(month => {
      data.push({
        product,
        month,
        sales: Math.floor(Math.random() * 500000) + 100000,
        orders: Math.floor(Math.random() * 200) + 50,
        crossSellRate: Math.random() * 0.3 + 0.1,
      });
    });
  });
  
  return data;
};

// Cross-sell opportunities
export const generateCrossSellData = (filterProduct = null) => {
  const baseProducts = ['Internet', 'Voice', 'Cloud', 'Security'];
  const crossSellProducts = ['Managed Services', 'SD-WAN', 'Backup', 'Support'];
  
  let data = [];
  baseProducts.forEach(product => {
    if (filterProduct && product !== filterProduct) return;
    
    crossSellProducts.forEach(crossSell => {
      data.push({
        product,
        crossSell,
        attachRate: Math.random() * 0.4 + 0.15,
        revenue: Math.floor(Math.random() * 300000) + 50000,
        opportunities: Math.floor(Math.random() * 150) + 30,
      });
    });
  });
  
  return data;
};

// Product bundling - which products sell well together
export const generateProductBundlingData = (filterProduct = null) => {
  const products = ['Internet', 'Voice', 'Cloud', 'Security', 'Managed Services', 'SD-WAN'];
  
  // Define realistic product pairs and their correlation - comprehensive list
  const allProductPairs = [
    // Internet bundles (Internet as primary)
    { product1: 'Internet', product2: 'Voice', correlation: 0.78, attachRate: 0.45, bundleSales: 320 },
    { product1: 'Internet', product2: 'SD-WAN', correlation: 0.65, attachRate: 0.38, bundleSales: 280 },
    { product1: 'Internet', product2: 'Managed Services', correlation: 0.58, attachRate: 0.32, bundleSales: 245 },
    { product1: 'Internet', product2: 'Cloud', correlation: 0.55, attachRate: 0.29, bundleSales: 220 },
    { product1: 'Internet', product2: 'Security', correlation: 0.48, attachRate: 0.25, bundleSales: 195 },
    
    // Voice bundles (Voice as primary)
    { product1: 'Voice', product2: 'Cloud', correlation: 0.72, attachRate: 0.41, bundleSales: 295 },
    { product1: 'Voice', product2: 'Managed Services', correlation: 0.68, attachRate: 0.39, bundleSales: 275 },
    { product1: 'Voice', product2: 'Internet', correlation: 0.78, attachRate: 0.45, bundleSales: 320 },
    { product1: 'Voice', product2: 'Security', correlation: 0.61, attachRate: 0.35, bundleSales: 255 },
    
    // Cloud bundles (Cloud as primary)
    { product1: 'Cloud', product2: 'Security', correlation: 0.85, attachRate: 0.52, bundleSales: 380 },
    { product1: 'Cloud', product2: 'Managed Services', correlation: 0.75, attachRate: 0.43, bundleSales: 310 },
    { product1: 'Cloud', product2: 'Voice', correlation: 0.72, attachRate: 0.41, bundleSales: 295 },
    { product1: 'Cloud', product2: 'Internet', correlation: 0.55, attachRate: 0.29, bundleSales: 220 },
    
    // Security bundles (Security as primary)
    { product1: 'Security', product2: 'Managed Services', correlation: 0.71, attachRate: 0.40, bundleSales: 285 },
    { product1: 'Security', product2: 'Cloud', correlation: 0.85, attachRate: 0.52, bundleSales: 380 },
    { product1: 'Security', product2: 'Voice', correlation: 0.61, attachRate: 0.35, bundleSales: 255 },
    { product1: 'Security', product2: 'SD-WAN', correlation: 0.63, attachRate: 0.36, bundleSales: 260 },
    
    // Managed Services bundles
    { product1: 'Managed Services', product2: 'Internet', correlation: 0.58, attachRate: 0.32, bundleSales: 245 },
    { product1: 'Managed Services', product2: 'Voice', correlation: 0.68, attachRate: 0.39, bundleSales: 275 },
    { product1: 'Managed Services', product2: 'Security', correlation: 0.71, attachRate: 0.40, bundleSales: 285 },
    { product1: 'Managed Services', product2: 'Cloud', correlation: 0.75, attachRate: 0.43, bundleSales: 310 },
    
    // SD-WAN bundles
    { product1: 'SD-WAN', product2: 'Security', correlation: 0.63, attachRate: 0.36, bundleSales: 260 },
    { product1: 'SD-WAN', product2: 'Internet', correlation: 0.65, attachRate: 0.38, bundleSales: 280 },
    { product1: 'SD-WAN', product2: 'Cloud', correlation: 0.59, attachRate: 0.33, bundleSales: 235 },
  ];
  
  let data = [];
  
  if (filterProduct) {
    // When filtering, show pairs where selected product is primary
    allProductPairs.forEach(pair => {
      if (pair.product1 === filterProduct) {
        data.push({
          ...pair,
          upsellProbability: pair.correlation * 100,
          expectedRevenue: pair.bundleSales * 1200,
        });
      }
    });
  } else {
    // When no filter, show all unique pairs (avoid duplicates)
    const seenPairs = new Set();
    allProductPairs.forEach(pair => {
      const pairKey = `${pair.product1}-${pair.product2}`;
      if (!seenPairs.has(pairKey)) {
        seenPairs.add(pairKey);
        data.push({
          ...pair,
          upsellProbability: pair.correlation * 100,
          expectedRevenue: pair.bundleSales * 1200,
        });
      }
    });
  }
  
  // Sort by correlation/attach rate to show best opportunities first
  return data.sort((a, b) => b.correlation - a.correlation);
};

// Supplier performance data by region and product
export const generateSupplierByRegionData = (filterProduct = null, filterRegion = null) => {
  const vendors = ['FastFiber', 'NetWave', 'ClearCall', 'SkyCompute', 'SecureEdge', 'TelcoPro'];
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const products = ['Internet', 'Voice', 'Cloud', 'Security', 'Managed Services', 'SD-WAN'];
  
  // Define which vendors excel at which products in which regions
  const vendorSpecialties = {
    'Internet': {
      'North': { best: 'FastFiber', second: 'NetWave' },
      'South': { best: 'NetWave', second: 'FastFiber' },
      'East': { best: 'FastFiber', second: 'TelcoPro' },
      'West': { best: 'NetWave', second: 'FastFiber' },
      'Central': { best: 'TelcoPro', second: 'FastFiber' },
    },
    'Voice': {
      'North': { best: 'ClearCall', second: 'TelcoPro' },
      'South': { best: 'TelcoPro', second: 'ClearCall' },
      'East': { best: 'ClearCall', second: 'SkyCompute' },
      'West': { best: 'TelcoPro', second: 'ClearCall' },
      'Central': { best: 'ClearCall', second: 'TelcoPro' },
    },
    'Cloud': {
      'North': { best: 'SkyCompute', second: 'SecureEdge' },
      'South': { best: 'SkyCompute', second: 'SecureEdge' },
      'East': { best: 'SkyCompute', second: 'TelcoPro' },
      'West': { best: 'SecureEdge', second: 'SkyCompute' },
      'Central': { best: 'SkyCompute', second: 'SecureEdge' },
    },
    'Security': {
      'North': { best: 'SecureEdge', second: 'SkyCompute' },
      'South': { best: 'SecureEdge', second: 'TelcoPro' },
      'East': { best: 'SecureEdge', second: 'SkyCompute' },
      'West': { best: 'SecureEdge', second: 'NetWave' },
      'Central': { best: 'SecureEdge', second: 'SkyCompute' },
    },
    'Managed Services': {
      'North': { best: 'TelcoPro', second: 'SecureEdge' },
      'South': { best: 'TelcoPro', second: 'ClearCall' },
      'East': { best: 'TelcoPro', second: 'SecureEdge' },
      'West': { best: 'TelcoPro', second: 'SkyCompute' },
      'Central': { best: 'TelcoPro', second: 'SecureEdge' },
    },
    'SD-WAN': {
      'North': { best: 'NetWave', second: 'FastFiber' },
      'South': { best: 'FastFiber', second: 'NetWave' },
      'East': { best: 'NetWave', second: 'FastFiber' },
      'West': { best: 'FastFiber', second: 'NetWave' },
      'Central': { best: 'NetWave', second: 'FastFiber' },
    },
  };
  
  let data = [];
  const regionsToShow = filterRegion ? [filterRegion] : regions;
  const productsToShow = filterProduct ? [filterProduct] : products;
  
  regionsToShow.forEach(region => {
    productsToShow.forEach(product => {
      vendors.forEach(vendor => {
        const specialty = vendorSpecialties[product]?.[region];
        const isBest = specialty?.best === vendor;
        const isSecond = specialty?.second === vendor;
        
        // Base values that vary by vendor performance
        let slaCompliance = 75 + Math.random() * 20; // 75-95%
        let deliveryTime = 5 + Math.random() * 5; // 5-10 days
        let satisfaction = 4.0 + Math.random() * 1.5; // 4.0-5.5
        let successRate = 80 + Math.random() * 15; // 80-95%
        
        // Boost performance for specialty vendors
        if (isBest) {
          slaCompliance = 88 + Math.random() * 7; // 88-95%
          deliveryTime = 3 + Math.random() * 2; // 3-5 days
          satisfaction = 4.5 + Math.random() * 0.5; // 4.5-5.0
          successRate = 90 + Math.random() * 5; // 90-95%
        } else if (isSecond) {
          slaCompliance = 82 + Math.random() * 8; // 82-90%
          deliveryTime = 4 + Math.random() * 2; // 4-6 days
          satisfaction = 4.3 + Math.random() * 0.7; // 4.3-5.0
          successRate = 85 + Math.random() * 8; // 85-93%
        }
        
        data.push({
          vendor,
          region,
          product,
          slaCompliance: Math.round(slaCompliance),
          deliveryTime: Number(deliveryTime.toFixed(1)),
          satisfaction: Number(satisfaction.toFixed(1)),
          successRate: Math.round(successRate),
          isRecommended: isBest,
          recommendationScore: isBest ? 95 : (isSecond ? 88 : Math.round(70 + Math.random() * 15)),
          orderVolume: isBest ? Math.floor(300 + Math.random() * 200) : Math.floor(100 + Math.random() * 150),
        });
      });
    });
  });
  
  // Sort by recommendation score
  return data.sort((a, b) => b.recommendationScore - a.recommendationScore);
};

// Supplier performance data (legacy - keeping for backward compatibility)
export const generateSupplierData = (filterProduct = null) => {
  const vendors = ['FastFiber', 'NetWave', 'ClearCall', 'SkyCompute', 'SecureEdge', 'TelcoPro'];
  const metrics = ['Delivery Time', 'SLA Compliance', 'Customer Satisfaction', 'Upsell Rate', 'Revenue'];
  
  let data = [];
  vendors.forEach(vendor => {
    metrics.forEach(metric => {
      let value;
      if (metric === 'Delivery Time') {
        value = Math.random() * 10 + 3; // days
      } else if (metric === 'SLA Compliance') {
        value = Math.random() * 20 + 80; // percentage
      } else if (metric === 'Customer Satisfaction') {
        value = Math.random() * 2 + 4; // 4-6 stars
      } else if (metric === 'Upsell Rate') {
        value = Math.random() * 30 + 10; // percentage
      } else {
        value = Math.random() * 5000000 + 1000000; // revenue
      }
      
      data.push({
        vendor,
        metric,
        value,
        product: filterProduct || 'All',
      });
    });
  });
  
  return data;
};

// Order tracking data
export const generateOrderData = (filterProduct = null) => {
  const statuses = ['Provisioning', 'Installed', 'Active', 'Pending'];
  const vendors = ['FastFiber', 'NetWave', 'ClearCall', 'SkyCompute'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  let data = [];
  vendors.forEach(vendor => {
    months.forEach(month => {
      statuses.forEach(status => {
        data.push({
          vendor,
          month,
          status,
          count: Math.floor(Math.random() * 50) + 10,
          revenue: Math.floor(Math.random() * 200000) + 30000,
        });
      });
    });
  });
  
  return data;
};

// Product performance by region
export const generateRegionalData = (filterProduct = null) => {
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const products = ['Internet', 'Voice', 'Cloud', 'Security', 'Managed Services', 'SD-WAN'];
  
  let data = [];
  regions.forEach(region => {
    // If filtering, only show the selected product across regions
    // Otherwise show all products
    const productsToShow = filterProduct ? [filterProduct] : products;
    
    productsToShow.forEach(product => {
      // Make sales vary by region to show realistic patterns
      let baseSales = 400000;
      if (region === 'North') baseSales = 550000;
      if (region === 'South') baseSales = 480000;
      if (region === 'East') baseSales = 600000;
      if (region === 'West') baseSales = 520000;
      if (region === 'Central') baseSales = 450000;
      
      data.push({
        region,
        product,
        sales: Math.floor(baseSales + (Math.random() * 200000) - 100000),
        growth: (Math.random() * 40) - 10, // -10% to 30%
        marketShare: Math.random() * 30 + 10,
      });
    });
  });
  
  return data;
};

