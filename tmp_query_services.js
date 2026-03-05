const { PrismaClient } = require('./app/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany({ where: { businessId: 2 } });
  console.log(JSON.stringify(services, null, 2));
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
