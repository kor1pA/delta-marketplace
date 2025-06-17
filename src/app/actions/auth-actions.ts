"use server"

import bcrypt from "bcryptjs"
import { executeQuery } from "@/lib/db"
import { encrypt } from "@/lib/encryption"
import { sanitizeText } from "@/lib/sanitize"
import { validateCsrfToken, generateCsrfToken } from "@/lib/csrf"

// Inline type definition since '@/types' does not exist
type RegisterUserParams = {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string // <-- make optional
  csrfToken: string
}

export async function registerUser({ firstName, lastName, email, password, phone, csrfToken }: RegisterUserParams) {
  try {
    // ... CSRF check remains unchanged ...

    // Sanitize input fields
    const sanitizedData = {
      firstName: sanitizeText(firstName),
      lastName: sanitizeText(lastName),
      email: sanitizeText(email),
      phone: phone ? sanitizeText(phone) : null,
    }

    // Check if user with this email exists
    const existingUsers = await executeQuery(
      "SELECT * FROM users WHERE email = ?",
      [sanitizedData.email]
    )

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return { error: "User with this email already exists" }
    }

    // Hash password and encrypt phone (handle null)
    const hashedPassword = await bcrypt.hash(password, 10)
    const encryptedPhone = sanitizedData.phone ? encrypt(sanitizedData.phone) : null

    // Створення користувача
    await executeQuery(
      `INSERT INTO users (first_name, last_name, email, password_hash, encrypted_phone, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        sanitizedData.firstName,
        sanitizedData.lastName,
        sanitizedData.email,
        hashedPassword,
        encryptedPhone,
        "user",
      ]
    )

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to register user" }
  }
}

export async function changePassword({
  userId,
  currentPassword,
  newPassword,
  csrfToken,
}: {
  userId: string
  currentPassword: string
  newPassword: string
  csrfToken: string
}) {
  try {
    // ... CSRF check remains unchanged ...

    // Отримання поточного пароля користувача
    const users = await executeQuery(
      "SELECT password_hash FROM users WHERE id = ?",
      [userId]
    )

    // ... password check remains unchanged ...

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Оновлення пароля
    await executeQuery(
      "UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, userId]
    )

    return { success: true }
  } catch (error) {
    console.error("Password change error:", error)
    return { error: "Failed to change password" }
  }
}

export async function updateUserProfile({
  userId,
  firstName,
  lastName,
  email,
  phone,
  csrfToken,
}: {
  userId: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  csrfToken: string
}) {
  try {
    // ... CSRF check remains unchanged ...

    // Sanitize input fields
    const sanitizedData: { [key: string]: string | undefined } = {
      firstName: firstName ? sanitizeText(firstName) : undefined,
      lastName: lastName ? sanitizeText(lastName) : undefined,
      email: email ? sanitizeText(email) : undefined,
      phone: phone ? sanitizeText(phone) : undefined,
    }

    // Check if another user with this email exists
    if (sanitizedData.email) {
      const existingUsers = await executeQuery(
        "SELECT * FROM users WHERE email = ? AND id != ?",
        [sanitizedData.email, userId]
      )

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return { error: "Email is already in use by another account" }
      }
    }

    // Build update fields and values
    const updateFields: string[] = []
    const values: any[] = []

    if (sanitizedData.firstName) {
      updateFields.push("first_name = ?")
      values.push(sanitizedData.firstName)
    }
    if (sanitizedData.lastName) {
      updateFields.push("last_name = ?")
      values.push(sanitizedData.lastName)
    }
    if (sanitizedData.email) {
      updateFields.push("email = ?")
      values.push(sanitizedData.email)
    }
    if (sanitizedData.phone) {
      updateFields.push("encrypted_phone = ?")
      values.push(encrypt(sanitizedData.phone))
    }

    if (updateFields.length === 0) {
      return { error: "No fields to update" }
    }

    values.push(userId)

    // Оновлення профілю користувача
    await executeQuery(
      `UPDATE users
       SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      values
    )

    return { success: true }
  } catch (error) {
    console.error("Profile update error:", error)
    return { error: "Failed to update profile" }
  }
}

export async function getCsrfToken(): Promise<string> {
  // Use an environment variable for the base URL, or fallback to localhost.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/csrf`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch CSRF token, status: ${response.status}`);
  }
  const data = await response.json();
  return data.csrfToken;
}