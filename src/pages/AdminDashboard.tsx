import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/UI/Container";
import Card from "../components/UI/Card";
import { useAuth } from "../context/authContext/authContext";
import axios from 'axios';
import { OrdersResponse } from "../types/order.types";

const AdminDashboard: React.FC = () => {
  const { state } = useAuth();
  const userName = state.user?.firstName || 
                  state.user?.username || 
                  state.user?.email?.split('@')[0] || 
                  'Admin';

  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const response = await axios.get<OrdersResponse>(
          "http://localhost:5050/api/orders",
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const orders = response.data.data;
        setOrderStats({
          total: orders.length,
          pending: orders.filter(o => o.status === 'pending').length,
          completed: orders.filter(o => o.status === 'completed').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length
        });
      } catch (error) {
        console.error('Failed to fetch order stats:', error);
      }
    };

    fetchOrderStats();
  }, []);

  return (
    <Container className="admin-dashboard">
      <h1 className="text-center mb-2">Welcome, {userName}!</h1>
      <p className="text-center text-muted mb-5">Admin Dashboard</p>

      <div className="row g-4">
        <div className="col-md-4">
          <Card>
            <h5 className="card-title">Product Management</h5>
            <p className="card-text">Add, edit, and manage product inventory</p>
            <Link to="/admin/products" className="btn btn-primary w-100">
              Manage Products
            </Link>
          </Card>
        </div>

        <div className="col-md-4">
          <Card>
            <h5 className="card-title">Order Management</h5>
            <p className="card-text">View and process customer orders</p>
            <Link to="/admin/orders" className="btn btn-success w-100">
              Manage Orders
            </Link>
          </Card>
        </div>

        <div className="col-md-4">
          <Card>
            <h5 className="card-title">User Management</h5>
            <p className="card-text">Manage user accounts and permissions</p>
            <Link to="/admin/users" className="btn btn-info w-100">
              Manage Users
            </Link>
          </Card>
        </div>
        
        <div className="col-md-4">
          <Card>
            <h5 className="card-title">Category Management</h5>
            <p className="card-text">Manage product categories</p>
            <Link to="/admin/categories" className="btn btn-warning w-100">
              Manage Categories
            </Link>
          </Card>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5>Total Orders</h5>
              <h3>{orderStats.total}</h3>
            </div>
          </div>
        </div>
        {/* Add similar cards for other stats */}
      </div>
    </Container>
  );
};

export default AdminDashboard;
