USE deltamarketplace;

-- Insert sample categories
INSERT INTO categories (name, description, image_url, product_count) VALUES
('Electronics', 'Electronic devices and gadgets', '/placeholder.svg?height=100&width=100', 1243),
('Clothing', 'Apparel and fashion items', '/placeholder.svg?height=100&width=100', 856),
('Home & Kitchen', 'Products for your home', '/placeholder.svg?height=100&width=100', 932),
('Beauty & Personal Care', 'Beauty products and personal care items', '/placeholder.svg?height=100&width=100', 723),
('Sports & Outdoors', 'Sports equipment and outdoor gear', '/placeholder.svg?height=100&width=100', 512),
('Books', 'Books and literature', '/placeholder.svg?height=100&width=100', 1567);

-- Insert sample products
INSERT INTO products (name, description, long_description, price, rating, review_count, category_id, in_stock) VALUES
('Wireless Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life.', '<p>Experience premium sound quality with our Wireless Headphones. These headphones feature advanced noise-cancellation technology that blocks out ambient noise, allowing you to focus on your music or calls.</p><p>With a 30-hour battery life, you can enjoy your favorite tunes all day long without worrying about recharging. The comfortable over-ear design ensures you can wear them for extended periods without discomfort.</p><p>Key Features:</p><ul><li>Active Noise Cancellation</li><li>30-hour battery life</li><li>Bluetooth 5.0 connectivity</li><li>Built-in microphone for calls</li><li>Comfortable over-ear design</li><li>Quick charge: 5 minutes for 3 hours of playback</li></ul>', 199.99, 4.5, 128, 1, TRUE),
('Smart Watch', 'Track your fitness, receive notifications, and more with this sleek smart watch.', '<p>Stay connected and track your fitness with our Smart Watch. This sleek device allows you to monitor your heart rate, count steps, and track your sleep patterns.</p><p>Receive notifications from your smartphone directly on your wrist, so you never miss an important message or call. The long-lasting battery ensures you can go days without recharging.</p>', 249.99, 4.2, 95, 1, TRUE),
('Organic Cotton T-Shirt', 'Comfortable, eco-friendly t-shirt made from 100% organic cotton.', '<p>Feel good and look good with our Organic Cotton T-Shirt. Made from 100% organic cotton, this t-shirt is both comfortable and environmentally friendly.</p><p>The soft fabric feels great against your skin, and the classic design goes with everything in your wardrobe. Available in multiple colors and sizes.</p>', 29.99, 4.8, 210, 2, TRUE),
('Stainless Steel Water Bottle', 'Keep your drinks hot or cold for hours with this insulated water bottle.', '<p>Stay hydrated in style with our Stainless Steel Water Bottle. The double-wall vacuum insulation keeps your drinks cold for up to 24 hours or hot for up to 12 hours.</p><p>Made from high-quality 18/8 stainless steel, this bottle is durable, BPA-free, and won\'t transfer flavors. The leak-proof cap ensures your bag stays dry.</p>', 34.99, 4.7, 175, 3, TRUE),
('Bluetooth Speaker', 'Portable Bluetooth speaker with 360° sound and 12-hour battery life.', '<p>Take your music anywhere with our Bluetooth Speaker. The compact design delivers surprisingly powerful 360° sound that fills any room.</p><p>With a 12-hour battery life, you can enjoy your favorite tunes all day long. The water-resistant design makes it perfect for outdoor use, even by the pool or at the beach.</p>', 79.99, 4.3, 88, 1, TRUE),
('Yoga Mat', 'Non-slip, eco-friendly yoga mat perfect for all types of yoga.', '<p>Enhance your yoga practice with our premium Yoga Mat. The non-slip surface provides excellent grip, even during the most challenging poses.</p><p>Made from eco-friendly materials, this mat is free from harmful chemicals and safe for you and the environment. The perfect thickness provides just the right amount of cushioning for your joints.</p>', 45.99, 4.6, 132, 5, TRUE),
('Coffee Maker', 'Programmable coffee maker with thermal carafe to keep your coffee hot for hours.', '<p>Start your day right with our programmable Coffee Maker. Set it up the night before, and wake up to freshly brewed coffee every morning.</p><p>The thermal carafe keeps your coffee hot for hours without burning it, so you can enjoy a perfect cup anytime. The intuitive controls make it easy to customize your brew strength and temperature.</p>', 129.99, 4.4, 67, 3, TRUE),
('Leather Wallet', 'Genuine leather wallet with RFID blocking technology.', '<p>Keep your cards and cash secure with our Leather Wallet. Made from genuine leather, this wallet ages beautifully and develops a unique patina over time.</p><p>The built-in RFID blocking technology protects your credit cards from unauthorized scanning. With multiple card slots and a bill compartment, everything stays organized.</p>', 39.99, 4.5, 92, 2, TRUE);

-- Insert product images
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
(1, '/placeholder.svg?height=500&width=500', TRUE, 0),
(1, '/placeholder.svg?height=500&width=500', FALSE, 1),
(1, '/placeholder.svg?height=500&width=500', FALSE, 2),
(1, '/placeholder.svg?height=500&width=500', FALSE, 3),
(2, '/placeholder.svg?height=500&width=500', TRUE, 0),
(3, '/placeholder.svg?height=500&width=500', TRUE, 0),
(4, '/placeholder.svg?height=500&width=500', TRUE, 0),
(5, '/placeholder.svg?height=500&width=500', TRUE, 0),
(6, '/placeholder.svg?height=500&width=500', TRUE, 0),
(7, '/placeholder.svg?height=500&width=500', TRUE, 0),
(8, '/placeholder.svg?height=500&width=500', TRUE, 0);

-- Insert product variants (colors)
INSERT INTO product_variants (product_id, variant_type, variant_value) VALUES
(1, 'color', 'Black'),
(1, 'color', 'Silver'),
(1, 'color', 'Blue'),
(2, 'color', 'Black'),
(2, 'color', 'Silver'),
(3, 'color', 'White'),
(3, 'color', 'Black'),
(3, 'color', 'Blue'),
(3, 'size', 'S'),
(3, 'size', 'M'),
(3, 'size', 'L'),
(3, 'size', 'XL'),
(4, 'color', 'Silver'),
(4, 'color', 'Black'),
(4, 'color', 'Blue');

-- Insert product specifications
INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES
(1, 'Brand', 'TechAudio'),
(1, 'Model', 'WH-1000X'),
(1, 'Connectivity', 'Bluetooth 5.0'),
(1, 'Battery Life', '30 hours'),
(1, 'Weight', '250g'),
(1, 'Dimensions', '7.3 x 3.1 x 9.4 inches'),
(1, 'Warranty', '1 year'),
(2, 'Brand', 'SmartTech'),
(2, 'Model', 'SW-200'),
(2, 'Display', '1.4 inch AMOLED'),
(2, 'Battery Life', '7 days'),
(2, 'Water Resistance', 'IP68'),
(2, 'Compatibility', 'iOS and Android');
