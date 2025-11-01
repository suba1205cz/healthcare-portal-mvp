const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const hashed = await bcrypt.hash('password', 10);

  // 1) make sure the professional user exists
  const profUser = await prisma.user.upsert({
    where: { email: 'alice@demo.com' },
    update: {}, // nothing to update now
    create: {
      name: 'Dr. Alice Physio',
      email: 'alice@demo.com',
      password: hashed,
      role: 'PROFESSIONAL',
    },
  });

  // 2) make sure the profile exists
  const profile = await prisma.profile.upsert({
    where: { userId: profUser.id },
    update: {
      bio: 'Experienced physiotherapist',
      specialties: 'physiotherapy,back pain',
      location: 'Brno',
      hourlyRate: 25,
    },
    create: {
      userId: profUser.id,
      bio: 'Experienced physiotherapist',
      specialties: 'physiotherapy,back pain',
      location: 'Brno',
      hourlyRate: 25,
    },
  });

  // 3) add an availability slot
  await prisma.availability.upsert({
    where: {
      // make a deterministic key so we don't create infinite rows
      id: 1,
    },
    update: {
      profileId: profile.id,
      start: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      end: new Date(Date.now() + 25 * 60 * 60 * 1000),
      isBooked: false,
    },
    create: {
      profileId: profile.id,
      start: new Date(Date.now() + 24 * 60 * 60 * 1000),
      end: new Date(Date.now() + 25 * 60 * 60 * 1000),
      isBooked: false,
    },
  });

  console.log('✅ Seed finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@healthcare.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@healthcare.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
