//src/pages/Homepage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/Product/ProductCard";
import { Product, Category } from "../types/product.types";
import { useAuth } from "../context/authContext/authContext";
import Hero from '../components/Hero/Hero';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { state } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5050/api/products"),
          axios.get<{ data: Category[] }>("http://localhost:5050/api/categories")
        ]);
        
        setProducts(productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Remove separate fetch functions since they're now in useEffect
  
  const handleAddToCart = async (productId: string) => {
    try {
      await axios.post("http://localhost:5050/api/cart/add", {
        productId,
        quantity: 1,
      });
    } catch (err) {
      setError("Failed to add item to cart");
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/newsletter/subscribe", { email });
      setSubscribeStatus("success");
      setEmail("");
      // Clear success message after 3 seconds
      setTimeout(() => setSubscribeStatus(""), 3000);
    } catch (err) {
      setSubscribeStatus("error");
      // Clear error message after 3 seconds
      setTimeout(() => setSubscribeStatus(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  const getCategoryIcon = (categoryName: string): string => {
    const icons: { [key: string]: string } = {
      'Electronics': 'smartphone',
      'Clothing': 'shopping-bag',
      'Books': 'book-open',
      'Home': 'home',
      'Sports': 'activity',
      'Beauty': 'star',
      'Toys': 'gift',
      'Food': 'coffee',
      'Furniture': 'box',
      'Health': 'heart',
      'Automotive': 'truck',
      'Garden': 'sun',
      'Office': 'briefcase',
      'Pets': 'github', // using github icon as a placeholder for pets
      'Music': 'music',
      'Art': 'image'
    };
    return icons[categoryName] || 'grid'; // Returns 'grid' as default icon if category not found
  };

  return (
    <div className="home-page">
      <Hero />
      
      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="category-card"
              >
                <i data-feather={getCategoryIcon(category.name)}></i>
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="section-title">Stay Updated</h2>
            <p>Subscribe to our newsletter for exclusive offers and updates</p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <button type="submit">
                <i data-feather="send" className="feather-16"></i>
                Subscribe
              </button>
            </form>
            {subscribeStatus === "success" && (
              <p className="success-message">Thank you for subscribing!</p>
            )}
            {subscribeStatus === "error" && (
              <p className="error-message">Subscription failed. Please try again.</p>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="error-message">
          <i data-feather="alert-circle" className="feather-16"></i>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default HomePage;
