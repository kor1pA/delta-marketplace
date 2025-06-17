import CryptoJS from "crypto-js"

// Get encryption key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-encryption-key-change-in-production"

/**
 * Encrypts the data string
 * @param data Data to encrypt
 * @returns Encrypted string
 */
export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
}

/**
 * Decrypts the encrypted string
 * @param encryptedData Encrypted string
 * @returns Decrypted data
 */
export function decrypt(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

/**
 * Hashes the data (one-way encryption, cannot be decrypted)
 * @param data Data to hash
 * @returns Data hash
 */
export function hash(data: string): string {
  return CryptoJS.SHA256(data).toString()
}

/**
 * Encrypts an object by converting it to JSON and then encrypting
 * @param data Object to encrypt
 * @returns Encrypted string
 */
export function encryptObject<T>(data: T): string {
  const jsonString = JSON.stringify(data)
  return encrypt(jsonString)
}

/**
 * Decrypts and converts the string back to an object
 * @param encryptedData Encrypted string
 * @returns Decrypted object
 */
export function decryptObject<T>(encryptedData: string): T {
  const jsonString = decrypt(encryptedData)
  return JSON.parse(jsonString) as T
}
