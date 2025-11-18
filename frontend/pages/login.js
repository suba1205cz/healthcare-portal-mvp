import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // use AuthContext login (this calls /api/auth/login for us)
      const data = await login(email, password);

      const role = data.user.role;

      // redirect based on role
      if (role === 'PATIENT') {
        router.push('/dashboard');
      } else if (role === 'PROFESSIONAL') {
        router.push('/dashboard'); // later we’ll show pro-specific view here
      } else if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (e) {
      console.error('Login failed', e);
      setError(
        e.response?.data?.error || 'Login failed. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div
        style={{
          maxWidth: 420,
          margin: '2rem auto',
          background: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 35px rgba(15, 23, 42, 0.07)',
        }}
      >
        <h1
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          Sign in
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Use your registered email and password.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              type="email"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              type="password"
              required
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" style={primaryBtn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

const inputStyle = {
  width: '100%',
  border: '1px solid #d1d5db',
  borderRadius: '0.5rem',
  padding: '0.6rem 0.8rem',
  outline: 'none',
};

const primaryBtn = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  padding: '0.6rem 0.8rem',
  cursor: 'pointer',
  fontWeight: 600,
};
