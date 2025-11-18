// frontend/components/Navbar.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getStoredAuth, clearStoredAuth } from '../lib/auth';

export default function Navbar() {
  const router = useRouter();
  const [auth, setAuth] = useState(null); // { token, user } or null

  // Read auth once on mount and when storage changes (other tabs / login page)
  useEffect(() => {
    setAuth(getStoredAuth());
    const onStorage = () => setAuth(getStoredAuth());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function handleLogout() {
    clearStoredAuth();
    setAuth(null);
    router.push('/'); // back to home
  }

  const isAdmin = auth?.user?.role === 'ADMIN';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderBottom: '1px solid #eee'
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9999, background: '#4c6ef5',
          color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700
        }}>
          S
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>Subaa Care</div>
          <div style={{ fontSize: 12, color: '#666' }}>We care those who you care</div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/" style={{ textDecoration: 'none' }}>Home</a>

        {!auth ? (
          <>
            <a href="/register-professional" style={{ textDecoration: 'none' }}>
              Join as professional
            </a>
            <a href="/register" style={{ textDecoration: 'none' }}>Register</a>
            <a href="/login" style={{ textDecoration: 'none' }}>Sign in</a>
          </>
        ) : (
          <>
            {isAdmin && (
              <a
                href="/admin/pending"
                style={{
                  textDecoration: 'none',
                  padding: '6px 10px',
                  borderRadius: 8,
                  background: '#eef2ff',
                  border: '1px solid #c7d2fe',
                  fontWeight: 600
                }}
              >
                Approve professionals
              </a>
            )}

            {/* Show who is logged in */}
            <span style={{ color: '#555' }}>
              {auth.user?.name || auth.user?.email}
            </span>

            {/* Logout always visible when signed in */}
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd',
                background: 'white', cursor: 'pointer'
              }}
              aria-label="Logout"
              title="Logout"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </div>
  );
}
