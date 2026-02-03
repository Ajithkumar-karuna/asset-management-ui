// frontend/src/pages/EmployeeList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService } from '../services/api';
import DataTable from 'react-data-table-component';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, [filterStatus]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAll({ status: filterStatus });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const columns = [
    {
      name: 'Employee ID',
      selector: row => row.employeeId,
      sortable: true,
    },
    {
      name: 'Name',
      selector: row => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Department',
      selector: row => row.department,
      sortable: true,
    },
    {
      name: 'Branch',
      selector: row => row.branch,
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
          <Link to={`/employees/edit/${row.id}`} className="btn btn-sm btn-primary me-2">
            Edit
          </Link>
          <button onClick={() => handleDelete(row.id)} className="btn btn-sm btn-danger">
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employees</h2>
        <Link to="/employees/new" className="btn btn-primary">Add New Employee</Link>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search employees..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredEmployees}
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

export default EmployeeList;