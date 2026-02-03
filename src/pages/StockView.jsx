// frontend/src/pages/StockView.js
import React, { useState, useEffect } from 'react';
import { assetService } from '../services/api';
import DataTable from 'react-data-table-component';

function StockView() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalAssets: 0, totalValue: 0 });

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await assetService.getAll({ status: 'available' });
      const availableAssets = response.data;
      
      setAssets(availableAssets);
      
      // Calculate summary
      const totalAssets = availableAssets.length;
      const totalValue = availableAssets.reduce((sum, asset) => 
        sum + parseFloat(asset.purchasePrice || 0), 0
      );
      
      setSummary({ totalAssets, totalValue });
    } catch (error) {
      console.error('Error fetching stock data:', error);
      alert('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  // Group assets by branch
  const groupByBranch = () => {
    const grouped = {};
    assets.forEach(asset => {
      const branch = asset.branch || 'Unassigned';
      if (!grouped[branch]) {
        grouped[branch] = {
          branch,
          assets: [],
          count: 0,
          totalValue: 0
        };
      }
      grouped[branch].assets.push(asset);
      grouped[branch].count++;
      grouped[branch].totalValue += parseFloat(asset.purchasePrice || 0);
    });
    return Object.values(grouped);
  };

  const branchData = groupByBranch();

  const columns = [
    {
      name: 'Branch',
      selector: row => row.branch,
      sortable: true,
      width: '200px'
    },
    {
      name: 'Total Assets',
      selector: row => row.count,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Total Value',
      selector: row => `₹${row.totalValue.toFixed(2)}`,
      sortable: true,
      width: '200px'
    },
    {
      name: 'Details',
      cell: row => (
        <button 
          className="btn btn-sm btn-info"
          onClick={() => alert(`Assets in ${row.branch}: ${row.assets.map(a => a.assetId).join(', ')}`)}
        >
          View Assets
        </button>
      ),
    },
  ];

  return (
    <div>
      <h2>Stock View - Available Assets</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Assets in Stock</h5>
              <h2>{summary.totalAssets}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Total Stock Value</h5>
              <h2>₹{summary.totalValue.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Assets by Branch</h5>
          <DataTable
            columns={columns}
            data={branchData}
            pagination
            highlightOnHover
            responsive
            progressPending={loading}
          />
          
          <div className="mt-3 p-3 bg-light">
            <div className="row">
              <div className="col-md-6">
                <strong>Total Assets:</strong> {summary.totalAssets}
              </div>
              <div className="col-md-6 text-end">
                <strong>Grand Total Value:</strong> ₹{summary.totalValue.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockView;