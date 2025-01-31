const { Counter } = require('prom-client');

// Define a custom counter metric
const requestCounter = new Counter({
  name: 'http_requests_total',
  help: 'HTTP request count',
  labelNames: ['method', 'route', 'status_code'],
});

module.exports = () => {
  return requestCounter;
};