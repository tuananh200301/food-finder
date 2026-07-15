import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateAdminModal from './CreateAdminModal';
import ResetPasswordModal from './ResetPasswordModal';

const UserManagement = ({ user: currentUser, type }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editingUserId, setEditingUserId] = useState(null);
  const [editRole, setEditRole] = useState('');
  
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        // Lọc dựa vào type (admin/user)
        const filtered = response.data.users.filter(u => u.role === type);
        setUsers(filtered);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [type]);

  const handleEditClick = (u) => {
    setEditingUserId(u.id);
    setEditRole(u.role);
  };

  const handleSaveRole = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${id}`, { role: editRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Nếu đổi role khiến user không thuộc type hiện tại nữa thì xoá khỏi danh sách
      if (editRole !== type) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        setUsers(users.map(u => u.id === id ? { ...u, role: editRole } : u));
      }
      setEditingUserId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật vai trò');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá người dùng này?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xoá người dùng');
    }
  };

  const handleAdminCreated = (newAdmin) => {
    setUsers([...users, newAdmin]);
    setShowCreateAdmin(false);
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error-alert">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Quản lý {type === 'admin' ? 'Admin' : 'User'}</h2>
          <p>Danh sách các tài khoản có quyền {type}</p>
        </div>
        {type === 'admin' && (
          <button className="btn-primary-auth" style={{ margin: 0, padding: '0.8rem 1.2rem' }} onClick={() => setShowCreateAdmin(true)}>
            + Tạo Admin Mới
          </button>
        )}
      </div>
      
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Người dùng</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td>
                  <div className="user-info">
                    <img src={u.avatar} alt={u.name} className="user-avatar-small" />
                    <div>
                      <div className="user-name">{u.name}</div>
                      <div className="user-email">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {editingUserId === u.id ? (
                    <select 
                      value={editRole} 
                      onChange={(e) => setEditRole(e.target.value)}
                      className="role-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`role-badge role-${u.role}`}>{u.role}</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingUserId === u.id ? (
                      <>
                        <button className="btn-save" onClick={() => handleSaveRole(u.id)}>Lưu</button>
                        <button className="btn-cancel" onClick={() => setEditingUserId(null)}>Hủy</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-edit" onClick={() => handleEditClick(u)}>Sửa</button>
                        <button className="btn-edit" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }} onClick={() => setResetPasswordUser(u)}>Đổi MK</button>
                        {u.id !== currentUser.id && (
                          <button className="btn-delete" onClick={() => handleDelete(u.id)}>Xoá</button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreateAdmin && <CreateAdminModal onClose={() => setShowCreateAdmin(false)} onSuccess={handleAdminCreated} />}
      {resetPasswordUser && <ResetPasswordModal user={resetPasswordUser} onClose={() => setResetPasswordUser(null)} />}
    </div>
  );
};

export default UserManagement;
