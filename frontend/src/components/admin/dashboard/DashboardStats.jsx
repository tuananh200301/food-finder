import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch stats
    api.get('/api/misc/stats')
      .then(res => setStats(res.data.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <p>Đang tải...</p>;

  return (
    <div>
      <h2>Dashboard Thống Kê</h2>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>Tổng User</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>Tổng Món ăn</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalFoods}</p>
        </div>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>Tổng Quán</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalRestaurants}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
