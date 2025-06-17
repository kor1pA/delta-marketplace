import { randomBytes } from "crypto"
import { encrypt } from "./encryption"
import { decrypt } from "@/lib/decryption"; // Import decrypt from the correct path

// Function to generate CSRF token
export async function generateCsrfToken(): Promise<string> {
  const csrfSecret = process.env.CSRF_SECRET;
  if (!csrfSecret) {
    throw new Error("CSRF_SECRET is not set in environment variables");
  }

  const random = randomBytes(32).toString('hex');
  const encryptedToken = await encrypt(random); // Call encrypt with only the text
  return encryptedToken;
}

// Function to validate CSRF token
export async function validateCsrfToken(token: string): Promise<boolean> {
  const csrfSecret = process.env.CSRF_SECRET;
    if (!csrfSecret) {
        throw new Error("CSRF_SECRET is not set in environment variables");
    }
  try {
      if (!token) {
          return false;
      }
    const decryptedToken = await decrypt(token); // Call decrypt with only the token
    return !!decryptedToken; // Return true if decryption succeeds, false otherwise
  } catch (error) {
    console.error("CSRF validation error:", error);
    return false;
  }
}
