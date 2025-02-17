import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext/authContext';
import Container from '../components/UI/Container';
import Alert from '../components/UI/Alert';
import Spinner from '../components/UI/Spinner';
import DeleteConfirmationModal from '../components/UI/DeleteConfirmationModal';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const AdminCategoryPage: React.FC = () => {
  const { state } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/categories');
      setCategories(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete || !state.token) {
      setError('You must be logged in to delete categories');
      return;
    }

    try {
      await axios.delete(`http://localhost:5050/api/categories/${categoryToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json'
        }
      });

      setCategories(categories.filter(c => c._id !== categoryToDelete._id));
      setSuccess('Category deleted successfully');
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in again');
      } else {
        setError(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.token) {
      setError('You must be logged in to perform this action');
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        const response = await axios.put(
          `http://localhost:5050/api/categories/${editingCategory._id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${state.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setCategories(categories.map(c => 
          c._id === editingCategory._id ? response.data.data : c
        ));
        setSuccess('Category updated successfully');
      } else {
        // Create new category
        const response = await axios.post(
          'http://localhost:5050/api/categories',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${state.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setCategories([...categories, response.data.data]);
        setSuccess('Category created successfully');
      }
      
      // Reset form
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
  };

  return (
    <Container>
      <h1 className="mb-4">Category Management</h1>
      
      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}

      {/* Add Category Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
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
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({ name: '', description: '' });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Categories List */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category.description || 'N/A'}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEditClick(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteClick(category)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={categoryToDelete?.name || ''}
      />
    </Container>
  );
};

export default AdminCategoryPage;