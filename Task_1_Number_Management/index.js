const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8080;
const TIMEOUT = 500;

app.get('/numbers', async (req, res) => {
  try {
    const urlQueries = req.query.url;
    if (!urlQueries) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    const urls = Array.isArray(urlQueries) ? urlQueries : [urlQueries];
    const fetchPromises = urls.map(async (url) => {
      try {
        const response = await axios.get(url, { timeout: TIMEOUT });
        return response.data.numbers || [];
      } catch (error) {
        console.error(`Error fetching data from ${url}: ${error.message}`);
        return [];
      }
    });

    const results = await Promise.all(fetchPromises);
    const mergedNumbers = results.flat();
    const uniqueNumbers = Array.from(new Set(mergedNumbers)).sort((a, b) => a - b);

    return res.json({ numbers: uniqueNumbers });
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`number-management-service is running on port ${PORT}`);
});
