import React, { useState } from 'react';
import api from '../../../services/api';

const RestaurantFormModal = ({ restaurant, onClose, onSuccess }) => {
  const isEdit = !!restaurant;
  const [formData, setFormData] = useState({
    name: restaurant ? restaurant.name : '',
    address: restaurant ? restaurant.address : '',
    area: restaurant ? restaurant.area : '',
    hotline: restaurant ? restaurant.hotline : '',
    openTime: restaurant ? restaurant.openTime : '08:00',
    closeTime: restaurant ? restaurant.closeTime : '22:00',
    image: restaurant ? restaurant.image : '',
    hasSeating: restaurant ? restaurant.hasSeating : true,
    hasDelivery: restaurant ? restaurant.hasDelivery : true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Tên và địa chỉ không được để trống');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let res;
      if (isEdit) {
        res = await api.put(`/api/restaurants/${restaurant.id}`, formData);
      } else {
        res = await api.post('/api/restaurants', formData);
      }
      
      if (res.data.success) {
        onSuccess(res.data.data, isEdit);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu quán ăn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {isEdit ? 'Chỉnh sửa Quán ăn' : 'Thêm Quán ăn Mới'}
        </h3>
        
        {error && <div className="error-text">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Tên quán *</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Ví dụ: Phở Lý Quốc Sư" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Địa chỉ *</label>
            <input 
              type="text" 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              placeholder="Số nhà, đường, phường..." 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Khu vực</label>
              <input 
                type="text" 
                value={formData.area} 
                onChange={e => setFormData({...formData, area: e.target.value})} 
                placeholder="VD: Quận 1" 
              />
            </div>
            <div className="input-group">
              <label>Hotline</label>
              <input 
                type="text" 
                value={formData.hotline} 
                onChange={e => setFormData({...formData, hotline: e.target.value})} 
                placeholder="09..." 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Giờ mở cửa</label>
              <input 
                type="time" 
                value={formData.openTime} 
                onChange={e => setFormData({...formData, openTime: e.target.value})} 
              />
            </div>
            <div className="input-group">
              <label>Giờ đóng cửa</label>
              <input 
                type="time" 
                value={formData.closeTime} 
                onChange={e => setFormData({...formData, closeTime: e.target.value})} 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Hình ảnh (URL)</label>
            <input 
              type="text" 
              value={formData.image} 
              onChange={e => setFormData({...formData, image: e.target.value})} 
              placeholder="https://..." 
            />
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="hasSeating"
                checked={formData.hasSeating}
                onChange={e => setFormData({...formData, hasSeating: e.target.checked})}
              />
              <label htmlFor="hasSeating" style={{ fontWeight: 'normal' }}>Có chỗ ngồi</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="hasDelivery"
                checked={formData.hasDelivery}
                onChange={e => setFormData({...formData, hasDelivery: e.target.checked})}
              />
              <label htmlFor="hasDelivery" style={{ fontWeight: 'normal' }}>Có giao hàng</label>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              type="submit" 
              className="btn-primary-auth" 
              disabled={loading}
              style={{ flex: 1, padding: '0.8rem' }}
            >
              {loading ? 'Đang lưu...' : 'Lưu Quán ăn'}
            </button>
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantFormModal;
