// frontend/src/pages/AssetForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assetService, categoryService } from '../services/api';

function AssetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    assetId: '',
    serialNumber: '',
    categoryId: '',
    make: '',
    model: '',
    description: '',
    purchaseDate: '',
    purchasePrice: '',
    branch: '',
    status: 'available'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchAsset();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll({ status: 'active' });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAsset = async () => {
    try {
      const response = await assetService.getById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching asset:', error);
      alert('Failed to fetch asset details');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await assetService.update(id, formData);
      } else {
        await assetService.create(formData);
      }
      navigate('/assets');
    } catch (error) {
      console.error('Error saving asset:', error);
      alert('Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{isEdit ? 'Edit Asset' : 'Add New Asset'}</h2>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Asset ID *</label>
                <input
                  type="text"
                  className="form-control"
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleChange}
                  required
                  disabled={isEdit}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Serial Number *</label>
                <input
                  type="text"
                  className="form-control"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Make</label>
                <input
                  type="text"
                  className="form-control"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Model</label>
                <input
                  type="text"
                  className="form-control"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Branch</label>
                <input
                  type="text"
                  className="form-control"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Purchase Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="purchaseDate"
                  value={formData.purchaseDate ? formData.purchaseDate.split('T')[0] : ''}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Purchase Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>

            <div className="mt-3">
              <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/assets')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssetForm;