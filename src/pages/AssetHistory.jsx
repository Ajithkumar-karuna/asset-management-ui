// frontend/src/pages/AssetHistory.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assetService } from '../services/api';

function AssetHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssetHistory();
  }, [id]);

  const fetchAssetHistory = async () => {
    try {
      setLoading(true);
      const response = await assetService.getHistory(id);
      setAsset(response.data.asset);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching asset history:', error);
      alert('Failed to fetch asset history');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionBadgeColor = (type) => {
    const colors = {
      issue: 'primary',
      return: 'warning',
      scrap: 'danger'
    };
    return colors[type] || 'secondary';
  };

  const calculateUtilization = () => {
    if (!asset || !asset.purchaseDate) return null;

    const purchaseDate = new Date(asset.purchaseDate);
    const today = new Date();
    const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
    
    const issueDays = transactions
      .filter(t => t.type === 'issue')
      .reduce((total, transaction, index) => {
        const issueDate = new Date(transaction.transactionDate);
        const returnTransaction = transactions.find((t, i) => 
          i > index && t.type === 'return' && new Date(t.transactionDate) > issueDate
        );
        
        const endDate = returnTransaction ? new Date(returnTransaction.transactionDate) : today;
        return total + Math.floor((endDate - issueDate) / (1000 * 60 * 60 * 24));
      }, 0);

    const utilizationRate = daysSincePurchase > 0 ? (issueDays / daysSincePurchase * 100).toFixed(2) : 0;
    
    return {
      daysSincePurchase,
      issueDays,
      utilizationRate
    };
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (!asset) {
    return <div className="alert alert-danger">Asset not found</div>;
  }

  const utilization = calculateUtilization();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Asset History</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/assets')}>
          Back to Assets
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              Asset Details
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <p><strong>Asset ID:</strong> {asset.assetId}</p>
                  <p><strong>Serial Number:</strong> {asset.serialNumber}</p>
                  <p><strong>Category:</strong> {asset.category?.name}</p>
                  <p><strong>Make:</strong> {asset.make}</p>
                </div>
                <div className="col-6">
                  <p><strong>Model:</strong> {asset.model}</p>
                  <p><strong>Purchase Price:</strong> ₹{asset.purchasePrice}</p>
                  <p><strong>Purchase Date:</strong> {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Current Status:</strong> <span className={`badge bg-${asset.status === 'available' ? 'success' : asset.status === 'assigned' ? 'primary' : 'danger'}`}>{asset.status}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              Utilization Statistics
            </div>
            <div className="card-body">
              {utilization ? (
                <>
                  <p><strong>Days Since Purchase:</strong> {utilization.daysSincePurchase} days</p>
                  <p><strong>Days Issued to Employees:</strong> {utilization.issueDays} days</p>
                  <p><strong>Utilization Rate:</strong> {utilization.utilizationRate}%</p>
                  <div className="progress" style={{ height: '25px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${utilization.utilizationRate}%` }}
                      aria-valuenow={utilization.utilizationRate} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {utilization.utilizationRate}%
                    </div>
                  </div>
                </>
              ) : (
                <p>No purchase date available for utilization calculation</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Transaction History</h5>
        </div>
        <div className="card-body">
          {transactions.length === 0 ? (
            <p className="text-muted">No transactions recorded for this asset.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Employee</th>
                    <th>Reason</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{new Date(transaction.transactionDate).toLocaleString()}</td>
                      <td>
                        <span className={`badge bg-${getTransactionBadgeColor(transaction.type)}`}>
                          {transaction.type.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {transaction.employee ? 
                          `${transaction.employee.firstName} ${transaction.employee.lastName} (${transaction.employee.employeeId})` 
                          : 'N/A'}
                      </td>
                      <td>{transaction.reason || '-'}</td>
                      <td>{transaction.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssetHistory;