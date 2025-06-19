import React, { createContext, useReducer } from 'react';

export const CartContext = createContext();

const initialState = {
  cart: {
    items: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    totalPrice: 0,
    totalItems: 0,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const newItem = action.payload;
      const existItem = state.cart.items.find((item) => item._id === newItem._id);
      const items = existItem
        ? state.cart.items.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.items, newItem];
      localStorage.setItem('cartItems', JSON.stringify(items));
      return { ...state, cart: { ...state.cart, items } };
    }
    case 'REMOVE_FROM_CART': {
      const items = state.cart.items.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem('cartItems', JSON.stringify(items));
      return { ...state, cart: { ...state.cart, items } };
    }
    case 'CLEAR_CART':
      localStorage.removeItem('cartItems');
      return { ...state, cart: { items: [], totalPrice: 0, totalItems: 0 } };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Recalculate totals
  state.cart.totalItems = state.cart.items.reduce((acc, item) => acc + item.quantity, 0);
  state.cart.totalPrice = state.cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const value = { cart: state.cart, dispatch };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
