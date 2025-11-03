import { useEffect, useState } from 'react';

export default function ProfessionalStatus() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const saved = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('subaa_user') || 'null')
      : null;

    if (!saved?.token) {
      setErr('Please sign in first.');
      return;
    }

    fetch(`${apiBase}/api/professionals/me`, {
      headers: { Authorization: `Bearer ${saved.token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(setData)
      .catch(() => setErr('Could not fetch status.'));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your profile status</h1>
      {err && <p style={{ color: 'red' }}>{err}</p>}
      {!data && !err && <p>Loading…</p>}

      {data && (
        <div style={{ marginTop: 12 }}>
          <p><b>Name:</b> {data?.user?.name} ({data?.user?.email})</p>
          <p><b>Location:</b> {data?.location || '—'}</p>
          <p><b>Specialties:</b> {data?.specialties || '—'}</p>

          {data.isApproved && !data.isRejected && (
            <p style={{ color: 'green', fontWeight: 600 }}>
              ✅ Approved — your profile is live and bookable.
            </p>
          )}

          {!data.isApproved && !data.isRejected && (
            <p style={{ color: '#b58900', fontWeight: 600 }}>
              ⏳ Waiting for admin approval. You’ll appear in search once approved.
            </p>
          )}

          {data.isRejected && (
            <div>
              <p style={{ color: 'crimson', fontWeight: 600 }}>
                ❌ Rejected by admin.
              </p>
              <p><b>Reason:</b> {data.rejectionReason || 'No reason provided.'}</p>
              <p style={{ marginTop: 8 }}>
                Please update your documents and resubmit.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
