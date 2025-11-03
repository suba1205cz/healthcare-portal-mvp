// frontend/pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Could not login');
        return;
      }

      const data = await res.json();
      // data = { token, user: { id, name, email, role } }

// save to localStorage so other pages (admin, navbar, etc.) can read
if (typeof window !== 'undefined') {
  localStorage.setItem('subaa_user', JSON.stringify(data)); // keep legacy
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}


      // if admin -> go to /admin/pending
      if (data.user?.role === 'ADMIN') {
        router.push('/admin/pending');
      } else {
        // patient/professional -> home
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      setError('Could not login');
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Sign in</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <p>
          <label>Email</label><br />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
          />
        </p>
        <p>
          <label>Password</label><br />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </p>
        <button type="submit">Sign in</button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        New here? <a href="/register">Register as patient</a> or{' '}
        <a href="/register-professional">register as professional</a>
      </p>
    </div>
  );
}
