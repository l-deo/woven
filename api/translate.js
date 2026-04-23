const DEEPL_TRANSLATE_URL = 'https://api-free.deepl.com/v2/translate';

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (error) {
      return {};
    }
  }

  return body;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    return sendJson(res, 500, { error: 'Missing DEEPL_API_KEY' });
  }

  const body = parseBody(req.body);
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const targetLang = typeof body.targetLang === 'string' ? body.targetLang.trim().toUpperCase() : '';

  if (!text || !targetLang) {
    return sendJson(res, 400, { error: 'Missing text or targetLang' });
  }

  try {
    const response = await fetch(DEEPL_TRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang
      })
    });

    const result = await response.json().catch(function () {
      return {};
    });

    if (!response.ok) {
      return sendJson(res, response.status, {
        error: result.message || '翻译服务请求失败'
      });
    }

    return sendJson(res, 200, result);
  } catch (error) {
    return sendJson(res, 502, {
      error: '无法获取翻译结果'
    });
  }
};
