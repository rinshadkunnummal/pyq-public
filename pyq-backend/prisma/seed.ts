import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SUBJECTS = [
  { code: 'ADB', name: 'ADB' },
  { code: 'ENG', name: 'English' },
  { code: 'FIQ', name: 'Fiqh' },
  { code: 'HDS', name: 'Hadith' },
  { code: 'HUM', name: 'Humanities' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'MATHS', name: 'Mathematics' },
  { code: 'MLM', name: 'Malayalam' },
  { code: 'NHV', name: 'NHV' },
  { code: 'SCN', name: 'Science' },
  { code: 'T&C', name: 'Tafsir & Composition' },
]

async function createExam(exam: { name: string; slug: string }) {
  return prisma.examType.upsert({
    where: { slug: exam.slug },
    update: {},
    create: {
      name: exam.name,
      slug: exam.slug,
    },
  })
}

async function seedClasses(examId: string) {
  for (let i = 1; i <= 10; i++) {
    const classLevel = await prisma.classLevel.upsert({
      where: {
        examTypeId_slug: {
          examTypeId: examId,
          slug: String(i),
        },
      },
      update: {},
      create: {
        label: String(i),
        slug: String(i),
        examTypeId: examId,
      },
    })

    for (const subject of SUBJECTS) {
      await prisma.subject.upsert({
        where: {
          classLevelId_code: {
            classLevelId: classLevel.id,
            code: subject.code,
          },
        },
        update: {},
        create: {
          code: subject.code,
          name: subject.name,
          classLevelId: classLevel.id,
        },
      })
    }
  }
}

async function main() {
  console.log('🌱 Seeding database...')

  const annual = await createExam({
    name: 'Annual',
    slug: 'annual',
  })

  const halfYearly = await createExam({
    name: 'Half Yearly',
    slug: 'half-yearly',
  })

  await seedClasses(annual.id)
  await seedClasses(halfYearly.id)

  console.log('✅ Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })