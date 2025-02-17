// src/context/authContext/authContext.tsx
import React, {
  createContext,
  useReducer,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { AuthContextProps, AuthState, User } from "../../types/auth.types";
import authReducer from "./authReducer";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
};

// Update the context initialization to include user
export const AuthContext = createContext<AuthContextProps>({
  state: initialState,
  user: null,
  dispatch: () => null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState, () => {
    try {
      const savedAuth = localStorage.getItem('auth');
      return savedAuth ? JSON.parse(savedAuth) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify(state));
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{ 
      state, 
      dispatch,
      user: state.user  // Add user to the context value
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Update the AuthAction type definition
type AuthAction = 
  | { type: 'LOGIN'; payload: { user: any; token: string } }
  | { type: 'LOGOUT' }; // LOGOUT doesn't need a payload
