import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/cartContext/CartContext";
import { useAuth } from "../context/authContext/authContext";
import axios from "axios";
import "./ProductDetailsPage.css";

interface Review {
  _id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
    description?: string;
  } | null;
  stock: number;
  images: {
    url: string;
    publicId: string;
    isMain: boolean;
  }[];
}

const ProductDetailsPage: React.FC = () => {
  const { state: authState } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await axios.post("http://localhost:5050/api/carts/add", {  // Updated from cart to carts
        productId: product._id,
        quantity: quantity,
      });

      dispatch({
        type: "ADD_ITEM",
        payload: {
          _id: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          imageUrl: selectedImage,
        },
      });

      setAddingToCart(false);  // Move this up before navigate
      navigate("/cart");
    } catch (err) {
      setError("Failed to add item to cart");
      setAddingToCart(false);
    }
  };

  // Fix the handleSubmitReview function
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !authState.user) {
      setError("Please login to submit a review");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await axios.post(
        `http://localhost:5050/api/reviews/products/${product._id}/reviews`,
        {
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response.data.success) {
        const newReviewData = response.data.data;
        setReviews([newReviewData, ...reviews]);
        setShowReviewForm(false);
        setNewReview({ rating: 5, comment: "" });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Fix the type error in useEffect
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productRes = await axios.get(
          `http://localhost:5050/api/products/${id}`
        );
        const productData = productRes.data.data;
        setProduct(productData);

        // Fix the type for img parameter
        const mainImage =
          productData.images.find(
            (img: { isMain: boolean; url: string }) => img.isMain
          )?.url || productData.images[0]?.url;
        setSelectedImage(mainImage);

        // Fetch related products using productData instead of product state
        if (productData.category?._id) {
          try {
            const relatedRes = await axios.get(
              `http://localhost:5050/api/products?category=${productData.category._id}&limit=4&exclude=${productData._id}`
            );
            setRelatedProducts(relatedRes.data.data || []);
          } catch (relatedErr) {
            console.log("Related products not available");
            setRelatedProducts([]);
          }
        }

        // Fetch reviews
        try {
          const reviewsRes = await axios.get(
            `http://localhost:5050/api/reviews/products/${id}/reviews`
          );
          setReviews(reviewsRes.data.data || []);
        } catch (reviewErr) {
          console.log("Reviews not available");
          setReviews([]);
        }
      } catch (err) {
        setError("Failed to load product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <i data-feather="alert-circle" className="feather-32"></i>
        <p>{error || "Product not found"}</p>
        <Link to="/products" className="btn-back">
          Return to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="container">
        <nav className="breadcrumb-nav">
          <Link to="/">Home</Link>
          <i data-feather="chevron-right" className="feather-16"></i>
          <Link to="/products">Products</Link>
          <i data-feather="chevron-right" className="feather-16"></i>
          <span>{product.name}</span>
        </nav>

        <div className="product-content">
          <div className="product-gallery">
            <div className="main-image">
              <img
                src={selectedImage || "/placeholder-image.jpg"}
                alt={product?.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.jpg";
                  target.onerror = null;
                }}
              />
            </div>
            {product?.images && product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`${product.name} - ${index + 1}`}
                    className={`thumbnail ${
                      selectedImage === image.url ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(image.url)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="product-meta">
              <span className="category">
                {product.category ? product.category.name : "Uncategorized"}
              </span>
              <div className="stock-status">
                <i
                  data-feather={product.stock > 0 ? "check-circle" : "x-circle"}
                  className={`feather-16 ${
                    product.stock > 0 ? "in-stock" : "out-of-stock"
                  }`}
                ></i>
                <span>
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="price-box">
              <h2>${product.price.toFixed(2)}</h2>
              {product.stock > 0 && (
                <div className="quantity-selector">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    <i data-feather="minus" className="feather-16"></i>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(product.stock, parseInt(e.target.value) || 1)
                        )
                      )
                    }
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="qty-btn"
                  >
                    <i data-feather="plus" className="feather-16"></i>
                  </button>
                </div>
              )}
            </div>

            // Update the action buttons section in the return statement
            <div className="action-buttons">
              <button
                className={`btn-add-to-cart ${addingToCart ? "loading" : ""}`}
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
              >
                <i data-feather="shopping-cart" className="feather-16"></i>
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <Link to="/checkout" className="btn-checkout">
                <i data-feather="credit-card" className="feather-16"></i>
                Proceed to Checkout
              </Link>
            </div>

            <div className="product-description">
              <h3>Product Description</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        <section className="reviews-section">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            {authState.user ? (
              <button
                className="btn-write-review"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                <i data-feather="edit" className="feather-16"></i>
                Write a Review
              </button>
            ) : (
              <Link to="/login" className="btn-write-review">
                <i data-feather="log-in" className="feather-16"></i>
                Login to Write a Review
              </Link>
            )}
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="rating-input">
                <label>Your Rating:</label>
                <div className="stars">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className={star <= newReview.rating ? "active" : ""}
                    >
                      <i data-feather="star" className="feather-24"></i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="comment-input">
                <label>Your Review:</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  required
                  minLength={3}
                  maxLength={500}
                  placeholder="Share your thoughts about this product..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={submittingReview}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          )}

          <div className="reviews-summary">
            <div className="average-rating">
              <span className="rating-number">
                {reviews.length > 0
                  ? (
                      reviews.reduce((acc, rev) => acc + rev.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "No"}
              </span>
              <span className="rating-text">
                {reviews.length === 1
                  ? "1 Review"
                  : `${reviews.length} Reviews`}
              </span>
            </div>
          </div>

          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <h4>{review.username}</h4>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          data-feather={i < review.rating ? "star" : "star"}
                          className={`feather-16 ${
                            i < review.rating ? "filled" : ""
                          }`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>Related Products</h2>
            <div className="products-grid">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  to={`/products/${relatedProduct._id}`}
                  key={relatedProduct._id}
                  className="related-product-card"
                >
                  <img
                    src={
                      relatedProduct.images[0]?.url || "/placeholder-image.jpg"
                    }
                    alt={relatedProduct.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.jpg";
                      target.onerror = null;
                    }}
                  />
                  <h3>{relatedProduct.name}</h3>
                  <p className="price">${relatedProduct.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
