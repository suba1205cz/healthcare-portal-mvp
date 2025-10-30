import Link from 'next/link';

export default function ProfessionalCard({ profile }) {
  return (
    <div className="border p-4 rounded">
      <h3 className="text-lg font-semibold">{profile.user.name}</h3>
      <p>{profile.bio}</p>
      <p>Specialties: {profile.specialties}</p>
      <p>Location: {profile.location}</p>
      <Link href={`/professionals/${profile.id}`}>View & Book</Link>
    </div>
  );
}
