import React, { useState } from "react";

const Cart = () => {
  const [totalPrice, setTotalPrice] = useState(0);

  // Função para atualizar o preço total quando um produto é adicionado ao carrinho
  const addToCart = (productPrice) => {
    setTotalPrice(totalPrice + productPrice);
  };

  return (
    <div>
      <h2>Carrinho de Compras</h2>
      <p>Total a pagar: R${totalPrice}</p>
    </div>
  );
};

export default Cart;
