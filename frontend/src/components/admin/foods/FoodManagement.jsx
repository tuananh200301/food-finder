import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import FoodFormModal from './FoodFormModal';

const FoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const fetchFoods = async () => {
    try {
      const res = await api.get('/api/foods');
      if (res.data.success) {
        setFoods(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách món ăn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleOpenCreate = () => {
    setEditingFood(null);
    setShowModal(true);
  };

  const handleOpenEdit = (food) => {
    setEditingFood(food);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFood(null);
  };

  const handleSuccess = (foodData, isEdit) => {
    if (isEdit) {
      setFoods(foods.map(f => f.id === foodData.id ? foodData : f));
    } else {
      setFoods([...foods, foodData]);
    }
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa món ăn này?')) return;
    try {
      await api.delete(`/api/foods/${id}`);
      setFoods(foods.filter(f => f.id !== id));
    } catch (err) {
      alert('Lỗi xóa món ăn');
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Quản lý Món ăn</h2>
          <p>Thêm, sửa, xóa các món ăn trong hệ thống</p>
        </div>
        <button className="btn-primary-auth" style={{ margin: 0, padding: '0.8rem 1.2rem' }} onClick={handleOpenCreate}>
          + Thêm Món ăn
        </button>
      </div>

      {showModal && (
        <FoodFormModal 
          food={editingFood}
          onClose={handleCloseModal} 
          onSuccess={handleSuccess} 
        />
      )}

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Món ăn</th>
              <th>Giá tham khảo</th>
              <th>Danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {foods.map(f => (
              <tr key={f.id}>
                <td>#{f.id}</td>
                <td>
                  <div className="user-info">
                    {f.image ? (
                      <img src={f.image} alt={f.name} className="user-avatar-small" style={{ borderRadius: '8px' }} />
                    ) : (
                      <div className="user-avatar-small" style={{ borderRadius: '8px', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍲</div>
                    )}
                    <div>
                      <div className="user-name">{f.name}</div>
                      <div className="user-email" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {f.description || 'Không có mô tả'}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {f.referencePrice ? `${f.referencePrice.toLocaleString()}đ` : '-'}
                </td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {f.Categories && f.Categories.map(cat => (
                      <span key={cat.id} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleOpenEdit(f)}>Sửa</button>
                    <button className="btn-delete" onClick={() => handleDelete(f.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {foods.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">Chưa có món ăn nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodManagement;
