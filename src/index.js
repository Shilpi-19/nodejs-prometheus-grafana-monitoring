const express = require('express');
const { collectDefaultMetrics, register } = require('prom-client');
const metrics = require('./metrics');

const app = express();
const port = 3000;

// Collect default metrics
collectDefaultMetrics();

// Get the request counter
const requestCounter = metrics();

// Middleware to count requests
app.use((req, res, next) => {
  res.on('finish', () => {
    requestCounter.inc({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

// Endpoint to expose metrics
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();  // Await the Promise
    res.end(metrics);
  } catch (err) {
    res.status(500).send(`Error collecting metrics: ${err.message}`);
  }
});

// Sample endpoint to demonstrate metrics
app.get('/', (req, res) => {
  res.send('Hello, Prometheus!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
