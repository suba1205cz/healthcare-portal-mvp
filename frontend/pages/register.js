import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPatientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role: "PATIENT", // 👈 important
      });
      setSuccess("Registration successful. You can login now.");
      // router.push("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Register as Patient</h1>
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

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Are you a nurse / physiotherapist?{" "}
        <a href="/register-professional">Register as professional</a>
      </p>
    </div>
  );
}
