import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState('');

  // If not logged in, send to login page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Fetch patient bookings when logged in as a PATIENT
  useEffect(() => {
    if (!user || user.role !== 'PATIENT') {
      setLoadingBookings(false);
      return;
    }

    async function loadBookings() {
      setLoadingBookings(true);
      setBookingError('');

      try {
        const res = await api.get('/api/bookings/my');
        setBookings(res.data || []);
      } catch (e) {
        console.error('Error loading bookings', e);
        setBookingError(
          'Unable to load your bookings at the moment. Please try again later.'
        );
      } finally {
        setLoadingBookings(false);
      }
    }

    loadBookings();
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <div className="p-8">Checking your session...</div>
      </Layout>
    );
  }

  if (!user) {
    return null; // redirect handled above
  }

  const isPatient = user.role === 'PATIENT';

  const now = new Date();
  const upcoming = bookings.filter(
    (b) => b.start && new Date(b.start) >= now
  );
  const past = bookings.filter((b) => b.start && new Date(b.start) < now);

  const formatDateTime = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString();
  };

  return (
    <Layout>
      <div className="py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user.name}{' '}
          <span className="text-sm font-normal text-slate-600">
            ({user.role.toLowerCase()})
          </span>
        </h1>

        {isPatient && (
          <>
            <p className="text-slate-600 mb-4">
              This is your personal dashboard. Here you’ll see all your booking
              history and upcoming visits.
            </p>

            {/* 🔍 Quick link to search professionals */}
            <button
              onClick={() => router.push('/')}
              className="mb-6 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
            >
              Search professionals
            </button>
          </>
        )}

        {!isPatient && (
          <p className="text-slate-600 mb-6">
            You are logged in as a professional. In a later step we will add a
            dedicated professional dashboard for managing your availability and
            bookings.
          </p>
        )}

        {isPatient && (
          <>
            {/* PATIENT DASHBOARD CONTENT */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Your profile</h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> Patient
                </p>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Your bookings</h2>

              {bookingError && (
                <p className="text-red-600 mb-2">{bookingError}</p>
              )}

              {loadingBookings && (
                <p className="text-slate-600">Loading your bookings…</p>
              )}

              {!loadingBookings && bookings.length === 0 && !bookingError && (
                <p className="text-slate-600">
                  You have no bookings yet. Use the home page search to find a
                  nurse or physiotherapist and make your first booking.
                </p>
              )}

              {!loadingBookings && bookings.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  {/* Upcoming */}
                  <div>
                    <h3 className="font-semibold mb-2">Upcoming visits</h3>
                    {upcoming.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No upcoming visits scheduled.
                      </p>
                    )}
                    {upcoming.map((b) => (
                      <div
                        key={b.id}
                        className="bg-white rounded-xl border border-slate-200 p-3 mb-2"
                      >
                        <p className="text-sm text-slate-700">
                          <strong>Date &amp; time:</strong>{' '}
                          {formatDateTime(b.start)}
                        </p>
                        <p className="text-sm text-slate-700">
                          <strong>Status:</strong> {b.status}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Professional ID: {b.professionalId}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Past */}
                  <div>
                    <h3 className="font-semibold mb-2">Past visits</h3>
                    {past.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No past visits yet.
                      </p>
                    )}
                    {past.map((b) => (
                      <div
                        key={b.id}
                        className="bg-white rounded-xl border border-slate-200 p-3 mb-2"
                      >
                        <p className="text-sm text-slate-700">
                          <strong>Date &amp; time:</strong>{' '}
                          {formatDateTime(b.start)}
                        </p>
                        <p className="text-sm text-slate-700">
                          <strong>Status:</strong> {b.status}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Professional ID: {b.professionalId}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
