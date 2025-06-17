ALTER TABLE reviews
ADD CONSTRAINT fk_reviews_products
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;
