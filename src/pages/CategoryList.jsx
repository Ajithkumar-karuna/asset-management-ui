// frontend/src/pages/CategoryList.js
import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/api';
import DataTable from 'react-data-table-component';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      status: category.status
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.delete(id);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description || '-',
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => (
        <span className={`badge bg-${row.status === 'active' ? 'success' : 'danger'}`}>
          {row.status}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button onClick={() => handleEdit(row)} className="btn btn-sm btn-primary me-2">
            Edit
          </button>
          <button onClick={() => handleDelete(row.id)} className="btn btn-sm btn-danger">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Asset Categories</h2>
        <button className="btn btn-primary" onClick={handleAdd}>Add New Category</button>
      </div>

      <div className="card">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={categories}
            pagination
            highlightOnHover
            responsive
            progressPending={loading}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Category Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryList;