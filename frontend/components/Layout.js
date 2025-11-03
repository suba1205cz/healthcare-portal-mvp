// frontend/components/Layout.js
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    }
  }, []);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    // just reload to reset UI
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      {/* top bar */}
      <header className="w-full bg-white border-b flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#165DFF] text-white flex items-center justify-center font-semibold">
            S
          </div>
          <div>
            <div className="font-semibold text-sm">Subaa Care</div>
            <div className="text-xs text-gray-500">We care those who you care</div>
          </div>
        </div>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/">Home</Link>
          <Link href="/register-professional">Join as professional</Link>
          <Link href="/register">Register</Link>

          {/* ✅ show only for admin */}
          {user?.role === "ADMIN" && (
            <Link href="/admin/pending" className="text-blue-600 font-medium">
              Admin
            </Link>
          )}

          {user ? (
            <>
              <span className="flex items-center gap-1 text-sm">
                <span role="img" aria-label="wave">👋</span> {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-[#165DFF] text-white px-4 py-1 rounded-full text-sm"
            >
              Sign in
            </Link>
          )}
        </nav>
      </header>

      {/* page content */}
      <main className="max-w-6xl mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
