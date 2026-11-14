import fs from 'node:fs';
import path from 'node:path';

const folder = './database';
const file = path.join(folder, 'data.json');

const initialData = {
  users: {},
  groups: {},
  developers: [],
  muted: {},
  blockedWords: [],
  blockedEmojis: [],
  blockedStickers: [],
  anime: {},
  games: {},
  transfers: []
};

fs.mkdirSync(folder, { recursive: true });

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, JSON.stringify(initialData, null, 2));
}

export function getDB() {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function saveDB(data) {
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(data, null, 2));
  fs.renameSync(temp, file);
}

export function getUser(jid) {
  const db = getDB();

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

    saveDB(db);
  }

  return db.users[jid];
}
