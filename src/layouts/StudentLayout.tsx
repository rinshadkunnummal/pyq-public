import { Outlet } from "react-router-dom";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";

function StudentLayout() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default StudentLayout;