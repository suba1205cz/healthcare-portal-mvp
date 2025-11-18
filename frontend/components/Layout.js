import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar with Subaa Care – same weight as hero heading */}
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-semibold">
              S
            </div>
            <div>
              {/* Make this big & strong */}
              <div className="text-3xl font-bold leading-tight">
                Subaa Care
              </div>
              <div className="text-sm text-slate-600 -mt-1">
                We care those who you care
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="/">Home</Link>
             <Link href="/register-professional">Join as professional</Link>


            {!user && (
              <>
                <Link href="/register">Register</Link>
                <Link
                  href="/login"
                  className="px-3 py-1 rounded-full bg-blue-600 text-white"
                >
                  Sign in
                </Link>
              </>
            )}

            {user && (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <button
                  onClick={logout}
                  className="px-3 py-1 rounded-full bg-gray-200"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Page body */}
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
