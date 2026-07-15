import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => setCategories(res.data?.data || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)', padding: '3rem', borderRadius: '16px', color: 'white', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Tìm món ngon, Ăn thật đã!</h1>
        <p style={{ fontSize: '1.2rem' }}>Khám phá hàng ngàn món ăn xung quanh bạn.</p>
      </div>

      <h2 style={{ marginBottom: '1.5rem', textAlign: 'left', color: 'var(--text-main)' }}>Danh mục Món ăn</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.5rem', paddingBottom: '1rem' }}>
        {categories?.length > 0 ? categories.map(cat => (
          <div key={cat.id} 
               onClick={() => navigate(`/category/${cat.id}`)}
               style={{ padding: '1.5rem 1rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' } }}>
            {cat.image ? (
              <div style={{ width: '60px', height: '60px', marginBottom: '0.8rem', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍲</div>
            )}
            <h4 style={{ color: 'var(--text-main)', margin: 0, fontWeight: 'bold' }}>{cat.name}</h4>
          </div>
        )) : (
          <p>Chưa có danh mục nào.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
