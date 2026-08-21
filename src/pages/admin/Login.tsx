import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ShieldCheck, Lock, User } from "lucide-react"

import { useAuth } from "../../auth/AuthContext"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const success = login(username, password)

    if (success) {
      navigate("/admin")
    } else {
      setError("Invalid username or password")
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 px-4 py-12">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.06),transparent_40%)]" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <Badge variant="secondary">Secure admin access</Badge>
        </div>

        <Card className="overflow-hidden rounded-3xl border-zinc-200 shadow-sm">
          <CardHeader className="space-y-2 pb-6 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              PyQ Admin
            </CardTitle>

            <CardDescription className="text-zinc-500">
              Sign in to review and manage question paper submissions.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-zinc-700"
                >
                  Username
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="h-11 pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 pl-9"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="h-11 w-full rounded-xl font-medium"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 border-t pt-4 text-center">
              <p className="text-xs leading-5 text-zinc-500">
                This area is restricted to authorized administrators only.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}