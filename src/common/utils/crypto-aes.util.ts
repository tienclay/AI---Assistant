import * as CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';
dotenv.config();
// encode
export const encrypt = (text: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(
    text,
    process.env.AES_SECRET_KEY,
  ).toString();
  return ciphertext;
};

//decode
export const decrypt = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.AES_SECRET_KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
