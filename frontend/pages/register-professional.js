import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterProfessionalPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [category, setCategory] = useState("PHYSIOTHERAPIST");
  const [specialties, setSpecialties] = useState("");
  const [location, setLocation] = useState("Brno");
  const [hourlyRate, setHourlyRate] = useState("800");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // 1) create user with PROFESSIONAL role
      const userRes = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role: "PROFESSIONAL",
      });

      const userId = userRes.data.id;

      // 2) create profile for this professional
      await axios.post(`${API_URL}/api/professionals`, {
        userId,
        category,
        specialties,
        location,
        hourlyRate: Number(hourlyRate),
      });

      setSuccess("Professional registered. You can login now.");
      // router.push("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Registration failed.");
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Register as Nurse / Physiotherapist</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          style={{ width: "100%", marginBottom: "0.5rem" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          style={{ width: "100%", marginBottom: "0.5rem" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          style={{ width: "100%", marginBottom: "0.5rem" }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Category</label>
        <select
          style={{ width: "100%", marginBottom: "0.5rem" }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="PHYSIOTHERAPIST">Physiotherapist</option>
          <option value="NURSE">Nurse</option>
        </select>

        <label>Specialties / Skills</label>
        <input
          style={{ width: "100%", marginBottom: "0.5rem" }}
          value={specialties}
          onChange={(e) => setSpecialties(e.target.value)}
          placeholder="Sports injury, Neuro rehab..."
        />

        <label>Location</label>
        <input
          style={{ width: "100%", marginBottom: "0.5rem" }}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label>Hourly rate (CZK)</label>
        <input
          style={{ width: "100%", marginBottom: "0.5rem" }}
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Register professional</button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Are you a patient? <a href="/register">Register as patient</a>
      </p>
    </div>
  );
}
