const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  // 1) Create a PROFESSIONAL user (the nurse/physio)
  const hashed = await bcrypt.hash('password', 10);

  const profUser = await prisma.user.create({
    data: {
      name: 'Demo Nurse',
      email: 'nurse@example.com',
      password: hashed,
      role: 'PROFESSIONAL'
    }
  });

  // 2) Create their provider profile
  const profile = await prisma.profile.create({
    data: {
      userId: profUser.id,
      specialties: 'Home nursing, elderly care, post-operative care',
      location: 'Kochi, Kerala',
      bio: 'Experienced home nurse helping patients with post-surgery and elderly care at home.',
      hourlyRate: 500,          // you can adjust
      experienceYears: 8,
      languages: 'English, Malayalam',
      verified: true
    }
  });

  // 3) Add two availability slots for tomorrow
  const now = new Date();
  const tomorrow10 = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    10,
    0
  );
  const tomorrow1130 = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    11,
    30
  );

  await prisma.availability.createMany({
    data: [
      {
        profileId: profile.id,
        start: tomorrow10,
        end: new Date(tomorrow10.getTime() + 60 * 60 * 1000) // +1 hour
      },
      {
        profileId: profile.id,
        start: tomorrow1130,
        end: new Date(tomorrow1130.getTime() + 60 * 60 * 1000) // +1 hour
      }
    ]
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
