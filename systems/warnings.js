import { getDB, saveDB } from '../database/db.js';
const MAX_WARNINGS = 3;
const MUTE_DURATION = 30 * 60 * 1000;

export function addWarning(jid, userId) {
  const db = getDB();

  db.users ||= {};
  db.muted ||= {};

  db.users[userId] ||= {
    jid: userId,
    nickname: 'عضو جديد',
    rank: 17,
    bank: 40,
    wallet: 0,
    warnings: 0
  };

  const user = db.users[userId];

  user.warnings = (user.warnings || 0) + 1;

  let muted = false;

  if (user.warnings >= MAX_WARNINGS) {
    db.muted[userId] = {
      group: jid,
      until: Date.now() + MUTE_DURATION
    };

    user.warnings = 0;
    muted = true;
  }

  saveDB(db);

  return {
    warnings: user.warnings,
    muted,
    duration: MUTE_DURATION
  };
}

export function isMuted(userId) {
  const db = getDB();

  db.muted ||= {};

  const mute = db.muted[userId];

  if (!mute) return false;

  if (mute.until <= Date.now()) {
    delete db.muted[userId];
    saveDB(db);
    return false;
  }

  return true;
}

export function removeMute(userId) {
  const db = getDB();

  db.muted ||= {};
  delete db.muted[userId];

  saveDB(db);

  return true;
}

export function clearWarnings(userId) {
  const db = getDB();

  if (db.users?.[userId]) {
    db.users[userId].warnings = 
      0;
    saveDB(db);
  }
}
