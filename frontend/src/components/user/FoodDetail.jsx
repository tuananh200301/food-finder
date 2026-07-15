import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import MarkEatenModal from './MarkEatenModal';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [history, setHistory] = useState([]); // Array of history items for this user & food
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [historyRecords, setHistoryRecords] = useState({});
  const [activeRestaurantId, setActiveRestaurantId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user from localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchFoodDetails = async () => {
    try {
      const res = await api.get(`/api/foods/${id}`);
      if (res.data.success) {
        setFood(res.data.data);
      } else {
        setError('Không thể tải dữ liệu món ăn.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu.');
      console.error(err);
    }
  };

  const fetchUserHistory = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/api/history/user/${user.id}?foodId=${id}`);
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải lịch sử ăn:', err);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      await fetchFoodDetails();
      await fetchUserHistory();
      setLoading(false);
    };
    initFetch();
  }, [id]);

  const handleMarkAsEaten = async (restaurantId, e) => {
    e.stopPropagation(); // prevent navigating to restaurant details
    if (!user) {
      alert("Bạn cần đăng nhập để sử dụng chức năng này!");
      return;
    }
    setActiveRestaurantId(restaurantId);
  };

  const handleMarkEatenSubmit = async ({ note, image }) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('foodId', food.id);
      formData.append('restaurantId', activeRestaurantId);
      formData.append('note', note);
      if (image) {
        formData.append('image', image);
      }

      const res = await api.post('/api/history', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setHistoryRecords({
          ...historyRecords,
          [activeRestaurantId]: [...(historyRecords[activeRestaurantId] || []), res.data.data]
        });
        setActiveRestaurantId(null);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi lưu lịch sử.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!food) return <div style={{ padding: '2rem', textAlign: 'center' }}>Không tìm thấy món ăn.</div>;

  const restaurants = food.Restaurants || food.Restaurant || [];

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-main)' }}
      >
        ← Quay lại
      </button>

      <div style={{ display: 'flex', gap: '2rem', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '2rem', flexDirection: 'column', md: { flexDirection: 'row' } }}>
        <div style={{ flexShrink: 0, width: '200px', height: '200px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', overflow: 'hidden' }}>
          {food.image ? <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🍲'}
        </div>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)', fontSize: '2.5rem' }}>{food.name}</h1>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '1rem' }}>
            Giá tham khảo: {food.referencePrice ? `${food.referencePrice.toLocaleString()} VNĐ` : 'Đang cập nhật'}
          </p>
          {food.description && (
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{food.description}</p>
          )}
          {food.Category && food.Category.length > 0 && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {food.Category.map(cat => (
                <span key={cat.id} style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Các quán phục vụ món này</h2>
      
      {restaurants.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {restaurants.map(restaurant => {
            const price = restaurant.RestaurantFood?.price; // From join table
            // Check history for this specific restaurant
            const restaurantHistories = history.filter(h => h.restaurantId === restaurant.id);
            const hasEaten = restaurantHistories.length > 0;

            return (
              <div 
                key={restaurant.id} 
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{restaurant.name}</h3>
                  <button 
                    onClick={(e) => handleMarkAsEaten(restaurant.id, e)}
                    style={{
                      background: hasEaten ? '#10b981' : '#f1f5f9',
                      color: hasEaten ? 'white' : 'var(--text-main)',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {hasEaten ? '✅ Đã ăn' : 'Đánh dấu Đã ăn'}
                  </button>
                </div>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>📍 {restaurant.address}, {restaurant.area}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>⏰ {restaurant.openTime} - {restaurant.closeTime}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {price ? `${price.toLocaleString()} VNĐ` : 'Theo giá thực đơn'}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: restaurant.status === 'open' ? 'green' : 'red' }}>
                    {restaurant.status === 'open' ? 'Đang mở cửa' : 'Đóng cửa'}
                  </span>
                </div>

                {hasEaten && (
                  <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed #cbd5e1' }}>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.3rem 0' }}>Lịch sử của bạn:</p>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569' }}>
                      {restaurantHistories.slice(0, 3).map(h => (
                        <li key={h.id}>{new Date(h.createdAt).toLocaleString('vi-VN')}</li>
                      ))}
                      {restaurantHistories.length > 3 && (
                        <li>... và {restaurantHistories.length - 3} lần khác</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '3rem', background: 'white', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
          <h3 style={{ color: 'var(--text-muted)' }}>Chưa có quán ăn nào phục vụ món này.</h3>
        </div>
      )}

      {activeRestaurantId && (
        <MarkEatenModal 
          onClose={() => setActiveRestaurantId(null)}
          onSubmit={handleMarkEatenSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default FoodDetail;
