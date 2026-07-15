import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import { useState } from 'react';

const Login = ({ setUser }) => {
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTraditionalAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = activeTab === 'login' 
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await api.post(endpoint, payload);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Auth failed:", err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post(`/api/auth/google`, {
        token: credentialResponse.credential
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError('Đăng nhập Google thất bại.');
    }
  };

  const handleGoogleError = () => {
    setError('Quá trình đăng nhập Google bị lỗi hoặc bị hủy.');
  };

  return (
    <div className="login-container">
      {error && <p className="error-text">{error}</p>}
      
      <div className="auth-tabs">
        <button 
          className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Đăng nhập
        </button>
        <button 
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Đăng ký
        </button>
      </div>

      <form className="auth-form" onSubmit={handleTraditionalAuth}>
        {activeTab === 'register' && (
          <div className="input-group">
            <label>Tên của bạn</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Nhập họ và tên..."
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
        )}
        
        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Nhập email..."
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="input-group">
          <label>Mật khẩu</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Nhập mật khẩu..."
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>

        <button type="submit" className="btn-primary-auth">
          {activeTab === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
        </button>
      </form>

      <div className="divider">
        <span>hoặc</span>
      </div>

      <div className="google-btn-wrapper">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_black"
          shape="circle"
          size="large"
          text={activeTab === 'login' ? "signin_with" : "signup_with"}
        />
      </div>
    </div>
  );
};

export default Login;
