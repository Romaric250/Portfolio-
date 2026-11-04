import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();

  if (!email || !passwordHash) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set in the environment.");
    process.exit(1);
  }

  const user = await prisma.adminUser.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      name: "Romaric Lonfonyuy",
    },
    update: {
      passwordHash,
    },
  });

  console.log(`Admin user ready: ${user.email} (${user.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
