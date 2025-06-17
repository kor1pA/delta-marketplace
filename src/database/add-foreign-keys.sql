-- Add foreign key constraints to reviews table
ALTER TABLE reviews
ADD CONSTRAINT fk_reviews_products
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

-- Optionally, add indexes to improve query performance
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
