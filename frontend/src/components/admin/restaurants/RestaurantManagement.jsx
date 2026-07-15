import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import RestaurantFormModal from './RestaurantFormModal';
import RestaurantMenuModal from './RestaurantMenuModal';

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuRestaurant, setMenuRestaurant] = useState(null);

  const fetchRestaurants = async () => {
    try {
      const res = await api.get('/api/restaurants');
      if (res.data.success) {
        setRestaurants(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách quán ăn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleOpenCreate = () => {
    setEditingRestaurant(null);
    setShowModal(true);
  };

  const handleOpenEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRestaurant(null);
  };

  const handleOpenMenu = (restaurant) => {
    setMenuRestaurant(restaurant);
    setShowMenuModal(true);
  };

  const handleSuccess = (restaurantData, isEdit) => {
    if (isEdit) {
      setRestaurants(restaurants.map(r => r.id === restaurantData.id ? restaurantData : r));
    } else {
      setRestaurants([...restaurants, restaurantData]);
    }
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa quán ăn này? Toàn bộ thực đơn của quán cũng sẽ bị xóa theo!')) return;
    try {
      await api.delete(`/api/restaurants/${id}`);
      setRestaurants(restaurants.filter(r => r.id !== id));
    } catch (err) {
      alert('Lỗi xóa quán ăn');
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Quản lý Quán ăn</h2>
          <p>Danh sách các đối tác cửa hàng/nhà hàng</p>
        </div>
        <button className="btn-primary-auth" style={{ margin: 0, padding: '0.8rem 1.2rem' }} onClick={handleOpenCreate}>
          + Thêm Quán ăn
        </button>
      </div>

      {showModal && (
        <RestaurantFormModal 
          restaurant={editingRestaurant}
          onClose={handleCloseModal} 
          onSuccess={handleSuccess} 
        />
      )}

      {showMenuModal && (
        <RestaurantMenuModal
          restaurant={menuRestaurant}
          onClose={() => { setShowMenuModal(false); setMenuRestaurant(null); }}
        />
      )}

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Quán ăn</th>
              <th>Khu vực</th>
              <th>Giờ HĐ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map(r => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>
                  <div className="user-info">
                    {r.image ? (
                      <img src={r.image} alt={r.name} className="user-avatar-small" style={{ borderRadius: '8px' }} />
                    ) : (
                      <div className="user-avatar-small" style={{ borderRadius: '8px', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏪</div>
                    )}
                    <div>
                      <div className="user-name">{r.name}</div>
                      <div className="user-email" style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="role-badge role-user">{r.area || 'Không rõ'}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {r.openTime?.substring(0,5)} - {r.closeTime?.substring(0,5)}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary-color)' }} onClick={() => handleOpenMenu(r)}>QL Menu</button>
                    <button className="btn-edit" onClick={() => handleOpenEdit(r)}>Sửa</button>
                    <button className="btn-delete" onClick={() => handleDelete(r.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {restaurants.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">Chưa có quán ăn nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantManagement;
