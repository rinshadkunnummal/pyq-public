import { createBrowserRouter } from "react-router-dom";
import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/student/Home";
import Submit from "./pages/student/Submit";
import About from "./pages/student/About";
import Login from "./pages/admin/Login";
import SubjectPage from "./pages/student/SubjectPage";
import ClassPage from "./pages/student/ClassPage";
import PaperPage from "./pages/student/PaperPage";
// import Papers from "./pages/student/Papers";
import Approved from "./pages/admin/Approved";
import AdminDashboard from "./pages/admin/Dashboard";
import Pending from "./pages/admin/Pending";
import AdminPapers from "./pages/admin/AdminPapers";
import ProtectedRoute from "./auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <StudentLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/exam/:exam", element: <ClassPage /> },
      { path: "/exam/:exam/:class", element: <SubjectPage /> },
      { path: '/exam/:exam/:class/:subject', element: <PaperPage /> },
      { path: "submit", element: <Submit /> },
      // { path: "papers", element: <Papers /> },
      { path: "about", element: <About /> },
      // Catches broken student links inside StudentLayout
      { path: "*", element: <NotFound /> } 
    ],
  },
  { path: "/admin/login", element: <Login /> },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "papers", element: <AdminPapers /> },
          { path: "pending", element: <Pending /> },
          { path: "approved", element: <Approved /> },
          // Catches broken admin links inside AdminLayout
          { path: "*", element: <NotFound /> } 
        ],
      },
    ],
  },
  // Global fallback if someone types a completely wrong top-level path
  { path: "*", element: <NotFound /> }, 
]);