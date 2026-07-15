import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordModal = ({ user, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/users/${user.id}/reset-password`, {
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccess('Đặt lại mật khẩu thành công!');
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Đặt Lại Mật Khẩu</h3>
        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Tài khoản: <strong style={{ color: 'var(--text-main)' }}>{user.name} ({user.email})</strong>
        </p>
        
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Mật khẩu mới</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="action-buttons" style={{ marginTop: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-cancel" onClick={onClose}>Huỷ</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
