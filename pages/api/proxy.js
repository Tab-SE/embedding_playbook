const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: 'https://prod-useast-b.online.tableau.com', // Tableau target URL
  changeOrigin: true,
  secure: true,
  pathRewrite: {
    '^/api/proxy': '', // Remove the /api/proxy path prefix
  },
  cookieDomainRewrite: '',
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxy request received:', req.method, req.url);
    // Remove X-Forwarded headers for security
    proxyReq.removeHeader('x-forwarded-proto');
    proxyReq.removeHeader('x-forwarded-host');
    proxyReq.removeHeader('x-forwarded-for');

    // Fix the request body for POST requests
    if (req.method === 'POST') {
      console.log('Fixing request body for POST request');
      fixRequestBody(proxyReq, req, res);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('Proxy response received:', proxyRes.statusCode);
  },
});
