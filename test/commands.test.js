import test from 'node:test';
import assert from 'node:assert/strict';
import { createReply } from '../src/commands.js';

const message = (text, id = 12345) => ({ text, chat: { id } });

test('/start sends a greeting', () => {
  assert.match(createReply(message('/start')), /Привіт/);
});

test('/help lists available commands', () => {
  const reply = createReply(message('/help'));
  assert.match(reply, /\/ping/);
  assert.match(reply, /\/echo/);
});

test('/ping responds with pong', () => {
  assert.equal(createReply(message('/ping')), 'pong 🏓');
});

test('/time uses the given clock', () => {
  assert.equal(createReply(message('/time'), () => new Date('2026-11-10T12:00:00Z')),
    'UTC: 2026-11-10T12:00:00.000Z');
});

test('/id returns the current chat id', () => {
  assert.equal(createReply(message('/id', 987)), 'Chat ID: 987');
});

test('/echo repeats arguments and prompts if empty', () => {
  assert.equal(createReply(message('/echo Hello DevOps')), 'Hello DevOps');
  assert.match(createReply(message('/echo')), /Використання/);
});

test('regular messages get an echo, unknown commands show help', () => {
  assert.equal(createReply(message('hello')), 'Ти написав: hello');
  assert.match(createReply(message('/missing')), /Невідома команда/);
});

test('invalid or non-text updates are ignored', () => {
  assert.equal(createReply({ chat: { id: 5 } }), null);
  assert.equal(createReply({ text: 'hello' }), null);
  assert.equal(createReply(undefined), null);
});

test('Telegram bot mention suffix is supported', () => {
  assert.equal(createReply(message('/ping@my_training_bot')), 'pong 🏓');
});
