/**
 * Build a Telegram text reply without making network requests.
 * Keeping command handling pure makes it easy to test.
 * @param {{text?: string, chat?: {id?: number|string}} | undefined} message
 * @param {() => Date} now
 * @returns {string|null}
 */
export function createReply(message, now = () => new Date()) {
  if (typeof message?.text !== 'string' || message.chat?.id == null) {
    return null;
  }

  const text = message.text.trim();
  if (!text) return null;

  const [firstWord] = text.split(/\s+/);
  const command = firstWord.toLowerCase().split('@')[0];
  const args = text.slice(firstWord.length).trim();

  switch (command) {
    case '/start':
      return 'Привіт! Я навчальний Node.js-бот 🤖\nНапиши /help, щоб побачити команди.';
    case '/help':
      return [
        'Доступні команди:',
        '/start — привітання',
        '/help — довідка',
        '/ping — перевірка доступності',
        '/time — поточний час UTC',
        '/id — ID цього чату',
        '/echo текст — повторити текст',
        '/about — про навчальний проєкт',
      ].join('\n');
    case '/ping':
      return 'pong 🏓';
    case '/time':
      return `UTC: ${now().toISOString()}`;
    case '/id':
      return `Chat ID: ${message.chat.id}`;
    case '/echo':
      return args ? args.slice(0, 4000) : 'Використання: /echo твій текст';
    case '/about':
      return 'Node.js DevOps Lab: бот для практики Git, Makefile, Docker та тестування.';
    default:
      if (text.startsWith('/')) return 'Невідома команда. Напиши /help.';
      return `Ти написав: ${text.slice(0, 3900)}`;
  }
}
