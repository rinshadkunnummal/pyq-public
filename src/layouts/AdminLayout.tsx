import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { LayoutDashboard, FileClock, CheckCircle2, LogOut, Files } from "lucide-react"

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Subjects",
      href: "/admin/subjects",
      icon: Files,
    },
    {
      label: "Pending",
      href: "/admin/pending",
      icon: FileClock,
    },
    {
      label: "Approved",
      href: "/admin/approved",
      icon: CheckCircle2,
    },
    {
      label: "Classes",
      href: "/admin/classes",
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">PyQ Admin</h1>
              <p className="text-xs text-muted-foreground">
                Previous Question Papers
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 md:block">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = location.pathname === item.href

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}

              <Separator className="my-3" />

              <p className="text-xs text-muted-foreground">
                Review and publish uploaded question papers.
              </p>
            </CardContent>
          </Card>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}