
import { getDB, saveDB } from '../database/db.js';

export function getProfile(jid) {
  const db = getDB();

  db.users ||= {};

  if (!db.users[jid]) {
    db.users[jid] = {
      jid,
      nickname: 'عضو جديد',
      rank: 17,
      bank: 40,
      wallet: 0,
      hearts: 3,
      warnings: 0,
      joinedAt: new Date().toISOString()
    };

    saveDB(db);
  }

  return db.users[jid];
}

export async function sendProfile(sock, message, target) {
  const jid = message.key.remoteJid;
  const userId = target || message.key.participant || jid;

  const user = getProfile(userId);

  const db = getDB();
  const ranks = [
    'الإمبراطور',
    'نائب الإمبراطور',
    'الإمبراطور الأعلى',
    'الإمبراطور الأعظم',
    'الإمبراطور الأسطوري',
    'الإمبراطور الملكي',
    'الإمبراطور الذهبي',
    'الأسطورة',
    'الملك',
    'الأمير',
    'القائد',
    'الجنرال',
    'المحارب',
    'الفارس',
    'النخبة',
    'المحترف',
    'الخبير',
    'المبتدئ'
  ];

  let avatar = '';

  try {
    avatar = await sock.profilePictureUrl(userId, 'image');
  } catch {
    avatar = '';
  }

  await sock.sendMessage(jid, {
    image: avatar ? { url: avatar } : undefined,
    text: `👤 معلومات العضو

🏷️ اللقب: ${user.nickname}
📱 الرقم: ${userId.split('@')[0]}
🆔 المعرف: ${userId}
👑 الرتبة: ${ranks[user.rank] || 'غير محددة'}
💰 البنك: ${user.bank} جنيه
👛 المحفظة: ${user.wallet} جنيه
❤️ القلوب: ${user.hearts}/3`,
    mentions: [userId]
  });
}

export function updateNickname(jid, nickname) {
  const db = getDB();

  db.users ||= {};

  if (!db.users[jid]) {
    db.users[jid] = {
      jid,
      nickname: 'عضو جديد',
      rank: 17,
      bank: 40,
      wallet: 0,
      hearts: 3,
      warnings: 0
    };
  }

  db.users[jid].nickname = nickname;
  saveDB(db);

  
  return true;
      }
