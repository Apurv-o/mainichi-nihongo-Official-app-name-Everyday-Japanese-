/**
 * Vercel Serverless Function: /api/ai-coach
 * Secure backend endpoint for Sensei AI Coach on Mainichi Nihongo
 */

const { isRateLimited } = require('./lib/rateLimiter');
const { callGeminiWithFailover } = require('./lib/geminiProvider');

const ALLOWED_MODES = ['explain', 'translate', 'hint', 'practice', 'coach'];
const ALLOWED_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const MAX_INPUT_LENGTH = 1000;
const MAX_CONTEXT_LENGTH = 5000;

module.exports = async function handler(req, res) {
  // 1. CORS & Preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. HTTP Method Validation
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Use POST.'
    });
  }

  // 3. Rate Limiting Protection
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : req.socket ? req.socket.remoteAddress : 'unknown';
  const { limited, remaining, resetTime } = isRateLimited(clientIp);

  res.setHeader('X-RateLimit-Limit', '30');
  res.setHeader('X-RateLimit-Remaining', String(remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));

  if (limited) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a moment before asking Sensei AI again.'
    });
  }

  // 4. Request Body Validation
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_) {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON request payload.'
      });
    }
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Request body must be a JSON object.'
    });
  }

  const { mode = 'explain', level = 'N5', input, context = {} } = body;

  // Validate mode
  if (!ALLOWED_MODES.includes(mode)) {
    return res.status(400).json({
      success: false,
      error: `Invalid mode "${mode}". Supported modes: ${ALLOWED_MODES.join(', ')}`
    });
  }

  // Validate level
  const normLevel = String(level).toUpperCase();
  if (!ALLOWED_LEVELS.includes(normLevel)) {
    return res.status(400).json({
      success: false,
      error: `Invalid level "${level}". Supported levels: ${ALLOWED_LEVELS.join(', ')}`
    });
  }

  // Validate input
  if (typeof input !== 'string' || input.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Field "input" must be a non-empty string.'
    });
  }

  const trimmedInput = input.trim();
  if (trimmedInput.length > MAX_INPUT_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `Field "input" exceeds maximum allowed length of ${MAX_INPUT_LENGTH} characters.`
    });
  }

  // Validate context
  if (typeof context !== 'object' || context === null) {
    return res.status(400).json({
      success: false,
      error: 'Field "context" must be an object if provided.'
    });
  }

  if (JSON.stringify(context).length > MAX_CONTEXT_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `Field "context" exceeds maximum allowed size.`
    });
  }

  // 5. Execute Gemini AI Call with failover
  try {
    const result = await callGeminiWithFailover({
      mode,
      level: normLevel,
      input: trimmedInput,
      context
    });

    if (!result.success) {
      // If unconfigured or unavailable, return clean failure
      return res.status(result.configured === false ? 200 : 503).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('[AI Coach Handler Error]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected internal error occurred.'
    });
  }
};
