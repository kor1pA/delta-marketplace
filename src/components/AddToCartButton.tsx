import React from "react";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  color: string;
}

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, quantity = 1 }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  return (
    <button onClick={handleAddToCart}>
      Додати в корзину
    </button>
  );
};

export default AddToCartButton;
