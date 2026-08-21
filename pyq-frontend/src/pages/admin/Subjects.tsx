import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent } from "../../components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

const API = ""

type ClassItem = {
  id: string
  name: string
  examType?: {
    name: string
  }
}

export default function SubjectsAdmin() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [classId, setClassId] = useState("")

  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true)

        const response = await fetch(`${API}/api/admin/classes`)

        if (!response.ok) {
          throw new Error("Failed to load classes")
        }

        const data = await response.json()
        setClasses(data)
      } catch (error) {
        console.error("Failed to load classes:", error)
      } finally {
        setLoading(false)
      }
    }

    loadClasses()
  }, [])

  async function createSubject() {
    if (!name.trim() || !code.trim() || !classId) {
      return
    }

    try {
      setCreating(true)

      const response = await fetch(`${API}/api/admin/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim(),
          classId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subject")
      }

      setName("")
      setCode("")
      setClassId("")
    } catch (error) {
      console.error("Failed to create subject:", error)
    } finally {
      setCreating(false)
    }
  }

  const isValid = name.trim() && code.trim() && classId

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create Subject
        </h1>

        <p className="mt-2 text-muted-foreground">
          Add a subject to a specific class.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <Input
            placeholder="Subject name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <Input
            placeholder="Subject code (ADB)"
            value={code}
            onChange={(event) =>
              setCode(event.target.value.toUpperCase())
            }
          />

          <Select
            value={classId}
            onValueChange={(value) => setClassId(value ?? "")}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loading ? "Loading classes..." : "Select class"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} ({cls.examType?.name || "Exam"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={createSubject}
            disabled={!isValid || creating}
            className="w-full"
          >
            {creating ? "Creating..." : "Create Subject"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}