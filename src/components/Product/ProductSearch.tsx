import React from "react";

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value.trim())}
          aria-label="Search products"
        />
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
      </div>
    </div>
  );
};

export default ProductSearch;
