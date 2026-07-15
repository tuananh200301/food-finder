import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import CreateCategoryModal from './CategoryFormModal';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingCategory, setEditingCategory] = useState(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySaved = (savedCategory, isEdit) => {
    if (isEdit) {
      setCategories(categories.map(c => c.id === savedCategory.id ? savedCategory : c));
      setEditingCategory(null);
    } else {
      setCategories([...categories, savedCategory]);
      setShowCreateModal(false);
    }
  };

  const handleEditClick = (c) => {
    setEditingCategory(c);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return;
    try {
      await api.delete(`/api/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert('Lỗi xóa danh mục');
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Quản lý Danh mục</h2>
          <p>Thêm, sửa, xóa các nhóm món ăn</p>
        </div>
        <button className="btn-primary-auth" style={{ margin: 0, padding: '0.8rem 1.2rem' }} onClick={() => setShowCreateModal(true)}>
          + Thêm Danh mục
        </button>
      </div>

      {showCreateModal && (
        <CreateCategoryModal 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={handleCategorySaved} 
        />
      )}

      {editingCategory && (
        <CreateCategoryModal 
          category={editingCategory}
          onClose={() => setEditingCategory(null)} 
          onSuccess={handleCategorySaved} 
        />
      )}

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên Danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td>
                  <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.image ? <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📁'}
                  </div>
                </td>
                <td>
                  <strong>{c.name}</strong>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEditClick(c)}>Sửa</button>
                    <button className="btn-delete" onClick={() => handleDelete(c.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">Chưa có danh mục nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;
