import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProfessionalDashboard() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('subaa_user') : null;
    if (!raw) { router.replace('/login'); return; }
    setMe(JSON.parse(raw));
  }, [router]);

  useEffect(() => {
    if (!me?.user?.id) return;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/professionals/by-user/${me.user.id}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        setProfile(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [me]);

  if (!me) return null;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Professional dashboard</h1>

      {!loading && (
        <StatusBanner
          approved={!!profile?.isApproved}
          rejected={!!profile?.isRejected}
          reason={profile?.rejectionReason}
        />
      )}

      {!loading && profile && (
        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>{profile?.user?.name || '—'}</h2>
          <p style={{ margin: '0.25rem 0 1rem', color: '#666' }}>{profile?.user?.email}</p>
          <InfoRow label="Location" value={profile?.location || '—'} />
          <InfoRow label="Specialties" value={profile?.specialties || '—'} />
          <InfoRow label="Hourly rate (₹)" value={profile?.hourlyRate ? Number(profile.hourlyRate) : '—'} />
          <InfoRow label="ID proof" value={profile?.idProofUrl ? 'Uploaded' : '—'} />
          <InfoRow label="Address proof" value={profile?.addressProofUrl ? 'Uploaded' : '—'} />
          <InfoRow label="Qualification" value={profile?.qualification || '—'} />
        </section>
      )}

      {loading && <p>Loading…</p>}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem', margin: '0.35rem 0' }}>
      <div style={{ color: '#555', fontWeight: 600 }}>{label}:</div>
      <div>{value}</div>
    </div>
  );
}

function StatusBanner({ approved, rejected, reason }) {
  let bg = '#fffbea', color = '#8a6d00', text = 'Waiting for admin approval';
  if (approved) { bg = '#ecfdf5'; color = '#065f46'; text = 'Approved — your profile is visible to patients'; }
  if (rejected) { bg = '#fef2f2'; color = '#991b1b'; text = `Rejected — ${reason || 'please review and update your details'}`; }

  return (
    <div style={{
      background: bg, color, border: `1px solid ${color}33`,
      padding: '0.9rem 1.1rem', borderRadius: 10, marginBottom: '1rem', fontWeight: 600
    }}>
      {text}
    </div>
  );
}

const cardStyle = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: '1.2rem',
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
};
