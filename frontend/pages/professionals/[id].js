import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ProfilePage(){
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);

  useEffect(()=>{ if(id) axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/professionals/' + id).then(r=>setProfile(r.data)); }, [id]);

  if(!profile) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1>{profile.user.name}</h1>
      <p>{profile.bio}</p>
      <p>Specialties: {profile.specialties}</p>
      <p>Location: {profile.location}</p>
      <button onClick={() => alert('Booking flow will open (demo)')}>Book a slot</button>
    </div>
  );
}
