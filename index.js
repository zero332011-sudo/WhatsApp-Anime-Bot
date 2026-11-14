import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from '@whiskeysockets/baileys';

import pino from 'pino';
import 'dotenv/config';

import { messageHandler } from './handlers/messageHandler.js';

const pairingNumber = process.env.PAIRING_NUMBER;

let reconnecting = false;

async function startBot() {
  if (!pairingNumber) {
    throw new Error('PAIRING_NUMBER غير موجود في إعدادات السيرفر');
  }

  const { state, saveCreds } =
    await useMultiFileAuthState('./auth_info_baileys');

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'connecting') {
      console.log('🔄 جاري الاتصال بواتساب...');
    }

    if (connection === 'open') {
      console.log('✅ تم اتصال البوت بنجاح!');
      reconnecting = false;
    }

    if (connection === 'close') {
      const statusCode =
        lastDisconnect?.error?.output?.statusCode;

      console.log('⚠️ انقطع الاتصال:', statusCode);

      if (
        statusCode !== DisconnectReason.loggedOut &&
        !reconnecting
      ) {
        reconnecting = true;
        setTimeout(() => {
          startBot().catch(console.error);
        }, 5000);
      }
    }
  });

  sock.ev.on('messages.upsert', async (update) => {
    await messageHandler(sock, update);
  });

  if (!state.creds.registered) {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const code = await sock.requestPairingCode(
      pairingNumber.replace(/\D/g, '')
    );

    console.log('🔐 رمز اقتران واتساب:', code);
    console.log('افتح واتساب > الأجهزة المرتبطة > ربط جهاز برقم الهاتف');
  }
}

startBot().catch(error => {
  console.error('Bot startup error:', error);
  
process.exit(1);
});
