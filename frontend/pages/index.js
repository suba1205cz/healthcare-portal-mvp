import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// same list we used in register-professional
const INDIA_STATES = [
  "All (India + others)",
  "Kerala",
  "Tamil Nadu",
  "Karnataka",
  "Telangana",
  "Maharashtra",
  "Delhi",
];

export default function HomePage() {
  const [professionals, setProfessionals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [stateFilter, setStateFilter] = useState("All (India + others)");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${API_URL}/api/professionals`);
        // sort so newest shows first
        const list = (res.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProfessionals(list);
        setFiltered(list);
      } catch (err) {
        console.error("Failed to fetch professionals", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // whenever search/filter changes, re-filter
  useEffect(() => {
    let data = [...professionals];

    // text search
    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter((p) => {
        const name = p.user?.name?.toLowerCase() || "";
        const specs = p.specialties?.toLowerCase() || "";
        const loc = p.location?.toLowerCase() || "";
        return name.includes(s) || specs.includes(s) || loc.includes(s);
      });
    }

    // category filter (we don't store category yet, so we infer from specialties)
    if (category !== "ALL") {
      data = data.filter((p) => {
        const specs = (p.specialties || "").toLowerCase();
        if (category === "NURSE") {
          return specs.includes("nurse") || specs.includes("post-op");
        }
        if (category === "PHYSIO") {
          return specs.includes("physio") || specs.includes("therapy");
        }
        return true;
      });
    }

    // state filter — we check if location contains that word
    if (stateFilter !== "All (India + others)") {
      data = data.filter((p) =>
        (p.location || "").toLowerCase().includes(stateFilter.toLowerCase())
      );
    }

    setFiltered(data);
  }, [search, category, stateFilter, professionals]);

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* hero */}
        <div
          style={{
            background: "linear-gradient(135deg, #e0edff, #ffffff)",
            borderRadius: "1.25rem",
            padding: "1.6rem 1.8rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>
              Find Home Nursing & Physiotherapy
            </h1>
            <p style={{ color: "#4b5563" }}>
              Book verified professionals near you. Kerala, TN, KA — and expats abroad.
            </p>
          </div>
          {/* placeholder for image */}
          <div
            style={{
              width: 140,
              height: 90,
              background: "white",
              borderRadius: "1rem",
              border: "1px dashed #cbd5f5",
              display: "grid",
              placeItems: "center",
              color: "#9ca3af",
              fontSize: "0.7rem",
            }}
          >
            patient-care image
          </div>
        </div>

        {/* filters */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialty, location..."
            style={{
              flex: 3,
              minWidth: 220,
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              padding: "0.5rem 0.7rem",
              background: "white",
            }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={filterSelect}
          >
            <option value="ALL">All categories</option>
            <option value="NURSE">Nurses</option>
            <option value="PHYSIO">Physiotherapists</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            style={filterSelect}
          >
            {INDIA_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
            {/* for Brno etc */}
            <option value="Brno">Brno (CZ)</option>
          </select>
        </div>

        {/* list */}
        {loading ? (
          <p>Loading professionals…</p>
        ) : filtered.length === 0 ? (
          <p>No professionals found. Try another filter.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {filtered.map((pro) => (
              <ProfessionalCard key={pro.id} pro={pro} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function ProfessionalCard({ pro }) {
  const name = pro.user?.name || "Unnamed professional";
  const specialties = pro.specialties || "Not specified";
  const location = pro.location || "Not specified";

  return (
    <div
      style={{
        background: "white",
        borderRadius: "1rem",
        padding: "1rem",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "9999px",
            background: "#2563eb",
            color: "white",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>
            {location}
          </div>
        </div>
      </div>

      <div style={{ fontSize: "0.8rem", color: "#4b5563" }}>
        <strong>Specialties:</strong> {specialties}
      </div>

      {typeof pro.hourlyRate === "number" && pro.hourlyRate > 0 && (
        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
          From <strong>{pro.hourlyRate}</strong> per hour
        </div>
      )}

      <a
        href={`/professionals/${pro.id}`}
        style={{
          marginTop: "0.4rem",
          display: "inline-block",
          fontSize: "0.8rem",
          color: "#2563eb",
        }}
      >
        View & Book →
      </a>
    </div>
  );
}

const filterSelect = {
  flex: 1,
  minWidth: 160,
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  padding: "0.45rem 0.6rem",
  background: "white",
};
