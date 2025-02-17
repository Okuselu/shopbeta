import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext/CartContext";
import { useAuth } from "../context/authContext/authContext";
import axios from "axios";

// Add PaystackPop import
declare const PaystackPop: any;

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const { user, state: authState } = useAuth();  // Add authState from useAuth

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  // Prefill form with user data when component mounts
  useEffect(() => {
    if (user) {
      setShippingInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    if (typeof window.PaystackPop === "undefined") {
      console.error("Paystack script not loaded");
      setError("Payment service not available. Please refresh the page.");
      setIsProcessing(false);
      return;
    }

    try {
      // Define callback function
      function handlePaystackResponse(response: any) {
        if (response.status === "success") {
          const createOrder = async () => {
            try {
              const orderData = {
                items: state.items,
                total: state.total,
                shippingInfo,
                paymentReference: response.reference,
                status: "paid",
              };

              const orderResponse = await axios.post(
                "http://localhost:5050/api/orders",
                orderData,
                {
                  headers: {
                    'Authorization': `Bearer ${authState.token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );

              if (orderResponse.data.success) {
                dispatch({ type: "CLEAR_CART" });
                navigate(`/order-confirmation/${orderResponse.data.orderId}`);
              }
            } catch (err) {
              console.error("Order creation error:", err);
              setError("Failed to create order. Please contact support.");
            }
          };
          createOrder();
        }
        setIsProcessing(false);
      }

      const config = {
        key: "pk_test_a6f5409fe07b2d84d50d9986b875c6f595bacf40",
        email: shippingInfo.email,
        amount: Math.round(state.total * 100),
        currency: "NGN",
        firstname: shippingInfo.firstName,
        lastname: shippingInfo.lastName,
        phone: shippingInfo.phone,
        ref: `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
        callback: handlePaystackResponse,
        onClose: function () {
          setIsProcessing(false);
        },
      };

      const paystack = window.PaystackPop.setup(config);
      paystack.openIframe();
    } catch (error: any) {
      console.error("Paystack Error:", error);
      setError("Payment initialization failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // Update the button in the return statement
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          <h2 className="mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  placeholder="First Name"
                  value={shippingInfo.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  placeholder="Last Name"
                  value={shippingInfo.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12">
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  placeholder="Address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  placeholder="State"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  name="zipCode"
                  placeholder="Zip"
                  value={shippingInfo.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-12">
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  placeholder="Phone Number"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-4 w-100"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            Nam{" "}
          </form>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>
              {state.items.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>${state.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
