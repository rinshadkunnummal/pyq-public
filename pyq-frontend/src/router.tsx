// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/student/Home";
import Submit from "./pages/student/Submit";
import Login from "./pages/admin/Login";
import Papers from "./pages/student/Papers";
import Approved from "./pages/admin/Approved"
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
      { path: "submit", element: <Submit /> },
      { path: "papers", element: <Papers /> },
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
          { index: true, element: <Pending /> },
          { path: "adminpapers", element: <AdminPapers /> },
          { path: "approved", element: <Approved /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);