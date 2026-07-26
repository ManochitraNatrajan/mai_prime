import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminPanel from './components/AdminPanel';
import { api } from './utils/api';
import './index.css';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('maiprime_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('maiprime_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('maiprime_user');
  };


  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
      <nav style={{ 
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
        borderBottom: 'none', 
        padding: '12px var(--mobile-padding)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: 'none',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Mai Prime" style={{ height: '40px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
          <h1 style={{ margin: 0, fontSize: '1.25rem', color: 'white', letterSpacing: '-0.5px' }}>Mai Prime Attendance</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {deferredPrompt && (
            <button onClick={handleInstallClick} className="btn" style={{ width: 'auto', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', backgroundColor: '#fff', color: 'var(--primary)', border: 'none', fontWeight: 'bold' }}>Install App</button>
          )}
          {user && (
            <>
              <div className="hidden-mobile" style={{ fontWeight: '700', fontSize: '1rem', color: 'white' }}>Welcome, {user.name}!</div>
              <button onClick={handleLogout} className="btn" style={{ width: 'auto', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>Log Out</button>
            </>
          )}
        </div>
      </nav>

      <div style={{ minHeight: '100%' }}>
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : user.role === 'admin' ? (
          <AdminPanel user={user} />
        ) : (
          <EmployeeDashboard user={user} />
        )}
      </div>
    </div>
  );
}

export default App;
