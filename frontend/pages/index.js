import axios from 'axios';
import { useState, useEffect } from 'react';
import ProfessionalCard from '../components/ProfessionalCard';

export default function Home() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);

  async function search() {
    const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/professionals', { params: { q } });
    setResults(res.data);
  }

  useEffect(() => { search(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Find Physiotherapists</h1>
      <div className="mb-4">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="search by specialty or location" />
        <button onClick={search}>Search</button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {results.map(p => <ProfessionalCard key={p.id} profile={p} />)}
      </div>
    </div>
  );
}
