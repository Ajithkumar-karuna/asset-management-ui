import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'
import './App.css';

import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import AssetList from './pages/AssetList';
import AssetForm from './pages/AssetForm';
import CategoryList from './pages/CategoryList';
import StockView from './pages/StockView';
import IssueAsset from './pages/IssueAsset';
import ReturnAsset from './pages/ReturnAsset';
import ScrapAsset from './pages/ScrapAsset';
import AssetHistory from './pages/AssetHistory';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Asset Management</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="employeeDropdown" role="button" data-bs-toggle="dropdown">
                    Employees
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/employees">View All</Link></li>
                    <li><Link className="dropdown-item" to="/employees/new">Add New</Link></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="assetDropdown" role="button" data-bs-toggle="dropdown">
                    Assets
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/assets">View All</Link></li>
                    <li><Link className="dropdown-item" to="/assets/new">Add New</Link></li>
                    <li><Link className="dropdown-item" to="/stock">Stock View</Link></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/categories">Categories</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="transactionDropdown" role="button" data-bs-toggle="dropdown">
                    Transactions
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/issue">Issue Asset</Link></li>
                    <li><Link className="dropdown-item" to="/return">Return Asset</Link></li>
                    <li><Link className="dropdown-item" to="/scrap">Scrap Asset</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container-fluid mt-4">
          <Routes>
            <Route path="/" element={<StockView />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/edit/:id" element={<EmployeeForm />} />
            <Route path="/assets" element={<AssetList />} />
            <Route path="/assets/new" element={<AssetForm />} />
            <Route path="/assets/edit/:id" element={<AssetForm />} />
            <Route path="/assets/:id/history" element={<AssetHistory />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/stock" element={<StockView />} />
            <Route path="/issue" element={<IssueAsset />} />
            <Route path="/return" element={<ReturnAsset />} />
            <Route path="/scrap" element={<ScrapAsset />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;