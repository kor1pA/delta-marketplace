-- First, add some sample products if they don't exist
INSERT INTO `Category` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
SELECT 1, 'Electronics', 'Electronic devices and gadgets', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `Category` WHERE `id` = 1);

-- Add sample products
INSERT INTO `Product` (`id`, `name`, `description`, `price`, `category_id`, `rating`, `review_count`, `in_stock`, `category_name`, `created_at`, `updated_at`)
VALUES 
  (1, 'Smart Phone', 'High-end smartphone with great features', 999.99, 1, 4.5, 10, true, 'Electronics', NOW(), NOW()),
  (2, 'Laptop', 'Powerful laptop for work and gaming', 1499.99, 1, 4.8, 15, true, 'Electronics', NOW(), NOW()),
  (3, 'Tablet', 'Versatile tablet for entertainment', 699.99, 1, 4.3, 8, true, 'Electronics', NOW(), NOW()),
  (4, 'Smartwatch', 'Advanced fitness tracking smartwatch', 299.99, 1, 4.6, 12, true, 'Electronics', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`);

-- Add colors for each product
INSERT INTO `ProductColor` (`product_id`, `color`, `created_at`, `updated_at`)
VALUES 
  -- Product 1 (Smart Phone)
  (1, 'Black', NOW(), NOW()),
  (1, 'White', NOW(), NOW()),
  (1, 'Silver', NOW(), NOW()),
  -- Product 2 (Laptop)
  (2, 'Space Gray', NOW(), NOW()),
  (2, 'Silver', NOW(), NOW()),
  -- Product 3 (Tablet)
  (3, 'Space Gray', NOW(), NOW()),
  (3, 'Silver', NOW(), NOW()),
  (3, 'Gold', NOW(), NOW()),
  -- Product 4 (Smartwatch)
  (4, 'Black', NOW(), NOW()),
  (4, 'Silver', NOW(), NOW());
