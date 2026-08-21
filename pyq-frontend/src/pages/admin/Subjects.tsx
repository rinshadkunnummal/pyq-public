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

export default function SubjectsAdmin() {
  const [classes, setClasses] = useState<any[]>([])
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [classId, setClassId] = useState("")

  useEffect(() => {
    fetch(`${API}/api/admin/classes`)
      .then((r) => r.json())
      .then(setClasses)
  }, [])

  async function createSubject() {
    await fetch(`${API}/api/admin/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        code,
        classId,
      }),
    })

    setName("")
    setCode("")
  }

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Subject</h1>
        <p className="text-muted-foreground mt-2">
          Add a subject to a specific class.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <Input
            placeholder="Subject name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Subject code (ADB)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />

          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>

            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} ({cls.examType?.name || "Exam"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={createSubject} className="w-full">
            Create Subject
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}