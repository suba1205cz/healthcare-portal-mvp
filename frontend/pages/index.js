import { useState } from 'react';
import Layout from '../components/Layout';
import ProfessionalCard from '../components/ProfessionalCard';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  // Search fields
  const [location, setLocation] = useState('');   // city / area
  const [skill, setSkill] = useState('');         // specialty / skill
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Results state
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    // Require patient login
    if (!user || user.role !== 'PATIENT') {
      alert('Please sign in as a patient to search for professionals.');
      return;
    }

    setHasSearched(true);
    setLoading(true);

    try {
      // skill -> q, location -> location
      const res = await api.get('/api/professionals', {
        params: {
          q: skill || undefined,
          location: location || undefined,
        },
      });
      setResults(res.data || []);
    } catch (err) {
      console.error('Search error', err);
      alert('Failed to search professionals. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="bg-blue-50 rounded-3xl p-8 mt-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Find Home Nursing &amp; Physiotherapy
          </h1>
          <p className="text-slate-700">
            Book verified professionals near you. Kerala, TN, KA — and expats
            abroad.
          </p>
        </div>

        {/* Patient-care image */}
        <div className="hidden md:block">
          <div className="h-40 w-64 rounded-2xl overflow-hidden border border-blue-100 shadow-sm">
            <img
              src="/images/patient-care.jpg"
              alt="Indian nurse caring for an elderly patient at home"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="mb-4">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Location */}
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City / area (e.g. Chennai)"
            className="flex-1 border rounded-lg px-3 py-2"
          />
          {/* Skill / specialty */}
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Skill / specialty (e.g. elderly care)"
            className="flex-1 border rounded-lg px-3 py-2"
          />
          {/* Date & time (just UI for now) */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-3 py-2 md:w-40"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border rounded-lg px-3 py-2 md:w-32"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>

        {/* Small helper text under the search */}
        <div className="mt-2 text-sm">
          {!user && (
            <p className="text-purple-600">
              Register and sign in as a patient, then use the search above to
              see available professionals.
            </p>
          )}
          {user && user.role === 'PATIENT' && (
            <p className="text-slate-600">
              Enter your city and required skill to find verified professionals
              near you.
            </p>
          )}
        </div>
      </section>

      {/* RESULTS */}
      <section className="mt-4">
        {hasSearched && loading && <p>Searching professionals...</p>}

        {hasSearched && !loading && results.length === 0 && (
          <p className="text-slate-600">
            No professionals found for your search.
          </p>
        )}

        {hasSearched && !loading && results.length > 0 && (
          <div className="mt-4 space-y-3">
            {results.map((p) => (
              <ProfessionalCard key={p.id} profile={p} />
            ))}
          </div>
        )}
      </section>

      {/* SCROLLING NOTICE AT BOTTOM (keeps your purple marquee) */}
      <div className="mt-10 border-t border-slate-200 pt-3">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee text-sm text-[#7E2AFF] font-semibold">
            Register and sign in as a patient, then use the search above to see
            available professionals.&nbsp;&nbsp;•&nbsp;&nbsp;
            Register and sign in as a patient, then use the search above to see
            available professionals.&nbsp;&nbsp;•&nbsp;&nbsp;
            Register and sign in as a patient, then use the search above to see
            available professionals.
          </div>
        </div>
      </div>
    </Layout>
  );
}
