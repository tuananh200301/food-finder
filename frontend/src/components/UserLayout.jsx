import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ChangePasswordModal from './ChangePasswordModal';
import Home from './user/Home';
import Randomizer from './user/Randomizer';
import FoodDetail from './user/FoodDetail';
import RestaurantDetail from './user/RestaurantDetail';
import CategoryFoods from './user/CategoryFoods';
import UserHistory from './user/UserHistory';

const UserLayout = ({ user, handleLogout }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="storefront-layout">
      {/* Top Navbar */}
      <header className="store-navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h2>Food<span className="brand-highlight">Finder</span></h2>
          </div>
          
          <nav className="nav-links">
            <Link to="/" className="nav-link active">Trang chủ</Link>
            <Link to="/random" className="nav-link" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>🎲 Hôm nay ăn gì?</Link>
            <Link to="/history" className="nav-link">Lịch sử</Link>
          </nav>

          <div className="nav-user">
            <div className="user-dropdown">
              <img src={user.avatar} alt="Avatar" className="nav-avatar" />
              <span className="nav-username">{user.name}</span>
              <div className="dropdown-content">
                <Link to="/profile">Hồ sơ cá nhân</Link>
                <a href="#" onClick={(e) => { e.preventDefault(); setShowPasswordModal(true); }}>Đổi mật khẩu</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="logout-text">Đăng xuất</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="store-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/random" element={<Randomizer />} />
          <Route path="/history" element={<UserHistory />} />
          <Route path="/category/:id" element={<CategoryFoods />} />
          <Route path="/food/:id" element={<FoodDetail />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/profile" element={
            <div className="store-home">
              <div className="profile-card" style={{ margin: '2rem auto' }}>
                <img src={user.avatar} alt="Avatar" className="avatar-large" />
                <h2>Xin chào, {user.name}!</h2>
                <p>{user.email}</p>
                <div className="role-badge role-user" style={{ marginBottom: '1.5rem' }}>Khách hàng</div>
                <button className="btn-edit" onClick={() => setShowPasswordModal(true)}>Đổi mật khẩu</button>
              </div>
            </div>
          } />
          
          <Route path="*" element={
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <h2>Tính năng đang phát triển</h2>
              <p>Vui lòng quay lại sau!</p>
            </div>
          } />
        </Routes>
      </main>

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  );
};

export default UserLayout;
