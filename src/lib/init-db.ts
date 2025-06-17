import { executeQuery } from "./db"

/**
 * Initialize database tables for the marketplace
 * Run this once to set up your database schema
 */
export async function initializeDatabase() {
  try {
    // Create users table
    await executeQuery(
      `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255),
          encrypted_phone TEXT,
          role ENUM('user', 'admin') DEFAULT 'user',
          email_verified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_role (role)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      []
    )

    // Create categories table
    await executeQuery(
      `
        CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          image_url VARCHAR(500),
          parent_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
          INDEX idx_parent (parent_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      []
    )

    // Create products table
    await executeQuery(
      `
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          long_description LONGTEXT,
          price DECIMAL(10, 2) NOT NULL,
          category_id INT,
          in_stock BOOLEAN DEFAULT TRUE,
          rating DECIMAL(3, 2) DEFAULT 0,
          image_url VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
          INDEX idx_category (category_id),
          INDEX idx_price (price),
          INDEX idx_rating (rating),
          FULLTEXT idx_search (name, description)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      []
    )

    // Create product_images table
    await executeQuery(
      `
        CREATE TABLE IF NOT EXISTS product_images (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          image_url VARCHAR(500) NOT NULL,
          alt_text VARCHAR(255),
          is_primary BOOLEAN DEFAULT FALSE,
          display_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          INDEX idx_product (product_id),
          INDEX idx_primary (is_primary)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      []
    )

    // Create product_specifications table
    await executeQuery(
      `
        CREATE TABLE IF NOT EXISTS product_specifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          spec_name VARCHAR(255) NOT NULL,
          spec_value TEXT NOT NULL,
          display_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          INDEX idx_product (product_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      []
    )

    // Create product_variants table
    await executeQuery(
      `
        CREATE TABLE IF NOT EXISTS product_variants (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          variant_name VARCHAR(255) NOT NULL,
          variant_value VARCHAR(255) NOT NULL,
          price_modifier DECIMAL(10, 2) DEFAULT 0,
          stock_quantity INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          INDEX idx_product (product_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      []
    )

    // Create orders table
    await executeQuery(
      `
        CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          total_amount DECIMAL(10, 2) NOT NULL,
          order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
          shipping_address TEXT,
          billing_address TEXT,
          payment_method VARCHAR(100),
          payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user (user_id),
          INDEX idx_status (order_status),
          INDEX idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      []
    )

    // Create order_items table
    await executeQuery(
      `
        CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL,
          unit_price DECIMAL(10, 2) NOT NULL,
          total_price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          INDEX idx_order (order_id),
          INDEX idx_product (product_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
      []
    )

    console.log("Database tables created successfully!")
    return { success: true }
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}

/**
 * Insert sample data for testing
 */
export async function insertSampleData() {
  try {
    // Insert sample categories
    await executeQuery(
      `
        INSERT IGNORE INTO categories (name, description) VALUES
        ('Electronics', 'Electronic devices and gadgets'),
        ('Clothing', 'Fashion and apparel'),
        ('Home & Kitchen', 'Home appliances and kitchen items'),
        ('Books', 'Books and educational materials'),
        ('Sports', 'Sports equipment and accessories')
      `,
      []
    )

    // Insert sample products
    await executeQuery(
      `
        INSERT IGNORE INTO products (name, description, price, category_id, rating) VALUES
        ('Smartphone Pro', 'Latest smartphone with advanced features', 999.99, 1, 4.5),
        ('Wireless Headphones', 'High-quality wireless headphones', 199.99, 1, 4.2),
        ('Cotton T-Shirt', 'Comfortable cotton t-shirt', 29.99, 2, 4.0),
        ('Coffee Maker', 'Automatic coffee maker', 149.99, 3, 4.3),
        ('Programming Book', 'Learn programming fundamentals', 49.99, 4, 4.7),
        ('Running Shoes', 'Professional running shoes', 129.99, 5, 4.4)
      `,
      []
    )

    console.log("Sample data inserted successfully!")
    return { success: true }
  } catch (error) {
    console.error("Sample data insertion error:", error)
    throw error
  }
}
