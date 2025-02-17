import React from "react";
import { Product } from "../../types/product.types";
import { useCart } from "../../context/cartContext/CartContext";
import { Link } from "react-router-dom";
import { refreshIcons } from "../../utils/icons";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { dispatch } = useCart();

  React.useEffect(() => {
    refreshIcons();
  }, []);

  const handleAddToCart = () => {
    const mainImage =
      product.images?.find((img) => img.isMain)?.url ||
      product.images?.[0]?.url;

    dispatch({
      type: "ADD_ITEM",
      payload: {
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: mainImage,
        quantity: 1,
      },
    });
  };

  const isInStock = product.stock > 0;
  const categoryName = product.category?.name || "Uncategorized";

  // Get main image or first available image
  const displayImage =
    product.images?.find((img) => img.isMain)?.url ||
    product.images?.[0]?.url ||
    "/images/placeholder-image.jpg"; 

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={displayImage}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-image.jpg";
          }}
        />
        <Link
          to={`/product/${product._id}`}
          className="quick-view-badge"
          title="Quick View"
        >
          <i data-feather="eye" className="feather-18"></i>
        </Link>
        <div className={`stock-badge ${isInStock ? "in-stock" : "out-of-stock"}`}>
          <i
            data-feather={isInStock ? "check-circle" : "x-circle"}
            className="feather-14"
          ></i>
          {isInStock ? "In Stock" : "Out of Stock"}
        </div>
      </div>
      
      <div className="product-content">
        <div className="category-tag">
          <i data-feather="tag" className="feather-14"></i>
          <span>{categoryName}</span>
        </div>
        
        <h3 className="product-title">{product.name}</h3>
        
        <div className="product-price">
          ${product.price.toFixed(2)}
        </div>
        
        <p className="product-description" title={product.description}>
          {product.description}
        </p>
        
        <button
          className="btn-add-to-cart"
          onClick={handleAddToCart}
          disabled={!isInStock}
        >
          <i data-feather="shopping-cart" className="feather-16"></i>
          <span>{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
