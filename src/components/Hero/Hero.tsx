import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Discover Amazing Products</h1>
          <p>Shop the latest trends with unbeatable prices</p>
          <Link to="/products" className="hero-cta">
            <span>Shop Now</span>
            <i data-feather="arrow-right" className="feather-16"></i>
          </Link>
        </div>
        <div className="featured-products">
          <div className="featured-grid">
            <div className="featured-item main">
              <img src="/images/featured-1.jpg" alt="Featured Product" />
              <div className="featured-overlay">
                <h3>New Arrivals</h3>
                <p>Fresh styles just in</p>
              </div>
            </div>
            <div className="featured-item">
              <img src="/images/featured-2.jpg" alt="Featured Product" />
              <div className="featured-overlay">
                <h3>Best Sellers</h3>
                <p>Shop customer favorites</p>
              </div>
            </div>
            <div className="featured-item">
              <img src="/images/featured-3.jpg" alt="Featured Product" />
              <div className="featured-overlay">
                <h3>Special Offers</h3>
                <p>Limited time deals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;