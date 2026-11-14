import { getDB, saveDB } from '../database/db.js';
import { isDeveloper } from '../utils/permissions.js';
import { getMentioned } from '../utils/helpers.js';

export async function moderationCommand(sock, message, command, args = []) {
  const jid = message.key.remoteJid;
  const sender = message.key.participant || jid;
  const db = getDB();
  const target = getMentioned(message)[0];

  if (!['كتم', 'فك', 'منشن'].includes(command)) return false;

  if (command === 'كتم' || command === 'فك') {
    if (!isDeveloper(sender)) {
      await sock.sendMessage(jid, { text: '⛔ الأمر خاص بالمطورين.' });
      return true;
    }

    if (!target) {
      await sock.sendMessage(jid, {
        text: '❌ اعمل منشن للعضو المطلوب.'
      });
      return true;
    }

    if (isDeveloper(target)) {
      await sock.sendMessage(jid, {
        text: '⛔ لا يمكن كتم المطور.'
      });
      return true;
    }

    if (command === 'كتم') {
      db.muted[target] = {
        until: Date.now() + 30 * 60 * 1000
      };
      saveDB(db);

      await sock.sendMessage(jid, {
        text: `🔇 تم كتم @${target.split('@')[0]} لمدة 30 دقيقة.`,
        mentions: [target]
      });
    } else {
      delete db.muted[target];
      saveDB(db);

      await sock.sendMessage(jid, {
        text: `🔊 تم فك كتم @${target.split('@')[0]}.`,
        mentions: [target]
      });
    }

    return true;
  }

  if (command === 'منشن') {
    if (!isDeveloper(sender)) {
      await sock.sendMessage(jid, { text: '⛔ الأمر خاص بالمطورين.' });
      return true;
    }

    if (!target) {
      await sock.sendMessage(jid, {
        text: '❌ اعمل منشن للشخص المطلوب تنبيهه.'
      });
      return true;
    }

    const user = db.users[target] ||= {
      jid: target,
      nickname: 'عضو جديد',
      rank: 17,
      bank: 40,
      wallet: 0,
      hearts: 3,
      warnings: 0
    };

    user.warnings = (user.warnings || 0) + 1;

    if (user.warnings >= 3) {
      db.muted[target] = {
        until: Date.now() + 30 * 60 * 1000
      };
      user.warnings = 0;
    }

    saveDB(db);

    await sock.sendMessage(jid, {
      text: user.warnings === 0
        ? `🔇 تم كتم @${target.split('@')[0]} لمدة 30 دقيقة بعد الإنذارات.`
        : `⚠️ تنبيه @${target.split('@')[0]}\nالإنذار: ${user.warnings}/3`,
      mentions: [target]
    });

    return true;
  }


  return false;
}
