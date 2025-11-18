import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [pending, setPending] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'ADMIN') router.push('/');
    }
  }, [loading, user, router]);

  // Load pending professionals when admin is ready
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;

    async function load() {
      setLoadingList(true);
      setError('');
      try {
        const res = await api.get('/api/professionals/admin/pending/list');
        setPending(res.data || []);
      } catch (e) {
        console.error(e);
        setError('Failed to load pending professionals.');
      } finally {
        setLoadingList(false);
      }
    }

    load();
  }, [user]);

  const handleApprove = async (id) => {
    setError('');
    setActionMessage('');
    try {
      await api.put(`/api/professionals/admin/verify/${id}`);
      setPending((prev) => prev.filter((p) => p.id !== id));
      setActionMessage('Professional approved successfully.');
    } catch (e) {
      console.error(e);
      setError('Failed to approve this professional.');
    }
  };

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="p-8">Checking admin access…</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-2">Admin dashboard</h1>
        <p className="text-slate-600 mb-4">
          Review and approve newly registered professionals.
        </p>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {actionMessage && <p className="text-green-600 mb-2">{actionMessage}</p>}

        {loadingList && <p>Loading pending profiles…</p>}

        {!loadingList && pending.length === 0 && (
          <p className="text-slate-600">No pending professionals right now.</p>
        )}

        {!loadingList && pending.length > 0 && (
          <div className="space-y-3 mt-3">
            {pending.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">
                    {p.user?.name || 'Unnamed professional'}
                  </p>
                  <p className="text-sm text-slate-600">{p.user?.email}</p>
                  <p className="text-sm mt-1">
                    <strong>Specialties:</strong> {p.specialties}
                  </p>
                  <p className="text-sm">
                    <strong>Location:</strong> {p.location}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Profile ID: {p.id} – User ID: {p.userId}
                  </p>
                </div>
                <button
                  onClick={() => handleApprove(p.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
