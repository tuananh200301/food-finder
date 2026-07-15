import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantMenuModal = ({ restaurant, onClose }) => {
  const [menu, setMenu] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [price, setPrice] = useState('');

  const fetchMenuAndFoods = async () => {
    try {
      const [resRest, resFoods] = await Promise.all([
        axios.get(`/api/restaurants/${restaurant.id}`),
        axios.get('/api/foods')
      ]);
      
      if (resRest.data.success) {
        setMenu(resRest.data.data.Food || []); // Sequelize join gives .Food array
      }
      if (resFoods.data.success) {
        setAllFoods(resFoods.data.data);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải dữ liệu thực đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuAndFoods();
  }, [restaurant.id]);

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (!selectedFoodId || !price) return alert('Vui lòng chọn món và nhập giá');
    
    try {
      const res = await axios.post(`/api/restaurants/${restaurant.id}/menu`, {
        foodId: selectedFoodId,
        price: parseInt(price)
      });
      if (res.data.success) {
        fetchMenuAndFoods(); // Tải lại để lấy thông tin mới nhất
        setSelectedFoodId('');
        setPrice('');
      }
    } catch (err) {
      alert('Lỗi thêm món vào thực đơn');
    }
  };

  const handleRemoveFood = async (foodId) => {
    if (!window.confirm('Xóa món này khỏi thực đơn của quán?')) return;
    try {
      await axios.delete(`/api/restaurants/${restaurant.id}/menu/${foodId}`);
      fetchMenuAndFoods();
    } catch (err) {
      alert('Lỗi xóa món khỏi thực đơn');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Quản lý Thực đơn: {restaurant.name}
        </h3>
        
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <>
            <form onSubmit={handleAddFood} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div className="input-group" style={{ marginBottom: 0, flex: 2 }}>
                <label>Chọn món ăn từ hệ thống</label>
                <select 
                  value={selectedFoodId} 
                  onChange={e => setSelectedFoodId(e.target.value)}
                  style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', width: '100%', background: 'white' }}
                >
                  <option value="">-- Chọn món --</option>
                  {allFoods.map(f => (
                    <option key={f.id} value={f.id}>{f.name} (Gợi ý: {f.referencePrice ? f.referencePrice.toLocaleString() + 'đ' : 'Chưa có'})</option>
                  ))}
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>Giá bán tại quán (VNĐ)</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  placeholder="VD: 50000" 
                />
              </div>
              <button type="submit" className="btn-primary-auth" style={{ margin: 0, padding: '0.8rem 1.5rem' }}>+ Thêm vào Menu</button>
            </form>

            <table className="users-table">
              <thead>
                <tr>
                  <th>Tên món ăn</th>
                  <th>Giá bán tại quán</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {menu.map(f => (
                  <tr key={f.id}>
                    <td>
                      <div className="user-info">
                        {f.image ? (
                          <img src={f.image} alt={f.name} className="user-avatar-small" style={{ borderRadius: '8px' }} />
                        ) : (
                          <div className="user-avatar-small" style={{ borderRadius: '8px', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍲</div>
                        )}
                        <div className="user-name">{f.name}</div>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--primary-color)' }}>
                        {f.RestaurantFood?.price ? f.RestaurantFood.price.toLocaleString() + 'đ' : '-'}
                      </strong>
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => handleRemoveFood(f.id)}>Xóa khỏi menu</button>
                    </td>
                  </tr>
                ))}
                {menu.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">Quán này chưa có món ăn nào trong thực đơn</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <button className="btn-cancel" onClick={onClose} style={{ padding: '0.8rem 2rem', fontWeight: 'bold' }}>Đóng</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenuModal;
