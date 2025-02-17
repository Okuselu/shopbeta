

export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  roles: string[];
  token?: string;
}

export type AuthAction =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" };  // LOGOUT has no payload

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface AuthContextProps {
  state: AuthState;
  user: User | null;  // Add user property
  dispatch: React.Dispatch<AuthAction>;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  roles: string[];
  token?: string;
}
