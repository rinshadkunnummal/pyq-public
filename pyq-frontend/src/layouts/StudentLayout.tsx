import { Link, Outlet } from "react-router-dom";

function StudentLayout() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="border-b border-zinc-200">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            PyQ
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-600">
            <Link to="/" className="hover:text-zinc-900 transition-colors">
              Browse
            </Link>
            <Link to="/submit" className="hover:text-zinc-900 transition-colors">
              Submit
            </Link>
            <Link to="/papers" className="hover:text-zinc-900 transition-colors">
              Papers
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-200 mt-20">
        <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-zinc-500">
          PyQ — Previous Year Question Papers
        </div>
      </footer>
    </div>
  );
}

export default StudentLayout;