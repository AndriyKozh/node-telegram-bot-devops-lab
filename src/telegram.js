import { createReply } from './commands.js';

const API_ORIGIN = 'https://api.telegram.org';

/** Call a Telegram Bot API endpoint using Node.js built-in fetch. */
async function callTelegram(token, method, payload, signal) {
  const response = await fetch(`${API_ORIGIN}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  const body = await response.json();
  if (!response.ok || !body.ok) {
    const error = new Error(`Telegram ${method}: ${body.description ?? `HTTP ${response.status}`}`);
    error.status = response.status;
    throw error;
  }
  return body.result;
}

/** Sleep between temporary API/network failures; stop immediately on shutdown. */
function sleep(ms, signal) {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve();
    const onAbort = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

/** Start long polling without any external npm runtime dependencies. */
export async function runBot(token, signal) {
  let offset = 0;
  console.log('Telegram bot started. Press Ctrl+C to stop.');

  while (!signal.aborted) {
    try {
      const updates = await callTelegram(token, 'getUpdates', {
        offset,
        timeout: 25,
        allowed_updates: ['message'],
      }, signal);

      for (const update of updates) {
        if (signal.aborted) break;
        const reply = createReply(update.message);
        if (reply) {
          await callTelegram(token, 'sendMessage', {
            chat_id: update.message.chat.id,
            text: reply,
          }, signal);
        }
        offset = update.update_id + 1;
      }
    } catch (error) {
      if (signal.aborted) break;
      if (error.status === 401 || error.status === 409) {
        throw error; // Invalid token or another polling instance: do not retry forever.
      }
      console.error('Polling error:', error.message);
      await sleep(2000, signal);
    }
  }
  console.log('Telegram bot stopped.');
}
