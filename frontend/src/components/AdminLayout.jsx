import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import UserManagement from './UserManagement';
import ChangePasswordModal from './ChangePasswordModal';
import DashboardStats from './admin/dashboard/DashboardStats';
import CategoryManagement from './admin/categories/CategoryManagement';
import FoodManagement from './admin/foods/FoodManagement';
import RestaurantManagement from './admin/restaurants/RestaurantManagement';
import HistoryManagement from './admin/history/HistoryManagement';

const AdminLayout = ({ user, handleLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === '/users' || location.pathname === '/admins') {
      setIsMenuOpen(true);
    }
  }, [location.pathname]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/users': return 'Quản lý User';
      case '/admins': return 'Quản lý Admin';
      case '/categories': return 'Quản lý Danh mục';
      case '/foods': return 'Quản lý Món ăn';
      case '/restaurants': return 'Quản lý Quán ăn';
      case '/history': return 'Lịch sử ăn uống';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      
      <aside className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="sidebar-brand">
          <h2>Admin<span className="brand-highlight">Pro</span></h2>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/" onClick={() => setIsSidebarOpen(false)} className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>

          <Link to="/categories" onClick={() => setIsSidebarOpen(false)} className={`nav-item ${location.pathname === '/categories' ? 'active' : ''}`}>
            <span className="nav-icon">📁</span>
            QL Danh mục
          </Link>

          <Link to="/foods" onClick={() => setIsSidebarOpen(false)} className={`nav-item ${location.pathname === '/foods' ? 'active' : ''}`}>
            <span className="nav-icon">🍔</span>
            QL Món ăn
          </Link>

          <Link to="/restaurants" onClick={() => setIsSidebarOpen(false)} className={`nav-item ${location.pathname === '/restaurants' ? 'active' : ''}`}>
            <span className="nav-icon">🏪</span>
            QL Quán ăn
          </Link>

          <Link to="/history" onClick={() => setIsSidebarOpen(false)} className={`nav-item ${location.pathname === '/history' ? 'active' : ''}`}>
            <span className="nav-icon">🕒</span>
            Lịch sử ăn uống
          </Link>
          
          <div className="nav-group">
            <div 
              className={`nav-item ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ cursor: 'pointer' }}
            >
              <span className="nav-icon">👥</span>
              Hệ thống User
              <span className="nav-arrow">{isMenuOpen ? '▲' : '▼'}</span>
            </div>
            
            {isMenuOpen && (
              <div className="sub-menu">
                <Link to="/admins" onClick={() => setIsSidebarOpen(false)} className={`sub-nav-item ${location.pathname === '/admins' ? 'active' : ''}`}>
                  Quản lý Admin
                </Link>
                <Link to="/users" onClick={() => setIsSidebarOpen(false)} className={`sub-nav-item ${location.pathname === '/users' ? 'active' : ''}`}>
                  Quản lý User
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="current-user-info">
            <img src={user.avatar} alt="Avatar" className="sidebar-avatar" />
            <div className="user-text">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
          <button className="btn-logout-sidebar" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button 
              className="hamburger-btn" 
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            <h2>{getPageTitle()}</h2>
          </div>
          <div className="topbar-right">
            <span className="welcome-text">Xin chào, {user.name}!</span>
          </div>
        </header>
        
        <div className="content-area">
          <Routes>
            <Route path="/" element={<DashboardStats />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/foods" element={<FoodManagement />} />
            <Route path="/restaurants" element={<RestaurantManagement />} />
            <Route path="/history" element={<HistoryManagement />} />
            <Route path="/admins" element={<UserManagement user={user} type="admin" />} />
            <Route path="/users" element={<UserManagement user={user} type="user" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
