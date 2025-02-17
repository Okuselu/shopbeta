//src/context/cartContext/cartReducer.ts
import { CartState, CartAction } from "../../types/cart.types";

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      
      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          items: updatedItems,
          total: state.total + action.payload.price,
        };
      }

      return {
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      };
    }

    case "REMOVE_ITEM": {
      const item = state.items.find((item) => item._id === action.payload);
      if (!item) return state;

      return {
        items: state.items.filter((item) => item._id !== action.payload),
        total: state.total - (item.price * item.quantity),
      };
    }

    case "UPDATE_QUANTITY": {
      const item = state.items.find((item) => item._id === action.payload.id);
      if (!item) return state;

      const quantityDiff = action.payload.quantity - item.quantity;
      
      return {
        items: state.items.map((item) =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff),
      };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
};

export default cartReducer;
