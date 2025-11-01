import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>
      {/* topbar */}
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "0.7rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "9999px",
              background: "#2563eb",
              display: "grid",
              placeItems: "center",
              color: "white",
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
              Subaa Care
            </div>
            <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>
              We care for those you care 💙
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: "1.25rem", fontSize: "0.9rem" }}>
          <Link href="/">Home</Link>
          <Link href="/register-professional">Join as professional</Link>
          <Link href="/register">Register</Link>
          <Link href="/login" style={{ fontWeight: 600 }}>
            Sign in
          </Link>
        </nav>
      </header>

      <main style={{ padding: "1.5rem" }}>{children}</main>
    </div>
  );
}
