import { getText } from '../utils/helpers.js';
import { commandHandler } from './commandHandler.js';

export async function messageHandler(sock, update) {
  for (const message of update.messages || []) {
    if (!message.message) continue;
    if (message.key.fromMe) continue;

    const jid = message.key.remoteJid;

    if (jid === 'status@broadcast') continue;

    const text = getText(message);

    if (!text) continue;

    try {
      await commandHandler(sock, message, text);
    } catch (error) {
      console.error('Message error:', error);
    }
  }
      }
