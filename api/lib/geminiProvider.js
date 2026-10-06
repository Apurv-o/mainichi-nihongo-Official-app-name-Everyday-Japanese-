/**
 * Gemini Provider Abstraction with Multi-Key Failover for Mainichi Nihongo
 * Supports: GEMINI_API_KEY_1 -> GEMINI_API_KEY_2 -> GEMINI_API_KEY_3 -> GEMINI_API_KEY_4
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Retrieve configured keys in strict failover order
 */
function getConfiguredKeys() {
  const envKeyNames = [
    'GEMINI_API_KEY_1',
    'GEMINI_API_KEY_2',
    'GEMINI_API_KEY_3',
    'GEMINI_API_KEY_4'
  ];

  const keys = [];
  for (const name of envKeyNames) {
    const val = process.env[name];
    if (val && typeof val === 'string' && val.trim().length > 0) {
      keys.push({ name, key: val.trim() });
    }
  }
  return keys;
}

/**
 * Build system prompt based on mode, level, and context
 */
function buildPrompt(mode, level, input, context) {
  const systemInstructions = {
    explain: `You are Sensei AI (先生), a warm, encouraging Japanese language tutor for the Mainichi Nihongo app. The user's current JLPT level is ${level}. Explain the Japanese grammar, kanji, or sentence clearly. Include: 1) Meaning in simple English, 2) Breakdown of components/readings, 3) 2-3 practical example sentences with furigana/hiragana and English translations. Keep explanations concise, clear, and structured.`,
    translate: `You are Sensei AI (先生), a Japanese-English translator and tutor for Mainichi Nihongo. The user is at JLPT level ${level}. Translate the provided text between Japanese and English. If Japanese, provide romaji, furigana reading, and a literal vs natural English translation with key vocabulary notes. If English, provide natural Japanese with hiragana reading.`,
    hint: `You are Sensei AI (先生) for Mainichi Nihongo. The user is studying JLPT level ${level} and needs a helpful hint without giving away the entire solution. Provide a gentle, mnemonic, or contextual clue to guide them to the right answer.`,
    practice: `You are Sensei AI (先生) for Mainichi Nihongo. The user wants practice for JLPT level ${level}. Create 2-3 interactive fill-in-the-blank or multiple-choice practice questions targeting the requested topic. Include the correct answers and brief explanations at the bottom.`,
    coach: `You are Sensei AI (先生), an empathetic personal Japanese study coach for Mainichi Nihongo. The user is studying at JLPT ${level}. Analyze their input and study context, and offer actionable advice, motivation, and specific recommendations on what to review next.`
  };

  const selectedInstruction = systemInstructions[mode] || systemInstructions.explain;
  let contextSnippet = '';
  if (context && typeof context === 'object' && Object.keys(context).length > 0) {
    contextSnippet = `\nUser Study Context: ${JSON.stringify(context).slice(0, 500)}`;
  }

  return {
    system: selectedInstruction,
    user: `Input: ${input}${contextSnippet}`
  };
}

/**
 * Execute request with multi-key failover
 */
async function callGeminiWithFailover({ mode, level, input, context }) {
  const configuredKeys = getConfiguredKeys();

  if (configuredKeys.length === 0) {
    return {
      success: false,
      configured: false,
      error: 'AI Coach is not currently configured with API keys. Local study tools remain fully available.'
    };
  }

  const prompt = buildPrompt(mode, level, input, context);
  const requestPayload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${prompt.system}\n\n${prompt.user}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.95
    }
  };

  let lastError = null;

  for (let i = 0; i < configuredKeys.length; i++) {
    const { name: keySlot, key } = configuredKeys[i];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const endpointUrl = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`;
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle successful response
      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates && data.candidates[0];
        const textPart = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0];
        const outputText = (textPart && textPart.text) || '';

        if (!outputText) {
          throw new Error('Empty response from AI provider');
        }

        return {
          success: true,
          mode,
          level,
          reply: outputText,
          provider: 'gemini',
          keySlotUsed: keySlot // Note: slot name (e.g. GEMINI_API_KEY_1), NEVER the secret key
        };
      }

      // Check status code for failover
      const status = response.status;
      let errorBody = '';
      try {
        const errJson = await response.json();
        errorBody = (errJson && errJson.error && errJson.error.message) || '';
      } catch (_) {
        errorBody = await response.text().catch(() => '');
      }

      console.warn(`[GeminiProvider] Key ${keySlot} returned HTTP ${status}: ${errorBody.slice(0, 100)}`);

      // If Rate limited (429), Service Unavailable (503), Gateway/Server Error (500, 502, 504), or Quota reached -> Attempt next key
      if (status === 429 || status === 503 || status === 500 || status === 502 || status === 504 || status === 403) {
        lastError = `HTTP ${status}`;
        continue; // Try next key
      } else {
        // For other client errors (400 bad payload), do not retry across all keys endlessly
        return {
          success: false,
          error: 'Unable to process request with AI provider.'
        };
      }
    } catch (err) {
      clearTimeout(timeoutId);
      const isAbort = err.name === 'AbortError';
      console.warn(`[GeminiProvider] Error with key ${keySlot}: ${isAbort ? 'Request Timeout' : err.message}`);
      lastError = isAbort ? 'Timeout' : err.message;
      // Proceed to next configured key
      continue;
    }
  }

  // If all configured keys failed
  return {
    success: false,
    error: 'AI temporarily unavailable. Please try again in a few moments.'
  };
}

module.exports = {
  getConfiguredKeys,
  callGeminiWithFailover,
  buildPrompt
};
