
import { getDB, saveDB } from '../database/db.js';
import { isOwner } from '../utils/permissions.js';
import { getText } from '../utils/helpers.js';

export async function ownerTools(sock, message) {
  const jid = message.key.remoteJid;
  const sender = message.key.participant || jid;
  const text = getText(message).trim();

  const commands = [
    '.اضافه ايموجي',
    '.اضافه ملصق',
    '.حذف ايموجي',
    '.حذف ملصق'
  ];

  const command = commands.find(cmd =>
    text.startsWith(cmd + ' ')
  );

  if (!command) return false;

  if (!isOwner(sender)) {
    await sock.sendMessage(jid, {
      text: '⛔ هذا الأمر خاص بالمطور الأساسي فقط.'
    });
    return true;
  }

  const value = text.slice(command.length).trim();

  if (!value) {
    await sock.sendMessage(jid, {
      text: `❌ طريقة الاستخدام:
${command} العنصر`
    });
    return true;
  }

  const db = getDB();

  db.blockedEmojis ||= [];
  db.blockedStickers ||= [];

  if (command === '.اضافه ايموجي') {
    if (!db.blockedEmojis.includes(value)) {
      db.blockedEmojis.push(value);
    }
  }

  if (command === '.حذف ايموجي') {
    db.blockedEmojis = db.blockedEmojis.filter(
      item => item !== value
    );
  }

  if (command === '.اضافه ملصق') {
    if (!db.blockedStickers.includes(value)) {
      db.blockedStickers.push(value);
    }
  }

  if (command === '.حذف ملصق') {
    db.blockedStickers = db.blockedStickers.filter(
      item => item !== value
    );
  }

  saveDB(db);

  await sock.sendMessage(jid, {
    text: `✅ تمت العملية بنجاح.

📌 العملية: ${command}
📝 العنصر: ${value}`
  });

  
  return true;
    }
