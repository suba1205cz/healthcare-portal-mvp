import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Nav() {
  const router = useRouter();
  const [auth, setAuth] = useState(null); // { token, user: {role, name, ...} }

  // read once and on storage changes
  useEffect(() => {
    const load = () => {
      try {
        const s = localStorage.getItem('subaa_user');
        setAuth(s ? JSON.parse(s) : null);
      } catch {
        setAuth(null);
      }
    };
    load();
    // update if other tabs change
    const onStorage = (e) => { if (e.key === 'subaa_user') load(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem('subaa_user');
    router.push('/');
  };

  const role = auth?.user?.role;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderBottom: '1px solid #eee'
    }}>
      <div style={{display:'flex', gap:16, alignItems:'center'}}>
        <a href="/" style={{ fontWeight: 700 }}>Subaa Care</a>
        <span style={{ color:'#666' }}>We care those who you care</span>
      </div>

      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        {/* Visible to everyone */}
        <a href="/">Home</a>
        <a href="/register-professional">Join as professional</a>

        {/* Professional: show status page */}
        {role === 'PROFESSIONAL' && (
          <a href="/professional/status">My approval status</a>
        )}

        {/* Admin: always show Approve link */}
        {role === 'ADMIN' && (
          <a href="/admin/pending"
             style={{padding:'6px 10px', border:'1px solid #ccc', borderRadius:8}}>
            Approve professionals
          </a>
        )}

        {/* Auth controls */}
        {!auth && (
          <>
            <a href="/register">Register</a>
            <a href="/login" style={{padding:'6px 10px', border:'1px solid #ccc', borderRadius:8}}>
              Sign in
            </a>
          </>
        )}
        {auth && (
          <>
            <span style={{color:'#666'}}>👤 {auth.user?.name || auth.user?.email}</span>
            <button onClick={logout}
              style={{padding:'6px 10px', border:'1px solid #ccc', borderRadius:8, background:'#fff', cursor:'pointer'}}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
