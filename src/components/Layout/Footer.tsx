import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-sm mt-auto py-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <h5 className="mb-3">ShopBeta</h5>
            <p className="text-muted">Your one-stop shop for quality products.</p>
          </div>
          <div className="col-6 col-md-4">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/products" className="text-decoration-none text-muted">Products</Link></li>
              <li><Link to="/cart" className="text-decoration-none text-muted">Cart</Link></li>
              <li><Link to="/login" className="text-decoration-none text-muted">Login</Link></li>
              <li><Link to="/signup" className="text-decoration-none text-muted">Sign Up</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h6 className="mb-3">Contact</h6>
            <ul className="list-unstyled text-muted">
              <li>Email: contact@shopbeta.com</li>
              <li>Phone: (123) 456-7890</li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center text-muted">
          <small>&copy; {new Date().getFullYear()} ShopBeta. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
