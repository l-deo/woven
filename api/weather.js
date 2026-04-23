const OPENWEATHER_CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather';
const OPENWEATHER_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const DEFAULT_CITY = 'shenzhen';
const DEFAULT_UNIT = 'metric';
const ALLOWED_UNITS = new Set(['metric', 'imperial']);

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

function buildWeatherUrl(baseUrl, city, unit, apiKey) {
  const params = new URLSearchParams({
    q: city,
    units: ALLOWED_UNITS.has(unit) ? unit : DEFAULT_UNIT,
    appid: apiKey
  });

  return `${baseUrl}?${params.toString()}`;
}

async function fetchWeatherResource(url) {
  const response = await fetch(url);
  const data = await response.json().catch(function () {
    return {};
  });

  if (!response.ok) {
    const error = new Error(data.message || '天气服务请求失败');
    error.statusCode = response.status;
    throw error;
  }

  return data;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const city = typeof req.query.city === 'string' && req.query.city.trim()
    ? req.query.city.trim()
    : DEFAULT_CITY;
  const unit = typeof req.query.unit === 'string'
    ? req.query.unit.trim()
    : DEFAULT_UNIT;

  if (!apiKey) {
    return sendJson(res, 500, { error: 'Missing OPENWEATHER_API_KEY' });
  }

  try {
    const [currentData, forecastData] = await Promise.all([
      fetchWeatherResource(buildWeatherUrl(OPENWEATHER_CURRENT_URL, city, unit, apiKey)),
      fetchWeatherResource(buildWeatherUrl(OPENWEATHER_FORECAST_URL, city, unit, apiKey))
    ]);

    return sendJson(res, 200, {
      currentData: currentData,
      forecastData: forecastData
    });
  } catch (error) {
    const statusCode = error.statusCode && error.statusCode < 500 ? error.statusCode : 502;

    return sendJson(res, statusCode, {
      error: error.message || '无法获取天气数据'
    });
  }
};
