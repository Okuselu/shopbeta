import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext/authContext';
import { Order } from '../../types/order.types';
import Container from '../../components/UI/Container';
import Spinner from '../../components/UI/Spinner';
import Alert from '../../components/UI/Alert';

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
          'Content-Type': 'application/json',
        },
      });
      setOrder(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await axios.patch(
        `http://localhost:5050/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      fetchOrderDetails();
    } catch (err: any) {
      setError('Failed to update order status');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="danger" message={error} />;
  if (!order) return <Alert type="warning" message="Order not found" />;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order Details</h1>
        <button 
          className="btn btn-outline-primary"
          onClick={() => navigate('/admin/orders')}
        >
          Back to Orders
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Order #{order._id}</h5>
            <select
              className="form-select form-select-sm w-auto"
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Customer Information</h6>
              {order.shippingInfo ? (
                <p>
                  {order.shippingInfo.firstName} {order.shippingInfo.lastName}<br />
                  Email: {order.shippingInfo.email}<br />
                  Phone: {order.shippingInfo.phone}
                </p>
              ) : (
                <p className="text-muted">No customer information available</p>
              )}
            </div>
            <div className="col-md-6">
              <h6>Shipping Address</h6>
              {order.shippingInfo ? (
                <p>
                  {order.shippingInfo.address}<br />
                  {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                </p>
              ) : (
                <p className="text-muted">No shipping information available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Order Items</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.orderItems || []).map((item) => (
                  <tr key={`${item.product?._id}-${item.quantity}-${item.price}`}>
                    <td>{item.product?.name || 'Product Unavailable'}</td>
                    <td>${(item.price || 0).toFixed(2)}</td>
                    <td>{item.quantity || 0}</td>
                    <td>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="text-end"><strong>Total Amount:</strong></td>
                  <td><strong>${(order.totalAmount || 0).toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OrderDetailsPage;