import { runBot } from './telegram.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Missing TELEGRAM_BOT_TOKEN. Copy .env.example to .env and set your token.');
  process.exitCode = 1;
} else {
  const controller = new AbortController();
  process.once('SIGINT', () => controller.abort());
  process.once('SIGTERM', () => controller.abort());

  try {
    await runBot(token, controller.signal);
  } catch (error) {
    console.error('Bot stopped with an error:', error.message);
    process.exitCode = 1;
  }
}
