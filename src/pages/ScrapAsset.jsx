
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetService } from '../services/api';

function ScrapAsset() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    assetId: '',
    reason: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);

  const scrapReasons = [
    'Obsolete',
    'Beyond Repair',
    'Lost',
    'Stolen',
    'Damaged',
    'End of Life',
    'Other'
  ];

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await assetService.getAll();
      // Filter out already scrapped assets
      const filteredAssets = response.data.filter(a => a.status !== 'scrapped');
      setAssets(filteredAssets);
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
    
    if (!window.confirm('Are you sure you want to scrap this asset? This action will mark the asset as obsolete and it will not appear in regular views.')) {
      return;
    }

    setLoading(true);

    try {
      await assetService.scrap(formData);
      alert('Asset scrapped successfully!');
      navigate('/assets');
    } catch (error) {
      console.error('Error scrapping asset:', error);
      alert('Failed to scrap asset');
    } finally {
      setLoading(false);
    }
  };

  const selectedAsset = assets.find(a => a.id === parseInt(formData.assetId));

  return (
    <div>
      <h2>Scrap Asset</h2>

      <div className="alert alert-warning" role="alert">
        <strong>Warning:</strong> Scrapping an asset will mark it as obsolete. Scrapped assets will not appear in regular asset lists and can only be viewed in reports.
      </div>

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
                    <option value="">Choose an asset to scrap...</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.assetId} - {asset.category?.name} - {asset.make} {asset.model} (Status: {asset.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Scrap Reason *</label>
                  <select
                    className="form-select"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a reason...</option>
                    {scrapReasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Remarks *</label>
                  <textarea
                    className="form-control"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Provide detailed information about why this asset is being scrapped..."
                    required
                  />
                </div>

                <button type="submit" className="btn btn-danger me-2" disabled={loading}>
                  {loading ? 'Scrapping...' : 'Scrap Asset'}
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
            <div className="card border-danger">
              <div className="card-header bg-danger text-white">
                Asset to be Scrapped
              </div>
              <div className="card-body">
                <p><strong>Asset ID:</strong> {selectedAsset.assetId}</p>
                <p><strong>Serial Number:</strong> {selectedAsset.serialNumber}</p>
                <p><strong>Category:</strong> {selectedAsset.category?.name}</p>
                <p><strong>Make/Model:</strong> {selectedAsset.make} {selectedAsset.model}</p>
                <p><strong>Current Status:</strong> <span className="badge bg-secondary">{selectedAsset.status}</span></p>
                <p><strong>Purchase Price:</strong> ₹{selectedAsset.purchasePrice}</p>
                <p><strong>Purchase Date:</strong> {selectedAsset.purchaseDate ? new Date(selectedAsset.purchaseDate).toLocaleDateString() : 'N/A'}</p>
                
                {selectedAsset.assignedEmployee && (
                  <>
                    <hr />
                    <p className="text-danger"><strong>Note:</strong> This asset is currently assigned to {selectedAsset.assignedEmployee.firstName} {selectedAsset.assignedEmployee.lastName}. Scrapping will automatically return it.</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScrapAsset;