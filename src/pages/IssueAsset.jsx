// frontend/src/pages/IssueAsset.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetService, employeeService } from '../services/api';

function IssueAsset() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    assetId: '',
    employeeId: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableAssets();
    fetchActiveEmployees();
  }, []);

  const fetchAvailableAssets = async () => {
    try {
      const response = await assetService.getAll({ status: 'available' });
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchActiveEmployees = async () => {
    try {
      const response = await employeeService.getAll({ status: 'active' });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
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
      await assetService.issue(formData);
      alert('Asset issued successfully!');
      navigate('/assets');
    } catch (error) {
      console.error('Error issuing asset:', error);
      alert('Failed to issue asset');
    } finally {
      setLoading(false);
    }
  };

  const selectedAsset = assets.find(a => a.id === parseInt(formData.assetId));
  const selectedEmployee = employees.find(e => e.id === parseInt(formData.employeeId));

  return (
    <div>
      <h2>Issue Asset</h2>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Select Asset *</label>
                  <select
                    className="form-select"
                    name="assetId"
                    value={formData.assetId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose an asset...</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.assetId} - {asset.category?.name} ({asset.make} {asset.model})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Employee *</label>
                  <select
                    className="form-select"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose an employee...</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.employeeId} - {emp.firstName} {emp.lastName} ({emp.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <textarea
                    className="form-control"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter any additional notes..."
                  />
                </div>

                <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                  {loading ? 'Issuing...' : 'Issue Asset'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/assets')}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {selectedAsset && (
            <div className="card mb-3">
              <div className="card-header bg-primary text-white">
                Selected Asset Details
              </div>
              <div className="card-body">
                <p><strong>Asset ID:</strong> {selectedAsset.assetId}</p>
                <p><strong>Serial Number:</strong> {selectedAsset.serialNumber}</p>
                <p><strong>Category:</strong> {selectedAsset.category?.name}</p>
                <p><strong>Make/Model:</strong> {selectedAsset.make} {selectedAsset.model}</p>
                <p><strong>Purchase Price:</strong> ₹{selectedAsset.purchasePrice}</p>
              </div>
            </div>
          )}

          {selectedEmployee && (
            <div className="card">
              <div className="card-header bg-success text-white">
                Selected Employee Details
              </div>
              <div className="card-body">
                <p><strong>Employee ID:</strong> {selectedEmployee.employeeId}</p>
                <p><strong>Name:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                <p><strong>Department:</strong> {selectedEmployee.department}</p>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IssueAsset;