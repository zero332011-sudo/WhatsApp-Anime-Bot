import { getUser } from '../database/db.js';
import { ranks } from '../config/settings.js';

export async function generalCommand(sock, message, command) {
  const jid = message.key.remoteJid;
  const sender = message.key.participant || jid;
  const user = getUser(sender);

  if (command === 'الاوامر' || command === 'اوامر') {
    return sock.sendMessage(jid, {
      text: `🍥 قائمة أوامر Anime Bot

🎮 الألعاب
.اكس
.خمن
.انسحب
.انهاء

💰 الاقتصاد
.بنك
.محفظه
.تحويل

👤 الأعضاء
.معلومات
.لقب
.ترقيه

🍥 مكتبة الأنمي
.انمي

🛡️ الإدارة
.كتم
.فك كتم
.منشن

اكتب الأمر المطلوب للبدء ❤️`
    });
  }

  if (command === 'بنك') {
    return sock.sendMessage(jid, {
      text: `🏦 البنك الشخصي

👤 العضو: ${user.nickname}
💰 البنك: ${user.bank} جنيه
👛 المحفظة: ${user.wallet} جنيه
👑 الرتبة: ${ranks[user.rank]}`
    });
  }

  if (command === 'محفظه') {
    return sock.sendMessage(jid, {
      text: `👛 محفظتك

💰 الرصيد: ${user.wallet} جنيه`
    });
  }

  if (command === 'معلومات') {
    return sock.sendMessage(jid, {
      text: `👤 معلومات العضو

🏷️ اللقب: ${user.nickname}
📱 الرقم: ${sender.split('@')[0]}
🆔 المعرف: ${sender}
👑 الرتبة: ${ranks[user.rank]}`
    });
  }

  if (command === 'انمي') {
    return sock.sendMessage(jid, {
      text: `🍥 مكتبة الأنمي

المكتبة قيد التجهيز.
سنضيف الأنميات والأقسام والحلقات قريبًا.`
    });
  }


  return false;
            }
