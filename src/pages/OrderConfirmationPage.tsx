import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Order } from "../types/order.types";
import Spinner from "../components/UI/Spinner";
import OrderTracking from "../components/OrderTracking";
import "../styles/OrderTracking.css";

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/api/orders/${orderId}`
        );
        if (response.data && response.data.order) {
          setOrder(response.data.order);
        } else {
          throw new Error("Invalid order data received");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!order) return <div>Order not found</div>;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "failed":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container py-5">
      <div className="card">
        <div className="card-body">
          <div className="text-center mb-4">
            <i
              className="bi bi-check-circle text-success"
              style={{ fontSize: "3rem" }}
            ></i>
            <h2 className="mt-2">Order Confirmed!</h2>
            <p className="text-muted">Order #{order._id}</p>
            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
              {order.status.toUpperCase()}
            </span>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h5>Shipping Information</h5>
              <p>
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                <br />
                {order.shippingInfo.email}
                <br />
                {order.shippingInfo.address}
                <br />
                {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                {order.shippingInfo.zipCode}
                <br />
                {order.shippingInfo.phone}
              </p>
            </div>
            <div className="col-md-6">
              <h5>Payment Information</h5>
              <p>
                Reference: {order.paymentReference}
                <br />
                Status:{" "}
                <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h5>Order Summary</h5>
            {order.items.map((item) => (
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
              <strong>${order.total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/products" className="btn btn-primary me-2">
              Continue Shopping
            </Link>
            <Link to="/orders" className="btn btn-outline-primary">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
