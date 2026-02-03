// frontend/src/pages/EmployeeForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeeService } from '../services/api';

function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    branch: '',
    status: 'active',
    joiningDate: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await employeeService.getById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
      alert('Failed to fetch employee details');
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
        await employeeService.update(id, formData);
      } else {
        await employeeService.create(formData);
      }
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Employee ID *</label>
                <input
                  type="text"
                  className="form-control"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  disabled={isEdit}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  className="form-control"
                  name="designation"
                  value={formData.designation}
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
                <label className="form-label">Joining Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="joiningDate"
                  value={formData.joiningDate ? formData.joiningDate.split('T')[0] : ''}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/employees')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployeeForm;