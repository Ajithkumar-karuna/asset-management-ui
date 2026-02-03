
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetService } from '../services/api';

function ReturnAsset() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    assetId: '',
    reason: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);

  const returnReasons = [
    'Upgrade',
    'Repair',
    'Resignation',
    'Transfer',
    'No Longer Needed',
    'Other'
  ];

  useEffect(() => {
    fetchAssignedAssets();
  }, []);

  const fetchAssignedAssets = async () => {
    try {
      const response = await assetService.getAll({ status: 'assigned' });
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
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
      await assetService.return(formData);
      alert('Asset returned successfully!');
      navigate('/assets');
    } catch (error) {
      console.error('Error returning asset:', error);
      alert('Failed to return asset');
    } finally {
      setLoading(false);
    }
  };

  const selectedAsset = assets.find(a => a.id === parseInt(formData.assetId));

  return (
    <div>
      <h2>Return Asset</h2>

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
                    <option value="">Choose an assigned asset...</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.assetId} - {asset.category?.name} - Assigned to: {asset.assignedEmployee?.firstName} {asset.assignedEmployee?.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Return Reason *</label>
                  <select
                    className="form-select"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a reason...</option>
                    {returnReasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
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

                <button type="submit" className="btn btn-warning me-2" disabled={loading}>
                  {loading ? 'Returning...' : 'Return Asset'}
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
            <div className="card">
              <div className="card-header bg-warning">
                Asset & Employee Details
              </div>
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">Asset Information</h6>
                <p><strong>Asset ID:</strong> {selectedAsset.assetId}</p>
                <p><strong>Serial Number:</strong> {selectedAsset.serialNumber}</p>
                <p><strong>Category:</strong> {selectedAsset.category?.name}</p>
                <p><strong>Make/Model:</strong> {selectedAsset.make} {selectedAsset.model}</p>
                
                <hr />
                
                <h6 className="card-subtitle mb-2 text-muted">Current Assignee</h6>
                <p><strong>Name:</strong> {selectedAsset.assignedEmployee?.firstName} {selectedAsset.assignedEmployee?.lastName}</p>
                <p><strong>Employee ID:</strong> {selectedAsset.assignedEmployee?.employeeId}</p>
                <p><strong>Department:</strong> {selectedAsset.assignedEmployee?.department}</p>
                <p><strong>Assigned Date:</strong> {selectedAsset.assignedDate ? new Date(selectedAsset.assignedDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReturnAsset;