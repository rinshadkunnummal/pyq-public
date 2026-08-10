import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/admin" className="text-lg font-semibold tracking-tight">
            PyQ <span className="text-zinc-500 font-normal">Admin</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/admin" className="text-zinc-400 hover:text-white transition-colors">
              Pending
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-md bg-zinc-800 px-3 py-1.5 text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              Log out
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;