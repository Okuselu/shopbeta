import axios from 'axios';
import { Order, OrderItem } from '../../types/order.types';

const API_URL = 'http://localhost:5050/api';

export const orderApi = {
  // Order endpoints
  getAllOrders: async () => {
    const response = await axios.get<Order[]>(`${API_URL}/orders`);
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const response = await axios.get<Order>(`${API_URL}/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    const response = await axios.patch<Order>(`${API_URL}/orders/${orderId}`, { status });
    return response.data;
  },

  // OrderItem endpoints
  getOrderItems: async (orderId: string) => {
    const response = await axios.get<OrderItem[]>(`${API_URL}/order-items/${orderId}`);
    return response.data;
  }
};