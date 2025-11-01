import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "../components/Layout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      // save token + user
      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setMessage("Login successful. Redirecting…");
      // go home
      router.push("/");
    } catch (err) {
      console.error(err);
      setMessage("Login failed. Check email/password.");
    }
  }

  return (
    <Layout>
      <div
        style={{
          maxWidth: 400,
          margin: "0 auto",
          background: "white",
          padding: "1.5rem 1.5rem 1.2rem",
          borderRadius: "1rem",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>Sign in</h1>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem" }}>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem" }}>
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.55rem 0.6rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "0.8rem",
              fontSize: "0.8rem",
              color: message.startsWith("Login successful")
                ? "green"
                : "#b91c1c",
            }}
          >
            {message}
          </p>
        )}

        <p style={{ marginTop: "0.9rem", fontSize: "0.75rem" }}>
          New here? <a href="/register">Register as patient</a> or{" "}
          <a href="/register-professional">register as professional</a>
        </p>
      </div>
    </Layout>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  padding: "0.4rem 0.5rem",
  fontSize: "0.85rem",
};
