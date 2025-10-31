export default function Layout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f7fb",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT: logo + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* placeholder logo */}
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
            H
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>HealConnect (placeholder)</div>
            <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>
              Nursing & Physiotherapy on demand
            </div>
          </div>
        </div>

        {/* RIGHT: simple links */}
        <nav style={{ display: "flex", gap: "1rem", fontSize: "0.85rem" }}>
          <a href="/" style={{ color: "#374151", textDecoration: "none" }}>
            Home
          </a>
          <a href="/register-professional" style={{ color: "#374151", textDecoration: "none" }}>
            Join as professional
          </a>
          <a href="/register" style={{ color: "#2563eb", textDecoration: "none" }}>
            Register
          </a>
          <a href="/login" style={{ color: "#111827", textDecoration: "none", fontWeight: 500 }}>
            Sign in
          </a>
        </nav>
      </header>

      <main style={{ padding: "2.5rem 1.25rem" }}>{children}</main>

      <footer
        style={{
          textAlign: "center",
          color: "#9ca3af",
          fontSize: "0.7rem",
          padding: "1.5rem 0",
        }}
      >
        © {new Date().getFullYear()} HealConnect — placeholder. We will replace with your company.
      </footer>
    </div>
  );
}
