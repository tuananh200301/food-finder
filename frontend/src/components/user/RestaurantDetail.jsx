import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import MarkEatenModal from './MarkEatenModal';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [historyRecords, setHistoryRecords] = useState({});
  const [activeFoodId, setActiveFoodId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      try {
        const res = await api.get(`/api/restaurants/${id}`);
        if (res.data.success) {
          setRestaurant(res.data.data);
        } else {
          setError('Không thể tải thông tin quán ăn.');
        }
      } catch (err) {
        setError('Lỗi kết nối máy chủ.');
        console.error(err);
      }
    };

    fetchRestaurantDetail();
  }, [id]);

  useEffect(() => {
    if (user && restaurant) {
      const fetchUserHistory = async () => {
        try {
          const res = await api.get(`/api/history/user/${user.id}?restaurantId=${id}`);
          if (res.data.success) {
            // Group by foodId
            const grouped = {};
            res.data.data.forEach(history => {
              const fId = history.foodId;
              if (!grouped[fId]) grouped[fId] = [];
              grouped[fId].push(history);
            });
            setHistoryRecords(grouped);
          }
        } catch (err) {
          console.error("Lỗi tải lịch sử:", err);
        }
      };
      fetchUserHistory();
    }
  }, [user, restaurant, id]);

  const handleMarkAsEaten = (foodId, e) => {
    e.stopPropagation();
    if (!user) {
      alert("Bạn cần đăng nhập để sử dụng chức năng này!");
      return;
    }
    setActiveFoodId(foodId);
  };

  const handleMarkEatenSubmit = async ({ note, image }) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('foodId', activeFoodId);
      formData.append('restaurantId', restaurant.id);
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
          [activeFoodId]: [res.data.data, ...(historyRecords[activeFoodId] || [])]
        });
        setActiveFoodId(null);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi lưu lịch sử.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !restaurant) return <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!restaurant) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Thông tin quán ăn */}
      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: '3rem 2rem', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{restaurant.name}</h1>
            <span style={{ background: restaurant.status === 'open' ? '#10b981' : '#ef4444', color: 'white', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 'bold' }}>
              {restaurant.status === 'open' ? 'Đang mở cửa' : 'Đóng cửa'}
            </span>
          </div>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', opacity: 0.9 }}>📍 {restaurant.address}, {restaurant.area}</p>
          <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>⏰ Giờ mở cửa: {restaurant.openTime} - {restaurant.closeTime}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: 0 }}>Thực đơn của quán</h2>
        <button onClick={() => navigate(-1)} style={{ padding: '0.6rem 1.2rem', background: '#e2e8f0', color: 'var(--text-main)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Quay lại
        </button>
      </div>

      {restaurant.Food && restaurant.Food.length > 0 ? (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {restaurant.Food.map(food => {
            const price = food.RestaurantFood?.price;
            const foodHistories = historyRecords[food.id] || [];
            const hasEaten = foodHistories.length > 0;

            return (
              <div 
                key={food.id} 
                style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigate(`/food/${food.id}`)}>
                  <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: '2rem' }}>
                    {food.image ? <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🍲'}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', '&:hover': { color: 'var(--primary-color)' } }}>{food.name}</h3>
                    <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                      {price ? `${price.toLocaleString()} VNĐ` : 'Theo giá thực đơn'}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    onClick={(e) => handleMarkAsEaten(food.id, e)}
                    style={{
                      background: hasEaten ? '#10b981' : 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      width: '100%'
                    }}
                  >
                    {hasEaten ? '✅ Đã từng ăn ở đây' : 'Đánh dấu Đã ăn'}
                  </button>
                </div>

                {hasEaten && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }}>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Lịch sử ăn của bạn:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {foodHistories.slice(0, 3).map(h => (
                        <div key={h.id} style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '8px' }}>
                          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 0.3rem 0' }}>{new Date(h.createdAt).toLocaleString('vi-VN')}</p>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, fontStyle: 'italic' }}>
                            {h.note ? `"${h.note}"` : 'Không có nhận xét.'}
                          </p>
                          {h.image && (
                            <div style={{ marginTop: '0.5rem', borderRadius: '6px', overflow: 'hidden', height: '80px', width: '80px' }}>
                              <img src={h.image} alt="Thực tế" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                        </div>
                      ))}
                      {foodHistories.length > 3 && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--primary-color)', textAlign: 'center', cursor: 'pointer', margin: 0 }} onClick={() => navigate('/history')}>
                          Xem thêm lịch sử...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '3rem', background: 'white', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
          <h3 style={{ color: 'var(--text-muted)' }}>Quán ăn này chưa có món nào trong thực đơn.</h3>
        </div>
      )}

      {activeFoodId && (
        <MarkEatenModal 
          onClose={() => setActiveFoodId(null)}
          onSubmit={handleMarkEatenSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default RestaurantDetail;
