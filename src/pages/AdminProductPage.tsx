import React, { useState, useEffect, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useAuth } from '../context/authContext/authContext';
import Spinner from '../components/UI/Spinner';
import Alert from '../components/UI/Alert';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../components/UI/DeleteConfirmationModal';


interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: File[];
}

// Update the Product interface
interface Product extends Omit<ProductFormData, 'category'> {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  category: {
    _id: string;
    name: string;
    description?: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Product;
  message?: string;
}

// Add new interface for Category
interface Category {
  _id: string;
  name: string;
  description?: string;
}

const AdminProductPage: React.FC = () => {
  const navigate = useNavigate(); // Move inside component
  const { state } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Move success state here
  const [preview, setPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    images: []
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Add loading state for products
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const response = await axios.get('http://localhost:5050/api/products', {
          headers: {
            'Authorization': `Bearer ${state.token}`,
          }
        });
        setProducts(response.data.data || []);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        if (err.response?.status === 401) {
          navigate('/login'); // Redirect to login if unauthorized
        }
        setError(err.response?.data?.message || 'Failed to fetch products');
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    
    if (state.token) {
      fetchProducts();
    }
  }, [state.token, navigate]);
 
    const handleDeleteClick = (product: Product) => {
      setProductToDelete(product);
      setDeleteModalOpen(true);
    }
    
    const handleDeleteConfirm = async () => {
      if (!productToDelete || !state.token) {
        setError('You must be logged in to delete products');
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.delete(
          `http://localhost:5050/api/products/${productToDelete._id}`,
          {
            headers: {
              'Authorization': `Bearer ${state.token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            validateStatus: function (status) {
              return status < 500; // Resolve only if status is less than 500
            }
          }
        );

        if (response.status === 401) {
          setError('Your session has expired. Please log in again.');
          navigate('/login');
          return;
        }

        if (response.status !== 200) {
          throw new Error(response.data.message || 'Failed to delete product');
        }
       
        setProducts(products.filter(p => p._id !== productToDelete._id));
        setSuccess('Product deleted successfully');
        setDeleteModalOpen(false);
        setProductToDelete(null);
      } catch (err: any) {
        console.error('Delete error:', err);
        setError(err.message || 'Failed to delete product');
      }
    };


    const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' 
        ? value === '' ? 0 : Number(value)
        : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    // Clean up old preview URLs
    preview.forEach(url => URL.revokeObjectURL(url));
    
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));

    // Create new preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreview(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.token) {
      setError('You must be logged in to perform this action');
      return;
    }

    // Validate form data
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    if (formData.stock < 0) {
      setError('Stock cannot be negative');
      return;
    }

    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }
  
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('stock', formData.stock.toString());
      formDataToSend.append('category', formData.category);

      // Append images
      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });
  
      const response = await axios.post(
        'http://localhost:5050/api/products',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      
      const newProduct = response.data.data;
      setSuccess('Product added successfully!');
      setProducts(prevProducts => [...prevProducts, newProduct]);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        images: []
      });
      setPreview([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Error creating product:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };
   // Add this useEffect near the top of the component, with other hooks
   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/categories');
        setCategories(response.data.data);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.response?.data?.message || 'Failed to load categories');
      }
    };
  
    fetchCategories();
  }, []);


  // Update the price and stock input fields in the form
  return (
    <div className="container py-5">
      <h1 className="mb-4">Product Management</h1>
      
      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}
      
      {/* Add Product Form Card */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Add New Product</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Price</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={formData.stock || ''}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Product Images</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="d-none"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-outline-secondary w-100"
              >
                Click to upload images
              </button>
            </div>

            {preview.length > 0 && (
              <div className="row mb-3">
                {preview.map((url, index) => (
                  <div key={index} className="col-3 mb-3">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="img-thumbnail"
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Add Product List */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Product List</h5>
          <div className="table-responsive">
            {productsLoading ? (
              <div className="text-center py-4">
                <Spinner />
              </div>
            ) : products.length === 0 ? (
              <p className="text-center py-4">No products found</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => product && (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.category?.name || 'N/A'}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteClick(product)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={productToDelete?.name || ''}
      />
    </div>
  );
};

export default AdminProductPage;
