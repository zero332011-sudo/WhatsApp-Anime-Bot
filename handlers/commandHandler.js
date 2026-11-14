import { generalCommand } from '../commands/general.js';

export async function commandHandler(sock, message, text) {
  if (!text.startsWith('.')) return;

  const command = text
    .slice(1)
    .trim()
    .split(/\s+/)[0];

  const handled = await generalCommand(
    sock,
    message,
    command
  );

  if (!handled && command) {
    await sock.sendMessage(
      message.key.remoteJid,
      { text: '❌ الأمر غير معروف. اكتب .الاوامر' },
      { quoted: message }
    );
  }
}
  
