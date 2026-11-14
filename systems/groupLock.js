
const activeLocks = new Map();

export async function lockGroupForPrayer(sock, jid) {
  try {
    if (activeLocks.has(jid)) {
      return {
        success: false,
        message: 'المجموعة مقفولة بالفعل'
      };
    }

    // قفل إرسال الرسائل للأعضاء
    await sock.groupSettingUpdate(jid, 'announcement');

    const timer = setTimeout(async () => {
      try {
        await sock.groupSettingUpdate(jid, 'not_announcement');

        await sock.sendMessage(jid, {
          text: '🕌 انتهت فترة الصلاة.\nتم فتح المجموعة مجدداً، تقبل الله منكم.'
        });
      } catch (error) {
        console.error('Group unlock error:', error);
      } finally {
        activeLocks.delete(jid);
      }
    }, 5 * 60 * 1000);

    activeLocks.set(jid, timer);

    return {
      success: true,
      message: 'تم قفل المجموعة لمدة 5 دقائق'
    };

  } catch (error) {
    console.error('Group lock error:', error);

    return {
      success: false,
      message: 'فشل قفل المجموعة. تأكد أن البوت مشرف.'
    };
  }
}

export async function unlockGroup(sock, jid) {
  try {
    const timer = activeLocks.get(jid);

    if (timer) {
      clearTimeout(timer);
      activeLocks.delete(jid);
    }

    await sock.groupSettingUpdate(jid, 'not_announcement');

    await sock.sendMessage(jid, {
      text: '🔓 تم فتح المجموعة مجدداً.'
    });

    return true;
  } catch (error) {
    console.error('Group unlock error:', error);
    return false;
  }
}

export function isGroupLocked(jid) {
  return activeLocks.has(jid);
      }
