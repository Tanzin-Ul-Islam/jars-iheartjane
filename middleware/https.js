const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const privateKey = fs.readFileSync('./space-secrets/space.key');
const certificate = fs.readFileSync('./space-secrets/space.crt');
const credentials = { key: privateKey, cert: certificate };

module.exports = function (app) {
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });

  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${process.env.PORT || 6001}`,
      secure: true,
      ssl: credentials,
      changeOrigin: true,
    })
  );
};