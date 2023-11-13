const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://3.93.246.61/', // Replace this with your backend API's address
      changeOrigin: true,
    })
  );
};
