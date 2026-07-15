import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodFormModal = ({ food, onClose, onSuccess }) => {
  const isEdit = !!food;
  const [formData, setFormData] = useState({
    name: food ? food.name : '',
    description: food ? food.description : '',
    referencePrice: food ? food.referencePrice : '',
    categoryIds: food && food.Categories ? food.Categories.map(c => c.id) : []
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(food && food.image ? food.image : null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch categories for the checkbox list
    axios.get('/api/categories')
      .then(res => setCategories(res.data?.data || []))
      .catch(err => console.error('Lỗi tải danh mục', err));
  }, []);

  const handleCategoryChange = (id) => {
    setFormData(prev => {
      const isSelected = prev.categoryIds.includes(id);
      if (isSelected) {
        return { ...prev, categoryIds: prev.categoryIds.filter(cid => cid !== id) };
      } else {
        return { ...prev, categoryIds: [...prev.categoryIds, id] };
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh quá lớn (tối đa 5MB).");
        return;
      }
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Tên món ăn không được để trống');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('referencePrice', formData.referencePrice);
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      submitData.append('categoryIds', JSON.stringify(formData.categoryIds));

      let res;
      if (isEdit) {
        res = await axios.put(`/api/foods/${food.id}`, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        res = await axios.post('/api/foods', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      
      if (res.data.success) {
        onSuccess(res.data.data, isEdit);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu món ăn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {isEdit ? 'Chỉnh sửa Món ăn' : 'Thêm Món ăn Mới'}
        </h3>
        
        {error && <div className="error-text">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Tên món ăn *</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Ví dụ: Phở bò" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Mô tả</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Mô tả chi tiết món ăn..."
              rows={3}
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', fontFamily: 'inherit' }}
            />
          </div>

          <div className="input-group">
            <label>Giá tham khảo (VNĐ)</label>
            <input 
              type="number" 
              value={formData.referencePrice} 
              onChange={e => setFormData({...formData, referencePrice: e.target.value})} 
              placeholder="Ví dụ: 45000" 
            />
          </div>

          <div className="input-group">
            <label>Hình ảnh (Tùy chọn)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              style={{ color: 'var(--text-main)' }}
            />
            {preview && (
              <div style={{ marginTop: '0.5rem', width: '100px', height: '100px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #ccc' }}>
                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Thuộc danh mục</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
              {categories.map(cat => (
                <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id={`cat-${cat.id}`}
                    checked={formData.categoryIds.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                    style={{ width: 'auto' }}
                  />
                  <label htmlFor={`cat-${cat.id}`} style={{ fontWeight: 'normal' }}>{cat.name}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              type="submit" 
              className="btn-primary-auth" 
              disabled={loading}
              style={{ flex: 1, padding: '0.8rem' }}
            >
              {loading ? 'Đang lưu...' : 'Lưu Món ăn'}
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

export default FoodFormModal;
