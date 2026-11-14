import 'dotenv/config';

export const config = {
  name: process.env.BOT_NAME || 'Anime Bot',
  owner: process.env.OWNER_NUMBER || '',
  botNumber: process.env.BOT_NUMBER || '',
  pairingNumber: process.env.PAIRING_NUMBER || '',
  prefix: '.',
  timezone: 'Africa/Cairo',
  currency: 'جنيه'
};

export const ranks = [
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
