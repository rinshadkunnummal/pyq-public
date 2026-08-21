import { createBrowserRouter } from "react-router-dom"

import StudentLayout from "./layouts/StudentLayout"
import AdminLayout from "./layouts/AdminLayout"

import Home from "./pages/Home"
import Submit from "./pages/Submit"
import About from "./pages/About"

import Stages from "./pages/Stage"
import Subjects from "./pages/Subjects"
import Papers from "./pages/Papers"

import Login from "./pages/admin/Login"
import SubjectsAdmin from "./pages/admin/Subjects"
import Approved from "./pages/admin/Approved"
import AdminDashboard from "./pages/admin/Dashboard"
import Pending from "./pages/admin/Pending"
import AdminPapers from "./pages/admin/AdminPapers"

import ProtectedRoute from "./auth/ProtectedRoute"
import NotFound from "./pages/NotFound"

export const router = createBrowserRouter([
  /*
   * ============================================================
   * STUDENT
   * ============================================================
   */

  {
    path: "/",
    element: <StudentLayout />,

    children: [
      // Home
      {
        index: true,
        element: <Home />,
      },

      // Submit a paper
      {
        path: "submit",
        element: <Submit />,
      },

      // About
      {
        path: "about",
        element: <About />,
      },

      /*
       * Stage
       *
       * /stage/degree
       * /stage/secondary
       * /stage/senior-secondary
       * /stage/pg
       */
      {
        path: "stage/:stage",
        element: <Stages />,
      },

      /*
       * Subjects
       *
       * /stage/degree/first-year
       * /stage/degree/second-year
       * /stage/pg/first-year
       */
      {
        path: "stage/:stage/:year",
        element: <Subjects />,
      },

      /*
       * Papers
       *
       * /stage/degree/first-year/:subject
       *
       * :subject is the Prisma Subject ID.
       */
      {
        path: "stage/:stage/:year/:subject",
        element: <Papers />,
      },

      /*
       * Student fallback
       */
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  /*
   * ============================================================
   * ADMIN LOGIN
   * ============================================================
   */

  {
    path: "/admin/login",
    element: <Login />,
  },

  /*
   * ============================================================
   * ADMIN
   * ============================================================
   */

  {
    path: "/admin",
    element: <AdminLayout />,

    children: [
      {
        element: <ProtectedRoute />,

        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },

          {
            path: "papers",
            element: <AdminPapers />,
          },

          {
            path: "subjects",
            element: <SubjectsAdmin />,
          },

          {
            path: "pending",
            element: <Pending />,
          },

          {
            path: "approved",
            element: <Approved />,
          },

          /*
           * Admin fallback
           */
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },

  /*
   * ============================================================
   * GLOBAL FALLBACK
   * ============================================================
   */

  {
    path: "*",
    element: <NotFound />,
  },
])