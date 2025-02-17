export interface OrderItem {
  _id: string;
  order: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  price: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  items: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  orderItems: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  total: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'failed';
  paymentMethod: string;
  paymentReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  message: string;
  data: Order;
  error: null | string;
}

export interface OrdersResponse {
  message: string;
  data: Order[];
  error: null | string;
}
