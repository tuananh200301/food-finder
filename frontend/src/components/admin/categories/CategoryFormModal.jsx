import React, { useState } from 'react';
import axios from 'axios';

const CategoryFormModal = ({ category, onClose, onSuccess }) => {
  const isEdit = !!category;
  const [name, setName] = useState(category ? category.name : '');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(category && category.image ? category.image : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    if (!name.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      let res;
      if (isEdit) {
        res = await axios.put(`/api/categories/${category.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.post('/api/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        onSuccess(res.data.data, isEdit);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu danh mục. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {isEdit ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục Mới'}
        </h3>
        
        {error && <div className="error-text">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Tên danh mục *</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Ví dụ: Món nước, Trà sữa..." 
              required 
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', color: 'var(--text-main)' }}
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
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              type="submit" 
              className="btn-primary-auth" 
              disabled={loading}
              style={{ flex: 1, padding: '0.8rem' }}
            >
              {loading ? 'Đang lưu...' : 'Lưu Danh mục'}
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

export default CategoryFormModal;
