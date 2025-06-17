import { executeQuery } from "./db";

export async function createProductsTable() {
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        long_description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category_id INT NOT NULL,
        in_stock BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `, []);
    console.log("Products table created/checked successfully.");
  } catch (error) {
    console.error("Error creating products table:", error);
  }
}

export async function createCategoriesTable() {
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `, []);
    console.log("Categories table created/checked successfully.");
  } catch (error) {
    console.error("Error creating categories table:", error);
  }
}

export async function runMigrations() {
  await createCategoriesTable();
  await createProductsTable();
}
