import { getDB, saveDB } from '../database/db.js';
import { isOwner, isDeveloper } from '../utils/permissions.js';
import { getMentioned } from '../utils/helpers.js';

export async function adminCommand(sock, message, command) {
  const jid = message.key.remoteJid;
  const sender = message.key.participant || jid;

  if (command !== 'اضافه') return false;

  const text = message.message?.extendedTextMessage?.text || '';
  if (!text.includes('مطور')) return false;

  if (!isOwner(sender)) {
    await sock.sendMessage(jid, {
      text: '⛔ هذا الأمر خاص بالمطور الأساسي فقط.'
    });
    return true;
  }

  const mentioned = getMentioned(message);

  if (!mentioned.length) {
    await sock.sendMessage(jid, {
      text: '❌ من فضلك اعمل منشن للشخص المراد إضافته مطورًا.'
    });
    return true;
  }

  const target = mentioned[0];
  const db = getDB();

  if (isDeveloper(target)) {
    await sock.sendMessage(jid, {
      text: '⚠️ هذا العضو مطور بالفعل.'
    });
    return true;
  }

  db.developers.push(target);
  saveDB(db);

  await sock.sendMessage(jid, {
    text: `👑 تمت إضافة المطور بنجاح!

👤 العضو: @${target.split('@')[0]}

🛡️ الصلاحية: مطور`,
    mentions: [target]
  });

  r
  eturn true;
  }
