import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CategoryFoods = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryFoods = async () => {
      try {
        const res = await api.get(`/api/categories/${id}`);
        if (res.data.success) {
          setCategory(res.data.data);
        } else {
          setError('Không thể tải dữ liệu danh mục.');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryFoods();
  }, [id]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!category) return <div style={{ padding: '2rem', textAlign: 'center' }}>Không tìm thấy danh mục.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-main)' }}
      >
        ← Quay lại
      </button>

      <div style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', padding: '2rem', borderRadius: '16px', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{category.name}</h1>
        {category.description && <p style={{ marginTop: '0.5rem', fontSize: '1.1rem', opacity: 0.9 }}>{category.description}</p>}
      </div>

      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Các món ăn trong danh mục</h2>
      
      {category.Food && category.Food.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {category.Food.map(food => (
            <div 
              key={food.id} 
              onClick={() => navigate(`/food/${food.id}`)}
              style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' } }}
            >
              <div style={{ height: '150px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                {food.image ? <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🍲'}
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{food.name}</h3>
                <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', margin: '0 0 1rem 0' }}>
                  {food.referencePrice ? `${food.referencePrice.toLocaleString()} VNĐ` : 'Chưa có giá'}
                </p>
                {food.description && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {food.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '3rem', background: 'white', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
          <h3 style={{ color: 'var(--text-muted)' }}>Chưa có món ăn nào trong danh mục này.</h3>
        </div>
      )}
    </div>
  );
};

export default CategoryFoods;
