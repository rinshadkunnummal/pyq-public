import { PrismaClient, Stage } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const subjects = [
    { name: 'ADB', stage: Stage.DEGREE, year: 1 },
    { name: 'English', stage: Stage.DEGREE, year: 1 },
    { name: 'Fiqh', stage: Stage.DEGREE, year: 1 },

    { name: 'ADB', stage: Stage.DEGREE, year: 2 },
    { name: 'English', stage: Stage.DEGREE, year: 2 },

    { name: 'ADB', stage: Stage.PG, year: 1 },
  ]

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: {
        stage_year_name: {
          stage: subject.stage,
          year: subject.year,
          name: subject.name,
        },
      },
      update: {},
      create: subject,
    })
  }

  console.log('🌱 Seeded subjects')
}

main()
  .finally(() => prisma.$disconnect())