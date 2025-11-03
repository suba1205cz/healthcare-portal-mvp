import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfessionalDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [pro, setPro] = useState(null);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`${API_URL}/api/professionals/${id}`).then((res) => {
      setPro(res.data);
    });
  }, [id]);

  async function handleBook() {
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setError("Please login first.");
        return;
      }
      const res = await axios.post(
        `${API_URL}/api/bookings`,
        {
          professionalId: Number(id),
          start: new Date().toISOString(),
          end: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBooking(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Booking failed.");
    }
  }

  if (!pro) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>{pro.user?.name}</h1>
      <p>{pro.bio}</p>
      <p>{pro.location}</p>
      <p>{pro.specialties}</p>
      <button onClick={handleBook}>Book</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {booking && <p style={{ color: "green" }}>Booked! ID: {booking.id}</p>}
    </div>
  );
}
