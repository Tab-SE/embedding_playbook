export const products = [
  { id: 'internet', name: 'Internet', color: '#0d47a1' },
  { id: 'voice', name: 'Voice', color: '#1565c0' },
  { id: 'cloud', name: 'Cloud', color: '#1976d2' },
  { id: 'security', name: 'Security', color: '#1e88e5' },
];

export const vendors = {
  internet: [
    { id: 'vendor_a', name: 'FastFiber', logo: '/img/tableau/logo_text.png', summary: 'Nationwide fiber with competitive SLAs', pastSelections: 42 },
    { id: 'vendor_b', name: 'NetWave', logo: '/img/tableau/logo_text_gray.png', summary: 'High-availability broadband portfolio', pastSelections: 31 },
  ],
  voice: [
    { id: 'vendor_c', name: 'ClearCall', logo: '/img/tableau/logo_text.png', summary: 'SIP trunking and UCaaS at scale', pastSelections: 25 },
  ],
  cloud: [
    { id: 'vendor_d', name: 'SkyCompute', logo: '/img/tableau/logo_text.png', summary: 'Elastic compute and storage', pastSelections: 18 },
  ],
  security: [
    { id: 'vendor_e', name: 'SecureEdge', logo: '/img/tableau/logo_text.png', summary: 'SASE, ZTNA and endpoint protection', pastSelections: 12 },
  ]
};

export const skus = {
  vendor_a: [
    { sku: 'FF-100', name: 'FastFiber 100 Mbps', price: '$120/mo' },
    { sku: 'FF-500', name: 'FastFiber 500 Mbps', price: '$220/mo' },
  ],
  vendor_b: [
    { sku: 'NW-Ultra', name: 'NetWave Ultra Broadband', price: '$99/mo' },
  ]
};

export const orders = [
  { id: 'ORD-1001', vendor: 'FastFiber', sku: 'FF-100', status: 'Provisioning', tracking: 'TRK-7781' },
  { id: 'ORD-1002', vendor: 'NetWave', sku: 'NW-Ultra', status: 'Installed', tracking: 'TRK-7782' },
];

