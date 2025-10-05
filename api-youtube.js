const fetch = require('node-fetch');

const API_KEY = 'AIzaSyCnxA5yJ5qKGI1nTOxiWdVgTOXe8_eHd1U';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { endpoint, ...params } = req.query;

    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint parameter' });
    }

    const baseUrl = 'https://www.googleapis.com/youtube/v3/';
    const url = new URL(endpoint, baseUrl);

    url.searchParams.set('key', API_KEY);
    Object.keys(params).forEach(key => {
      if (params[key]) {
        url.searchParams.set(key, params[key]);
      }
    });

    console.log('Fetching:', url.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: `YouTube API Error: ${response.status} ${response.statusText}` 
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};