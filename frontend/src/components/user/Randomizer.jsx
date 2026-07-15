import React, { useState } from 'react';
import api from '../../services/api';

const Randomizer = () => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [criteria, setCriteria] = useState({
    categoryId: '',
    area: '',
    minPrice: '',
    maxPrice: '',
    openNow: false
  });

  const handleRoll = async () => {
    setLoading(true);
    setError('');
    setSuggestion(null);

    try {
      const params = new URLSearchParams(criteria).toString();
      const res = await api.get(`/api/food-finder/random?${params}`);
      
      if (res.data.success) {
        setSuggestion(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không tìm thấy gợi ý nào phù hợp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="randomizer-container">
      <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>Hôm nay ăn gì?</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Để chúng tôi chọn món ngon cho bạn!</p>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '2rem', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '1rem' }}>Chọn tiêu chí (Tùy chọn)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>Khu vực (VD: Quận 1)</label>
            <input type="text" value={criteria.area} onChange={e => setCriteria({...criteria, area: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: '0.5rem' }} />
          </div>
          <div>
            <label>Mức giá tối đa (VNĐ)</label>
            <input type="number" value={criteria.maxPrice} onChange={e => setCriteria({...criteria, maxPrice: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: '0.5rem' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="openNow" checked={criteria.openNow} onChange={e => setCriteria({...criteria, openNow: e.target.checked})} />
            <label htmlFor="openNow">Chỉ hiện quán đang mở cửa</label>
          </div>
        </div>
      </div>

      <button 
        onClick={handleRoll}
        disabled={loading}
        style={{
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          color: 'white',
          border: 'none',
          padding: '1.2rem 3rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          borderRadius: '50px',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 10px 20px rgba(234, 88, 12, 0.3)',
          transition: 'transform 0.2s ease',
          transform: loading ? 'scale(0.95)' : 'scale(1)'
        }}
      >
        {loading ? 'Đang tung xúc xắc...' : '🎲 Gợi ý cho tôi'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '2rem' }}>{error}</p>}

      {suggestion && (
        <div style={{ marginTop: '3rem', animation: 'fadeIn 0.5s ease-out' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎉 Bạn nên thử:</h3>
          <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
            <div style={{ background: '#f8fafc', padding: '2rem' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{suggestion.food.name}</h2>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{suggestion.restaurant.price.toLocaleString()} VNĐ</p>
            </div>
            <div style={{ padding: '2rem', textAlign: 'left' }}>
              <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Tại quán</h4>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{suggestion.restaurant.name}</h3>
              <p>📍 {suggestion.restaurant.address}, {suggestion.restaurant.area}</p>
              <p>⏰ {suggestion.restaurant.openTime} - {suggestion.restaurant.closeTime}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Randomizer;
