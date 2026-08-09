import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'
import Home from '@/pages/Home'
import Papers from '@/pages/Papers'
import PaperDetails from '@/pages/PaperDetails'
import Upload from '@/pages/Upload'
import Dashboard from '@/pages/admin/Dashboard'
import PendingPapers from '@/pages/admin/PendingPapers'

export function createAppRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'papers',
          element: <Papers />,
        },
        {
          path: 'papers/:id',
          element: <PaperDetails />,
        },
        {
          path: 'upload',
          element: <Upload />,
        },
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: 'papers',
          element: <PendingPapers />,
        },
      ],
    },
  ])
}