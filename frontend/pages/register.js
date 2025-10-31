import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPatientPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role: "PATIENT",
      });
      setMsg("Registration successful. You can login now.");
    } catch (e) {
      setErr(e.response?.data?.error || "Registration failed.");
    }
  }

  return (
    <Layout>
      <div
        style={{
          maxWidth: 460,
          margin: "0 auto",
          background: "white",
          padding: "1.5rem",
          borderRadius: "1rem",
          boxShadow: "0 10px 35px rgba(15, 23, 42, 0.07)",
        }}
      >
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Register as Patient
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
          Book home nursing / physio services quickly.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: 4 }}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 4 }}>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              type="email"
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 4 }}>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              type="password"
              required
            />
          </div>

          {err && <p style={{ color: "red" }}>{err}</p>}
          {msg && <p style={{ color: "green" }}>{msg}</p>}

          <button type="submit" style={primaryBtn}>
            Register
          </button>
        </form>

        <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
          Are you a nurse / physiotherapist?{" "}
          <a href="/register-professional" style={{ color: "#2563eb" }}>
            Register as professional
          </a>
        </p>
      </div>
    </Layout>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  padding: "0.6rem 0.8rem",
  outline: "none",
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
