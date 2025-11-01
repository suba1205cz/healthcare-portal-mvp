// frontend/components/Layout.js
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);

  // read from localStorage when page loads (browser only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // bad json, ignore
        }
      }
    }
  }, []);

  function handleLogout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("token");
      window.location.href = "/"; // reload to home
    }
  }

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>
      {/* top bar */}
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* left: logo / name */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "9999px",
              background: "#2563eb",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>Subaa Care</div>
            <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>
              We care those who you care
            </div>
          </div>
        </div>

        {/* right: menu */}
        <nav style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <a href="/" style={linkStyle}>
            Home
          </a>
          <a href="/register-professional" style={linkStyle}>
            Join as professional
          </a>

          {!user ? (
            <>
              <a href="/register" style={linkStyle}>
                Register
              </a>
              <a
                href="/login"
                style={{
                  ...linkStyle,
                  padding: "0.3rem 0.7rem",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "0.5rem",
                }}
              >
                Sign in
              </a>
            </>
          ) : (
            <>
              <span style={{ fontSize: "0.8rem", color: "#374151" }}>
                👋 {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  border: "1px solid #e5e7eb",
                  background: "white",
                  borderRadius: "0.4rem",
                  padding: "0.25rem 0.7rem",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      {/* page content */}
      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "1.5rem 1rem" }}>
        {children}
      </main>
    </div>
  );
}

const linkStyle = {
  fontSize: "0.78rem",
  color: "#374151",
  textDecoration: "none",
};
