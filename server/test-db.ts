import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const anunt = await prisma.announcement.create({
    data: {
      title: "Anunț Test Aiven",
      content: "Acest anunț este trimis direct prin cod în cloud.",
      category: "General",
      isPublished: true,
      authorId: 1 // Asigură-te că userul cu ID 1 există (l-am văzut în pozele tale)
    }
  })
  console.log("Succes! Anunțul a fost creat:", anunt)
}

main().catch(console.error).finally(() => prisma.$disconnect())