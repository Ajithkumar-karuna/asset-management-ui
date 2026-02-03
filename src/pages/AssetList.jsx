// frontend/src/pages/AssetList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assetService, categoryService } from '../services/api';
import DataTable from 'react-data-table-component';

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchAssets();
  }, [filterStatus, filterCategory]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll({ status: 'active' });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await assetService.getAll({
        status: filterStatus !== 'scrapped' ? filterStatus : undefined,
        categoryId: filterCategory
      });
      
      // Filter scrapped assets unless explicitly requested
      const filteredData = filterStatus === 'scrapped' 
        ? response.data.filter(a => a.status === 'scrapped')
        : response.data.filter(a => a.status !== 'scrapped');
      
      setAssets(filteredData);
    } catch (error) {
      console.error('Error fetching assets:', error);
      alert('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: 'Asset ID',
      selector: row => row.assetId,
      sortable: true,
    },
    {
      name: 'Serial Number',
      selector: row => row.serialNumber,
      sortable: true,
    },
    {
      name: 'Category',
      selector: row => row.category?.name,
      sortable: true,
    },
    {
      name: 'Make/Model',
      selector: row => `${row.make || ''} ${row.model || ''}`,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => {
        const statusColors = {
          available: 'success',
          assigned: 'primary',
          repair: 'warning',
          scrapped: 'dark'
        };
        return (
          <span className={`badge bg-${statusColors[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      name: 'Assigned To',
      selector: row => row.assignedEmployee ? `${row.assignedEmployee.firstName} ${row.assignedEmployee.lastName}` : '-',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <Link to={`/assets/edit/${row.id}`} className="btn btn-sm btn-primary me-2">
            Edit
          </Link>
          <Link to={`/assets/${row.id}/history`} className="btn btn-sm btn-info">
            History
          </Link>
        </div>
      ),
    },
  ];

  const filteredAssets = assets.filter(asset =>
    asset.assetId.toLowerCase().includes(searchText.toLowerCase()) ||
    asset.serialNumber.toLowerCase().includes(searchText.toLowerCase()) ||
    (asset.make && asset.make.toLowerCase().includes(searchText.toLowerCase())) ||
    (asset.model && asset.model.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Assets</h2>
        <Link to="/assets/new" className="btn btn-primary">Add New Asset</Link>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search assets..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="repair">Repair</option>
                <option value="scrapped">Scrapped</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredAssets}
            pagination
            highlightOnHover
            responsive
            progressPending={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default AssetList;