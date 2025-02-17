//src/pages/LoginPage.tsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext/authContext";
import Card from "../components/UI/Card";

const LoginPage: React.FC = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const response = await axios.post(
        "http://localhost:5050/api/users/login",
        formData
      );
  
      if (response.data.token) {
        dispatch({
          type: "LOGIN",
          payload: response.data,
        });
        // Redirect based on user role
        if (response.data.user.roles?.includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/'); // Regular users go to home page
        }
      }
    } catch (err) {
      // ... error handling
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <Card>
            <h2 className="section-title text-center">Welcome Back</h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-primary text-decoration-none"
                  >
                    Sign up
                  </Link>
                </small>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
