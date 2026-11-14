import { config } from '../config/settings.js';
import { getDB } from '../database/db.js';

export function isOwner(jid) {
  const number = config.owner.replace(/\D/g, '');
  return jid?.split('@')[0].split(':')[0] === number;
}

export function isDeveloper(jid) {
  const db = getDB();

  if (isOwner(jid)) return true;

  return db.developers.includes(jid);
              }
