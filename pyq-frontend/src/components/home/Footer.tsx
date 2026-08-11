import { Link } from "react-router-dom"
import { BookOpen, Mail, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-zinc-900">PyQ</p>
                <p className="text-sm text-zinc-500">
                  Previous Year Question Papers
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-zinc-600">
              A community-driven library of approved question papers for
              Secondary, Senior Secondary, Degree, and PG students.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="font-medium text-zinc-900">Explore</p>

            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              <li>
                <Link to="/papers" className="hover:text-zinc-900 transition-colors">
                  Browse papers
                </Link>
              </li>

              <li>
                <Link to="/upload" className="hover:text-zinc-900 transition-colors">
                  Upload a paper
                </Link>
              </li>

              <li>
                <Link to="/admin/login" className="hover:text-zinc-900 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="font-medium text-zinc-900">Connect</p>

            <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-600">
              <a
                href="mailto:hello@pyq.app"
                className="inline-flex items-center gap-2 hover:text-zinc-900 transition-colors"
              >
                <Mail className="h-4 w-4" />
                hello@pyq.app
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} PyQ. All rights reserved.</p>

          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="h-4 w-4 fill-current text-zinc-400" />
            <span>for students</span>
          </div>
        </div>
      </div>
    </footer>
  )
}