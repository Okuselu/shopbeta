import React from "react";
import { CartItem as CartItemType } from "../../types/cart.types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-3">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="img-fluid rounded-start"
            style={{ height: "150px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-9">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <h5 className="card-title">{item.name}</h5>
              <button
                className="btn btn-link text-danger"
                onClick={() => onRemove(item._id)}
                aria-label="Remove item"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <p className="card-text text-muted mb-3">
              ${item.price.toFixed(2)} each
            </p>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div className="input-group" style={{ width: "120px" }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        onUpdateQuantity(item._id, value);
                      }
                    }}
                    min="0"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-end">
                <p className="h5 mb-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
