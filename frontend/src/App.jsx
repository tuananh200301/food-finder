import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from './components/Login'
import AdminLayout from './components/AdminLayout'
import UserLayout from './components/UserLayout'

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  // Gatekeeper Logic
  if (!user) {
    return (
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div>
              <h1>Hệ Thống Đăng Nhập</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 300 }}>Vui lòng đăng nhập để tiếp tục</p>
            </div>
          </div>
        </header>
        <main className="app-main">
          <div className="login-section">
            <Login setUser={setUser} />
          </div>
        </main>
      </div>
    );
  }

  // Phân luồng Layout
  if (user.role === 'admin') {
    return <AdminLayout user={user} handleLogout={handleLogout} />;
  }

  return <UserLayout user={user} handleLogout={handleLogout} />;
}

export default App
