import { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterProfessionalPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');

  const [category, setCategory] = useState('Physiotherapist');
  const [specialties, setSpecialties] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [city, setCity] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [experienceYears, setExperienceYears] = useState('');

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    setErr('');

    // simple front-end check
    if (!specialties || !city || !state) {
      setErr('Specialties and location are required for professionals');
      return;
    }

    setLoading(true);

    try {
      const location = `${city}, ${state}`;

      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role: 'PROFESSIONAL',
        specialties: `${category} – ${specialties}`,
        location,
        hourlyRate: hourlyRate ? Number(hourlyRate) : null,
        experienceYears: experienceYears ? Number(experienceYears) : null,
      });

      setMsg(
        'Professional registered successfully. Your profile is pending admin approval.'
      );
    } catch (e) {
      console.error('Professional register error', e);
      setErr(
        e.response?.data?.error ||
          'Registration failed. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">Register as Professional</h1>
        <p className="text-slate-600 mb-6">
          Join as a home nurse, physiotherapist or caregiver. Your profile will
          be reviewed by admin before going live.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* BASIC USER INFO */}
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              For testing you can keep this as 123456.
            </p>
          </div>

          {/* PROFESSIONAL DETAILS */}
          <div>
            <label className="block mb-1 text-sm font-medium">Category</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Physiotherapist</option>
              <option>Home Nurse</option>
              <option>Caregiver</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Specialties / Skills
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="E.g. sports injury, elderly care"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium">
                State (India)
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option>Tamil Nadu</option>
                <option>Kerala</option>
                <option>Karnataka</option>
                <option>Telangana</option>
                <option>Andhra Pradesh</option>
                <option>Maharashtra</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">City</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Hourly rate (₹ or CZK)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Experience (years)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
            </div>
          </div>

          {err && <p className="text-red-600 text-sm">{err}</p>}
          {msg && <p className="text-green-600 text-sm">{msg}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mt-2"
            disabled={loading}
          >
            {loading ? 'Registering…' : 'Register professional'}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600">
            Sign in
          </a>
        </p>
      </div>
    </Layout>
  );
}
