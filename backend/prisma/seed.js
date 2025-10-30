const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hashed = await require('bcryptjs').hash('password', 10);
  const profUser = await prisma.user.create({ data: { name: 'Dr. Alice Physio', email: 'alice@demo.com', password: hashed, role: 'PROFESSIONAL' } });
  const profile = await prisma.profile.create({ data: { userId: profUser.id, bio: 'Experienced physiotherapist', specialties: 'physiotherapy,back pain', location: 'Brno', hourlyRate: 25 } });

  const now = new Date();
  await prisma.availability.createMany({ data: [
    { profileId: profile.id, start: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 9,0), end: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 10,0) },
    { profileId: profile.id, start: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 10,30), end: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 11,30) }
  ]});

  console.log('Seed complete');
}

main().catch(e => console.error(e)).finally(() => process.exit());
