export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
}

export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  shippingAddress?: ShippingAddress;
  token?: string;
}

export interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
  shippingAddress: ShippingAddress;
}

export interface RegisterUserResponse {
  message: string;
  data: {
    user: User;
    defaultAddress: ShippingAddress & { _id: string; isDefault: boolean };
  };
  error: null | string;
}
