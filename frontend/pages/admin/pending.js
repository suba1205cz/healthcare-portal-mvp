// frontend/pages/admin/pending.js
import { useEffect, useState } from 'react';

export default function AdminPendingPage() {
  const [pending, setPending] = useState([]);
  const [error, setError] = useState('');
  const [approvedMsg, setApprovedMsg] = useState('');
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setError('No token. Please login as admin.');
      return;
    }

    fetch(`${apiBase}/api/admin/pending-professionals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setPending(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load pending professionals');
      });
  }, [apiBase]);

  async function handleApprove(id) {
    const token = localStorage.getItem('token');
    if (!token) return;

    await fetch(`${apiBase}/api/admin/approve/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    setPending((prev) => prev.filter((p) => p.id !== id));
    setApprovedMsg('Approved ✅');
  }

  async function handleReject(id, reason) {
    const token = localStorage.getItem('token');
    if (!token) return;

    await fetch(`${apiBase}/api/admin/reject/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Pending professionals</h1>
      <p>
        Approve only verified nurses / physiotherapists. After approval they
        will appear on the portal.
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {approvedMsg && <p style={{ color: 'green' }}>{approvedMsg}</p>}

      {pending.length === 0 && <p>No pending professionals 🎉</p>}

      <div style={{ display: 'grid', gap: '1rem', maxWidth: '900px' }}>
        {pending.map((p) => (
          <PendingCard
            key={p.id}
            prof={p}
            onApprove={() => handleApprove(p.id)}
            onReject={(reason) => handleReject(p.id, reason)}
          />
        ))}
      </div>
    </div>
  );
}

function PendingCard({ prof, onApprove, onReject }) {
  const [reason, setReason] = useState('');

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: '1rem 1.25rem',
      }}
    >
      <h3 style={{ marginBottom: '0.25rem' }}>
        {prof.user?.name || '—'}{' '}
        <span style={{ fontWeight: 'normal', color: '#555', fontSize: 14 }}>
          ({prof.user?.email})
        </span>
      </h3>
      <p>
        <b>Location:</b> {prof.location || '—'}
      </p>
      <p>
        <b>Specialties:</b> {prof.specialties || '—'}
      </p>
      <p>
        <b>Hourly rate:</b> {prof.hourlyRate || '—'}
      </p>
      <p>
        <b>ID proof:</b> {prof.idProofUrl ? 'uploaded' : '—'}
      </p>
      <p>
        <b>Address proof:</b> {prof.addressProofUrl ? 'uploaded' : '—'}
      </p>
      <p>
        <b>Qualification:</b> {prof.qualification || '—'}
      </p>

      <label style={{ display: 'block', marginTop: '0.5rem' }}>
        Rejection note:
        <textarea
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ width: '100%', marginTop: 4 }}
          placeholder="ID not clear / Please upload nursing council card / ..."
        />
      </label>

      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={onApprove}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '0.4rem 0.9rem',
            borderRadius: 6,
          }}
        >
          Approve
        </button>
        <button
          onClick={() => onReject(reason)}
          style={{
            background: '#f97316',
            color: 'white',
            border: 'none',
            padding: '0.4rem 0.9rem',
            borderRadius: 6,
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
