import React, { useState } from 'react';

const MarkEatenModal = ({ onClose, onSubmit, isSubmitting }) => {
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh quá lớn (tối đa 5MB). Vui lòng chọn ảnh khác.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ note, image });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <h3 style={{ marginTop: 0, color: 'var(--primary-color)' }}>Đánh dấu đã ăn & Nhận xét</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="input-group">
            <label>Hình ảnh thực tế (Tùy chọn)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              style={{ background: 'white', color: 'black' }}
            />
            {preview && (
              <div style={{ marginTop: '0.5rem', width: '100%', maxHeight: '200px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #ccc' }}>
                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#f1f5f9' }} />
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Nhận xét của bạn (Tùy chọn)</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Hôm nay món ăn thế nào? Phục vụ ra sao?..."
              rows={4}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit', resize: 'vertical' }}
            ></textarea>
          </div>

          <div className="action-buttons" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>Hủy</button>
            <button type="submit" className="btn-save" style={{ background: 'var(--primary-color)' }} disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MarkEatenModal;
