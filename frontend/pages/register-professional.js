import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// simple India map — we can expand anytime
const INDIA_LOCATIONS = {
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Pathanamthitta"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru"],
  "Telangana": ["Hyderabad", "Warangal"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Delhi": ["New Delhi"],
};

export default function RegisterProfessionalPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [category, setCategory] = useState("Physiotherapist");
  const [specialties, setSpecialties] = useState("");
  const [state, setState] = useState("Kerala");
  const [city, setCity] = useState("Pathanamthitta");
  const [hourlyRate, setHourlyRate] = useState("800");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // 1) create user with role PROFESSIONAL
      const userRes = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role: "PROFESSIONAL",
      });

      const userId = userRes.data.id;

      // 2) create profile
      await axios.post(`${API_URL}/api/professionals`, {
        userId,
        specialties,
        location: `${city}, ${state}, India`,
        hourlyRate: Number(hourlyRate),
        category, // backend can ignore this if not in schema
      });

      setSuccess("Professional registered. You can login now.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Registration failed.");
    }
  }

  return (
    <Layout>
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          background: "white",
          padding: "1.75rem",
          borderRadius: "1rem",
          boxShadow: "0 10px 35px rgba(15, 23, 42, 0.07)",
        }}
      >
        <h1 style={{ fontSize: "1.7rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Register as Nurse / Physiotherapist
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "1.25rem" }}>
          Create your professional profile. Patients can search and book you.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.85rem" }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Nurse">Nurse</option>
              <option value="Physiotherapist">Physiotherapist</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Specialties / Skills</label>
            <input
              style={inputStyle}
              placeholder="sports injury, stroke rehab, home care..."
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
            />
          </div>

          {/* India state */}
          <div>
            <label style={labelStyle}>State (India)</label>
            <select
              style={inputStyle}
              value={state}
              onChange={(e) => {
                const newState = e.target.value;
                setState(newState);
                // reset city to first of that state
                const firstCity = INDIA_LOCATIONS[newState][0];
                setCity(firstCity);
              }}
            >
              {Object.keys(INDIA_LOCATIONS).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* India city */}
          <div>
            <label style={labelStyle}>City</label>
            <select style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)}>
              {INDIA_LOCATIONS[state].map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Hourly rate (₹ or CZK)</label>
            <input
              style={inputStyle}
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button type="submit" style={primaryBtn}>
            Register professional
          </button>
        </form>

        <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
          Are you a patient?{" "}
          <a href="/register" style={{ color: "#2563eb" }}>
            Register as patient
          </a>
        </p>
      </div>
    </Layout>
  );
}

const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, color: "#374151" };

const inputStyle = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  padding: "0.6rem 0.8rem",
  outline: "none",
  background: "white",
};

const primaryBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.6rem 0.8rem",
  cursor: "pointer",
  fontWeight: 600,
};
