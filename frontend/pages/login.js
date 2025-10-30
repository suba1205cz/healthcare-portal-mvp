import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      // save token
      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      // go back to home
      router.push("/");
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Check email/password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Don&apos;t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
