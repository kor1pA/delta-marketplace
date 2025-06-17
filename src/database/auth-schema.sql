-- Обновление таблицы пользователей для поддержки аутентификации
ALTER TABLE users
ADD COLUMN role VARCHAR(20) DEFAULT 'user' AFTER phone,
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER role,
ADD COLUMN verification_token VARCHAR(255) NULL AFTER email_verified,
ADD COLUMN reset_token VARCHAR(255) NULL AFTER verification_token,
ADD COLUMN reset_token_expires DATETIME NULL AFTER reset_token;

-- Создание таблицы сессий (если вы хотите хранить сессии в базе данных)
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  expires DATETIME NOT NULL,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  access_token VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Создание таблицы для OAuth аккаунтов
CREATE TABLE IF NOT EXISTS accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT NULL,
  access_token TEXT NULL,
  expires_at BIGINT NULL,
  token_type VARCHAR(255) NULL,
  scope VARCHAR(255) NULL,
  id_token TEXT NULL,
  session_state VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY provider_account_id (provider, provider_account_id)
);
