import { AES, enc } from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY || 'default_secret_key';

export function decrypt(encryptedText: string): string | null {
  try {
    const bytes = AES.decrypt(encryptedText, SECRET_KEY);
    const plaintext = bytes.toString(enc.Utf8);
    return plaintext;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}
