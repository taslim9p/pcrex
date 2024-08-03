import React from 'react';
import { useCart } from '../context/cart';

function Quant({ quant, productId,maxQuant }) {
  const [cart, setCart] = useCart();

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((product) =>
        product._id === productId ? { ...product, quant: newQuantity } : product
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const add = () => {
    if(quant<maxQuant){
    updateQuantity(productId, quant + 1);
    }
  };

  const sub = () => {
    if (quant > 1) {
      updateQuantity(productId, quant - 1);
    } else {
      console.error('Minimum quantity reached');
    }
  };

  return (
    <div className="wrapper p-2 bg-slate-200 h-8 flex items-center w-24 mt-2">
      <button className="plus mr-4" onClick={add}>
        <h1 className="w-5">+</h1>
      </button>
      <span className="num">{quant}</span>
      <button className="minus ml-4" onClick={sub}>
        <h1 className="w-5">-</h1>
      </button>
    </div>
  );
}

export default Quant;
