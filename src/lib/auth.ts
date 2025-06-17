import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import bcrypt from "bcryptjs"
import { executeQuery } from "./db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const users = await executeQuery(
            "SELECT * FROM users WHERE email = ?",
            [credentials.email]
          )

          const user = Array.isArray(users) && users.length > 0 ? users[0] : null

          if (!user) {
            return null
          }

          // Verify password using bcrypt
          const passwordMatch = await bcrypt.compare(credentials.password, user.password_hash)

          if (!passwordMatch) {
            return null
          }

          // Return user without password
          return {
            id: user.id.toString(),
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role || "user",
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Сохраняем данные пользователя в токене
      if (user) {
        token.id = user.id
        token.role = user.role || "user"
      }

      // Если это вход через OAuth, сохраняем или обновляем пользователя в базе данных
      if (account && account.provider && user) {
        try {
          // Проверяем, существует ли пользователь с таким email
          const existingUsers = await executeQuery(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          )

          if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            // Пользователь уже существует, обновляем данные OAuth
            const existingUser = existingUsers[0]

            // Проверяем, есть ли уже запись в таблице accounts для этого провайдера
            const existingAccounts = await executeQuery(
              "SELECT * FROM accounts WHERE user_id = ? AND provider = ?",
              [existingUser.id, account.provider]
            )

            if (Array.isArray(existingAccounts) && existingAccounts.length === 0) {
              // Добавляем новую запись в таблицу accounts
              await executeQuery(
                `
                  INSERT INTO accounts (user_id, provider, provider_account_id, access_token, expires_at, token_type, scope, id_token)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                  existingUser.id,
                  account.provider,
                  account.providerAccountId,
                  account.access_token || null,
                  account.expires_at || null,
                  account.token_type || null,
                  account.scope || null,
                  account.id_token || null,
                ]
              )
            }

            token.id = existingUser.id.toString()
            token.role = existingUser.role || "user"
          } else {
            // Создаем нового пользователя
            const nameParts = user.name?.split(" ") || ["", ""]
            const firstName = nameParts[0] || ""
            const lastName = nameParts.slice(1).join(" ") || ""

            const result = await executeQuery(
              `
                INSERT INTO users (first_name, last_name, email, password_hash, role, email_verified)
                VALUES (?, ?, ?, ?, ?, ?)
              `,
              [firstName, lastName, user.email, "", "user", true]
            )

            // @ts-ignore - MySQL2 возвращает insertId
            const userId = result.insertId

            // Добавляем запись в таблицу accounts
            await executeQuery(
              `
                INSERT INTO accounts (user_id, provider, provider_account_id, access_token, expires_at, token_type, scope, id_token)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `,
              [
                userId,
                account.provider,
                account.providerAccountId,
                account.access_token || null,
                account.expires_at || null,
                account.token_type || null,
                account.scope || null,
                account.id_token || null,
              ]
            )

            token.id = userId.toString()
            token.role = "user"
          }
        } catch (error) {
          console.error("Error saving OAuth user:", error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
