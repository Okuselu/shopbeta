import React from "react";
import { Category } from '../../types/product.types';

interface ProductFilterProps {
  categories: Category[];  // Update to use Category type
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="mb-4">
      <h5 className="mb-3">Categories</h5>
      <div className="d-flex flex-wrap gap-2">
        <button
          className={`btn btn-sm ${
            selectedCategory === "" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => onCategoryChange("")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            className={`btn btn-sm ${
              selectedCategory === category._id
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => onCategoryChange(category._id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
