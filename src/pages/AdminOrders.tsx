import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext/authContext";
import Container from "../components/UI/Container";
import Spinner from "../components/UI/Spinner";
import Alert from "../components/UI/Alert";
import { Order } from "../types/order.types";

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { state } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [state.token]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/orders", {
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
      });
      
      // Update to use the correct response structure
      setOrders(Array.isArray(response.data.data) ? response.data.data : []);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await axios.patch(
        `http://localhost:5050/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchOrders(); // Refresh orders after update
    } catch (err: any) {
      setError("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = searchTerm === "" || 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shippingInfo?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <Spinner />;
  if (error) return <Alert type="danger" message={error} />;

  return (
    <Container>
      <h1 className="mb-4">Order Management</h1>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Order ID or Customer Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.shippingInfo ? (
                    <>
                      {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                      <br />
                      <small className="text-muted">{order.shippingInfo.email}</small>
                    </>
                  ) : (
                    <span className="text-muted">No customer info</span>
                  )}
                </td>
                <td>${(order.totalAmount || 0).toFixed(2)}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => window.location.href = `/admin/orders/${order._id}`}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center mt-4">
          <p>No orders found</p>
        </div>
      )}
    </Container>
  );
};

export default AdminOrders;
