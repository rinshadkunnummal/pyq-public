import { BookOpen, CheckCircle2, Users, ShieldCheck, Sparkles } from "lucide-react"

import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"

const values = [
  {
    icon: CheckCircle2,
    title: "Quality first",
    description:
      "Every paper is reviewed before it becomes available to students.",
  },
  {
    icon: Users,
    title: "Community driven",
    description:
      "Students and teachers can contribute missing papers and improve the library.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable access",
    description:
      "Download papers quickly without clutter, ads, or unnecessary distractions.",
  },
]

export default function About() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-white px-6 py-16 shadow-sm sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.06),transparent_40%)]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-5 gap-1">
            <Sparkles className="h-3 w-3" />
            About PyQ
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            A simpler way to access previous year question papers
          </h1>

          <p className="mt-5 text-lg leading-8 text-zinc-600">
            PyQ is a community-driven library of approved question papers for
            Secondary, Senior Secondary, Degree, and PG students. Our goal is to
            make exam preparation faster, cleaner, and more accessible.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
            <BookOpen className="h-6 w-6 text-zinc-700" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            Our mission
          </h2>

          <p className="mt-4 text-zinc-600 leading-7">
            Students often spend more time searching for question papers than
            actually practicing them. PyQ brings approved papers into one place,
            organized by stage, level, subject, exam type, and year.
          </p>

          <p className="mt-4 text-zinc-600 leading-7">
            Whether you are preparing for unit tests, half-yearly exams, annual
            examinations, or university papers, the goal is the same: fewer
            distractions, faster access, and better preparation.
          </p>
        </div>

        <Card className="rounded-3xl border-zinc-200 shadow-sm">
          <CardContent className="p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-3xl font-bold text-zinc-900">100%</p>
                <p className="text-sm text-zinc-500 mt-1">Approved papers only</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-zinc-900">4</p>
                <p className="text-sm text-zinc-500 mt-1">Academic stages</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-zinc-900">Fast</p>
                <p className="text-sm text-zinc-500 mt-1">Instant downloads</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-zinc-900">Free</p>
                <p className="text-sm text-zinc-500 mt-1">For all students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Values */}
      <section>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            What we care about
          </h2>

          <p className="mt-3 text-zinc-600 leading-7">
            The platform is designed around a few simple principles that keep the
            experience useful for students.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon

            return (
              <Card key={value.title} className="rounded-3xl border-zinc-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100">
                    <Icon className="h-5 w-5 text-zinc-700" />
                  </div>

                  <h3 className="font-semibold text-zinc-900">{value.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            How PyQ works
          </h2>

          <p className="mt-3 text-zinc-600 leading-7">
            A simple workflow keeps the library organized and trustworthy.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Upload",
              desc: "Students or teachers submit a question paper.",
            },
            {
              step: "02",
              title: "Review",
              desc: "Admins verify the details and approve the paper.",
            },
            {
              step: "03",
              title: "Download",
              desc: "The paper becomes available for everyone to access.",
            },
          ].map((item) => (
            <div key={item.step} className="space-y-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                {item.step}
              </div>

              <h3 className="font-semibold text-zinc-900">{item.title}</h3>

              <p className="text-sm leading-6 text-zinc-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
          Built for students, not distractions
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-zinc-600 leading-7">
          PyQ is intentionally minimal: fast search, clear filters, approved
          papers, and instant downloads. The focus is on helping students spend
          more time learning and less time searching.
        </p>
      </section>
    </div>
  )
}