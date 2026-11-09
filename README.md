# Node.js Telegram Bot — DevOps Lab

Навчальний Telegram-бот для самостійної практики **Makefile** та **Dockerfile**. Застосунок і тести готові. **Makefile та Dockerfile навмисно відсутні:** це частина домашньої практики.

## Що вміє бот

| Команда | Дія |
| --- | --- |
| `/start` | Вітання |
| `/help` | Список команд |
| `/ping` | Відповідь `pong` |
| `/time` | Час UTC |
| `/id` | ID чату |
| `/echo Привіт` | Повторення тексту |
| `/about` | Про проєкт |
| Звичайний текст | Відповідь на повідомлення |

## Вимоги

- Node.js 22+ та npm.
- Для подальшої практики: GNU Make і Docker.
- Telegram-токен від [@BotFather](https://t.me/BotFather) потрібен лише для реального запуску; для тестів — ні.

## Початок

```bash
npm ci
npm run check
npm test
```

Для реального запуску:

```bash
cp .env.example .env
# Відредагуй .env і встав власний TELEGRAM_BOT_TOKEN
npm run dev
```

Зупинка: `Ctrl+C`. **Не додавай .env чи токен у Git, Dockerfile або Makefile.**

## Структура

```text
src/index.js           старт і завершення роботи
src/telegram.js        long polling Telegram Bot API
src/commands.js        логіка команд, незалежна від мережі
test/commands.test.js  дев’ять автоматичних тестів
package.json           npm-скрипти
package-lock.json      lockfile
.env.example           приклад змінної середовища
.gitignore             локальні файли та секрети
docs/LEARNING_PATH.md  план практики без готових рішень
```

## Навчання

Виконуй завдання послідовно за [навчальним планом](docs/LEARNING_PATH.md): спочатку перевір команду вручну, потім переносиш її до target Makefile, далі розробляєш Dockerfile та інтегруєш Docker у Make.

### Примітка про архітектури

Node.js виконує JavaScript через runtime; на відміну від Go, звичайні JS-файли не кроскомпілюються через `GOOS/GOARCH`. Для запуску потрібен Node runtime потрібної ОС/архітектури. Linux-контейнер не є нативним середовищем для macOS або Windows.
