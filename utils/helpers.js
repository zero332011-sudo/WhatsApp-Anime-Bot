export function getText(message) {
  const msg = message.message;
  if (!msg) return '';

  const content =
    msg.ephemeralMessage?.message ||
    msg.viewOnceMessage?.message ||
    msg.viewOnceMessageV2?.message ||
    msg;

  return (
    content.conversation ||
    content.extendedTextMessage?.text ||
    content.imageMessage?.caption ||
    content.videoMessage?.caption ||
    ''
  ).trim();
}

export function getSender(message) {
  return message.key.participant ||
    message.key.remoteJid;
}

export function getMentioned(message) {
  const msg = message.message;
  const text = msg?.extendedTextMessage;
  return text?.contextInfo?.mentionedJid || [
    
  ];
    }
