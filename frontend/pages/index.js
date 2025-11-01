import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [filteredByAvailability, setFilteredByAvailability] = useState(false);

  // logged-in user (from localStorage)
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("subaacare-user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.warn("bad user in storage");
        }
      }
    }
  }, []);

  const buildISO = (d, t) => {
    const iso = new Date(`${d}T${t}:00`);
    return iso.toISOString();
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/professionals`);
      setProfessionals(res.data || []);
      setFilteredByAvailability(false);
    } catch (err) {
      console.error("fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSearch = async () => {
    // availability search
    if (date && time) {
      const startISO = buildISO(date, time);
      const endISO = new Date(
        new Date(startISO).getTime() + 60 * 60 * 1000
      ).toISOString(); // +1 hour

      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/professionals/search`, {
          params: {
            start: startISO,
            end: endISO,
            q: search || "",
          },
        });
        setProfessionals(res.data || []);
        setFilteredByAvailability(true);
      } catch (err) {
        console.error("availability search failed", err);
      } finally {
        setLoading(false);
      }
      return;
    }

    // normal search
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/professionals`, {
        params: { q: search || "" },
      });
      setProfessionals(res.data || []);
      setFilteredByAvailability(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("subaacare-user");
      window.localStorage.removeItem("subaacare-token");
      setUser(null);
    }
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 4px 18px rgba(15, 23, 42, 0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>
      {/* ====== TOP BAR (restored) ====== */}
      <div
        style={{
          width: "100%",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          {/* left: logo + tagline */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "9999px",
                background: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              S
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "15px" }}>
                Subaa Care
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                We care those who you care
              </div>
            </div>
          </div>

          {/* right: links */}
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <a href="/" style={{ fontSize: "13px", color: "#0f172a" }}>
              Home
            </a>
            <a
              href="/register-professional"
              style={{ fontSize: "13px", color: "#0f172a" }}
            >
              Join as professional
            </a>
            {!user ? (
              <>
                <a
                  href="/register"
                  style={{ fontSize: "13px", color: "#0f172a" }}
                >
                  Register
                </a>
                <a
                  href="/login"
                  style={{
                    fontSize: "13px",
                    background: "#2563eb",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: "9999px",
                  }}
                >
                  Sign in
                </a>
              </>
            ) : (
              <>
                <span style={{ fontSize: "13px" }}>👋 {user.name}</span>
                <button
                  onClick={handleLogout}
                  style={{
                    fontSize: "13px",
                    background: "#e2e8f0",
                    border: "none",
                    padding: "5px 12px",
                    borderRadius: "9999px",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ====== PAGE CONTENT ====== */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
        {/* hero */}
        <div
          style={{
            background: "rgba(210, 226, 255, 0.8)",
            borderRadius: "28px",
            padding: "32px 36px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            marginTop: "8px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: 600,
                marginBottom: "6px",
                color: "#102a43",
              }}
            >
              Find Home Nursing &amp; Physiotherapy
            </h1>
            <p style={{ color: "#475569" }}>
              Book verified professionals near you. Kerala, TN, KA — and expats
              abroad.
            </p>
          </div>
          <div
            style={{
              width: "180px",
              height: "110px",
              border: "2px dashed #cbd5f5",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            patient-care image
          </div>
        </div>

        {/* filters */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialty, location..."
            style={{
              flex: 1,
              minWidth: "220px",
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #d4d4d4",
              background: "#ffffff",
            }}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #d4d4d4",
              background: "#ffffff",
            }}
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #d4d4d4",
              background: "#ffffff",
            }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #d4d4d4",
              background: "#ffffff",
            }}
          >
            <option value="all">All categories</option>
            <option value="Nurse">Nurse</option>
            <option value="Physiotherapist">Physiotherapist</option>
          </select>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #d4d4d4",
              background: "#ffffff",
            }}
          >
            <option value="all">All (India + others)</option>
            <option value="Kerala">Kerala</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Chennai">Chennai</option>
            <option value="Bengaluru">Bengaluru</option>
          </select>

          <button
            onClick={handleSearch}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 18px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Search
          </button>
        </div>

        {filteredByAvailability && (
          <p style={{ color: "#166534", marginBottom: "10px" }}>
            Showing professionals free at {date} {time} (1 hour slot)
          </p>
        )}

        {/* list */}
        {loading ? (
          <p>Loading professionals…</p>
        ) : professionals.length === 0 ? (
          <p>No professionals found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {professionals
              .filter((p) => {
                let ok = true;
                if (category !== "all") {
                  ok =
                    (p.specialties || "")
                      .toLowerCase()
                      .includes(category.toLowerCase());
                }
                if (ok && region !== "all") {
                  ok =
                    (p.location || "")
                      .toLowerCase()
                      .includes(region.toLowerCase());
                }
                return ok;
              })
              .map((p) => (
                <div key={p.id} style={cardStyle}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "9999px",
                        background: "#2563eb",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                      }}
                    >
                      {(p.user?.name || p.name || "U")
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#102a43" }}>
                        {p.user?.name || p.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {p.location || "India"}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <span style={{ fontWeight: 600 }}>Specialties: </span>
                    {p.specialties || "Not specified"}
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    From{" "}
                    <span style={{ fontWeight: 600 }}>
                      {p.hourlyRate ? p.hourlyRate : "800"}
                    </span>{" "}
                    per hour
                  </div>
                  <a
                    href={`/professionals/${p.id}`}
                    style={{ color: "#2563eb", fontSize: "13px", fontWeight: 500 }}
                  >
                    View &amp; Book →
                  </a>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
