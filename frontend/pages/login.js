// frontend/pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "../components/Layout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("test@example.com"); // for quick tests
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      // backend returns { token, user }
      const { token, user } = res.data || {};

      if (!token || !user) {
        setMessage("Login failed: no token/user in response");
        return;
      }

      // 👇 THIS is the part that makes the navbar know who you are
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("user", JSON.stringify(user));
      }

      setMessage("Login successful. Redirecting…");
      // force reload so Layout re-reads localStorage
      router.push("/");
    } catch (err) {
      console.error("LOGIN ERROR", err?.response?.data || err.message);
      setMessage(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Login failed"
      );
    }
  }

  return (
    <Layout>
      <div
        style={{
          maxWidth: 480,
          margin: "2rem auto",
          background: "white",
          borderRadius: "1rem",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Sign in</h1>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.85rem" }}>
          <div>
            <label style={{ fontSize: "0.8rem" }}>Email</label>
            <input
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div>
            <label style={{ fontSize: "0.8rem" }}>Password</label>
            <input
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.6rem",
              padding: "0.55rem 0",
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
              marginTop: "0.7rem",
              color: message.startsWith("Login successful") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}

        <p style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
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
  padding: "0.35rem 0.55rem",
  fontSize: "0.9rem",
};
