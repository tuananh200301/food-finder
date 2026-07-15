import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UserHistory = () => {
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        let url = `/api/history/user/${user.id}`;
        if (filterDate) {
          url += `?date=${filterDate}`;
        }
        const res = await api.get(url);
        if (res.data.success) {
          setHistories(res.data.data);
        } else {
          setError('Không thể tải lịch sử.');
        }
      } catch (err) {
        console.error(err);
        setError('Có lỗi xảy ra khi kết nối máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, filterDate]);

  if (!user) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Bạn cần đăng nhập để xem lịch sử</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem', gap: '1rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', margin: 0 }}>Lịch sử ăn uống của bạn</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <label htmlFor="dateFilter" style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Lọc theo ngày:</label>
          <input 
            type="date" 
            id="dateFilter"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'inherit' }}
          />
          {filterDate && (
            <button 
              onClick={() => setFilterDate('')}
              style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}
              title="Xóa bộ lọc"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : histories.length > 0 ? (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {histories.map(h => (
            <div key={h.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
              
              <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', overflow: 'hidden', flexShrink: 0 }}>
                {h.Food?.image ? <img src={h.Food.image} alt={h.Food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🍲'}
              </div>
              
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{ margin: '0 0 0.3rem 0', color: 'var(--text-main)', fontSize: '1.3rem' }}>{h.Food?.name || 'Món ăn không xác định'}</h3>
                <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                  Tại: <span onClick={() => navigate(`/restaurant/${h.restaurantId}`)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{h.Restaurant?.name || 'Quán ăn không xác định'}</span>
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  📍 {h.Restaurant?.address}
                </p>
              </div>

              <div style={{ flexShrink: 0, minWidth: '200px', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  🕒 {new Date(h.createdAt).toLocaleString('vi-VN')}
                </p>
                <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontStyle: 'italic', color: h.note ? 'var(--text-main)' : '#94a3b8' }}>
                  {h.note ? `"${h.note}"` : 'Không có nhận xét.'}
                </div>
                {h.image && (
                  <div style={{ marginTop: '0.8rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', height: '120px' }}>
                    <img src={h.image} alt="Thực tế" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '3rem', background: 'white', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
          <h3 style={{ color: 'var(--text-muted)' }}>{filterDate ? 'Không có lịch sử ăn uống trong ngày này.' : 'Bạn chưa đánh dấu món ăn nào.'}</h3>
          {!filterDate && <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Hãy khám phá các món ngon và đánh dấu "Đã ăn" nhé!</p>}
          <button onClick={() => navigate('/')} style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
            Về Trang chủ
          </button>
        </div>
      )}
    </div>
  );
};

export default UserHistory;
