import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  RegisterUserRequest,
  RegisterUserResponse,
  ShippingAddress,
} from "../types/user.types";
import Card from "../components/UI/Card";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterUserRequest>({
    username: "",
    email: "",
    password: "",
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      phoneNumber: "",
    },
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      // Handle nested shipping address fields
      const [parent, child] = name.split(".") as [
        "shippingAddress",
        keyof ShippingAddress
      ];
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post<RegisterUserResponse>(
        "http://localhost:5050/api/users/register",
        formData
      );

      if (response.data.message === "User registered successfully") {
        navigate("/login");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Registration failed");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <Card>
            <h2 className="section-title text-center">Create Account</h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <h4 className="section-subtitle">Personal Information</h4>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <h4 className="section-subtitle">Shipping Address</h4>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Street</label>
                    <input
                      type="text"
                      name="shippingAddress.street"
                      className="form-control"
                      value={formData.shippingAddress.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="shippingAddress.city"
                      className="form-control"
                      value={formData.shippingAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="shippingAddress.state"
                      className="form-control"
                      value={formData.shippingAddress.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="shippingAddress.country"
                      className="form-control"
                      value={formData.shippingAddress.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      name="shippingAddress.zipCode"
                      className="form-control"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="shippingAddress.phoneNumber"
                      className="form-control"
                      value={formData.shippingAddress.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
