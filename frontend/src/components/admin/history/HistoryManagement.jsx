import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const HistoryManagement = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/history/admin');
      if (res.data.success) {
        setHistories(res.data.data);
      } else {
        setError('Lỗi khi tải dữ liệu lịch sử.');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Lịch sử ăn uống</h2>
        <button onClick={fetchHistories} style={{ padding: '0.5rem 1rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          🔄 Làm mới
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Thời gian</th>
                <th style={{ padding: '1rem' }}>Người dùng</th>
                <th style={{ padding: '1rem' }}>Món ăn</th>
                <th style={{ padding: '1rem' }}>Tại Quán</th>
                <th style={{ padding: '1rem' }}>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {histories.length > 0 ? histories.map(history => (
                <tr key={history.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem' }}>{new Date(history.createdAt).toLocaleString('vi-VN')}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{history.User?.name || 'User ẩn'}</td>
                  <td style={{ padding: '1rem', color: 'var(--primary-color)' }}>{history.Food?.name || 'Món ăn đã xóa'}</td>
                  <td style={{ padding: '1rem' }}>{history.Restaurant?.name || 'Quán ăn đã xóa'}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{history.note || '-'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    Chưa có dữ liệu lịch sử nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryManagement;
