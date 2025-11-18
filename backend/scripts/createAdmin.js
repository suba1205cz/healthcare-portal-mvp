require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@subaacare.test';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const name = 'Platform Admin';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin user already exists with id', existing.id);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:');
  console.log('  Email:   ', email);
  console.log('  Password:', password);
  console.log('  User ID: ', user.id);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
