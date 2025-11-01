import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");
  const [date, setDate] = useState("");        // yyyy-mm-dd
  const [time, setTime] = useState("");        // hh:mm
  const [filteredByAvailability, setFilteredByAvailability] = useState(false);

  // small helper to build date-time in ISO
  const buildISO = (d, t) => {
    // t = "10:00"
    // we’ll treat entered time as local and convert to ISO
    const iso = new Date(`${d}T${t}:00`);
    return iso.toISOString();
  };

  // load ALL professionals (default)
  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/professionals`);
      setProfessionals(res.data || []);
      setFilteredByAvailability(false);
    } catch (err) {
      console.error("fetch professionals failed", err);
    } finally {
      setLoading(false);
    }
  };

  // first load
  useEffect(() => {
    loadAll();
  }, []);

  // when user clicks “Search” or changes filters
  const handleSearch = async () => {
    // if date and time given → call /search
    if (date && time) {
      const startISO = buildISO(date, time);
      // we’ll assume 1 hour slot for now
      const endISO = new Date(new Date(startISO).getTime() + 60 * 60 * 1000).toISOString();

      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE}/api/professionals/search`,
          {
            params: {
              start: startISO,
              end: endISO,
              q: search || "",
            },
          }
        );
        setProfessionals(res.data || []);
        setFilteredByAvailability(true);
      } catch (err) {
        console.error("availability search failed", err);
      } finally {
        setLoading(false);
      }
      return;
    }

    // otherwise → normal list with text filter
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

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* top bar is in layout.js now so we just render body */}
      <main className="max-w-6xl mx-auto py-6 px-4">
        {/* hero */}
        <div className="bg-[#e5f0ff] rounded-3xl px-10 py-10 flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-[#102a43] mb-2">
              Find Home Nursing &amp; Physiotherapy
            </h1>
            <p className="text-[#475569]">
              Book verified professionals near you. Kerala, TN, KA — and expats abroad.
            </p>
          </div>
          <div className="w-48 h-28 rounded-2xl border-2 border-dashed border-[#cbd5f5] flex items-center justify-center text-sm text-[#94a3b8] text-center">
            patient-care image
          </div>
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialty, location..."
            className="flex-1 min-w-[220px] border rounded-lg px-3 py-2 bg-white"
          />

          {/* date */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white"
          />

          {/* time */}
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white"
          >
            <option value="all">All categories</option>
            <option value="Nurse">Nurse</option>
            <option value="Physiotherapist">Physiotherapist</option>
          </select>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white"
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
            className="bg-[#2563eb] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#1d4ed8]"
          >
            Search
          </button>
        </div>

        {filteredByAvailability && (
          <p className="text-sm text-green-700 mb-3">
            Showing professionals who are free at {date} {time} (1 hour slot)
          </p>
        )}

        {/* list */}
        {loading ? (
          <p>Loading professionals…</p>
        ) : professionals.length === 0 ? (
          <p>No professionals found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {professionals
              .filter((p) => {
                // apply local filters (category / region)
                let ok = true;
                if (category !== "all") {
                  // we didn’t store category on profile, so we check specialties text
                  ok =
                    p.specialties?.toLowerCase().includes(category.toLowerCase()) ||
                    p.user?.role === "PROFESSIONAL";
                }
                if (ok && region !== "all") {
                  ok =
                    p.location?.toLowerCase().includes(region.toLowerCase());
                }
                return ok;
              })
              .map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-semibold">
                      {(p.user?.name || p.name || "U").slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-semibold text-[#102a43]">
                        {p.user?.name || p.name}
                      </h2>
                      <p className="text-xs text-[#94a3b8]">
                        {p.location || "India"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold">Specialties:</span>{" "}
                    {p.specialties || "Not specified"}
                  </p>
                  <p className="text-sm">
                    From{" "}
                    <span className="font-semibold">
                      {p.hourlyRate ? p.hourlyRate : "800"}
                    </span>{" "}
                    per hour
                  </p>
                  <a
                    href={`/professionals/${p.id}`}
                    className="text-[#2563eb] text-sm font-medium"
                  >
                    View &amp; Book →
                  </a>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
