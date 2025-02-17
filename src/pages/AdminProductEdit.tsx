import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/authContext/authContext';
import Container from '../components/UI/Container';
import Spinner from '../components/UI/Spinner';
import Alert from '../components/UI/Alert';
import { Product } from '../types/product.types';

const AdminProductEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/products/${id}`);
        setProduct(response.data.data);
      } catch (err) {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5050/api/products/${id}`,
        product,
        {
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      navigate('/admin/products');
    } catch (err) {
      setError('Failed to update product');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="danger" message={error} />;
  if (!product) return <Alert type="info" message="Product not found" />;

  return (
    <Container>
      <h1 className="mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>
        {/* Other form fields */}
        <button type="submit" className="btn btn-primary">
          Update Product
        </button>
      </form>
    </Container>
  );
};

export default AdminProductEdit;