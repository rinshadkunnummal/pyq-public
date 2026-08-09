'use client'

import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { createAppRouter } from '@/routes'

export default function App() {
  const [router, setRouter] = useState<ReturnType<typeof createAppRouter> | null>(null)

  useEffect(() => {
    setRouter(createAppRouter())
  }, [])

  if (!router) {
    return null
  }

  return <RouterProvider router={router} />
}