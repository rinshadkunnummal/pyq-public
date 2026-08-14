import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Folder, Pencil } from 'lucide-react'

import Breadcrumbs from '../../components/Breadcrumbs'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'

type Exam = {
  id: string
  name: string
  slug: string
}

type ClassLevel = {
  id: string
  name: string
  slug: string
  examTypeId: string
  examType?: Exam
}

const API = ''

export default function ClassesAdmin() {
  const [exams, setExams] = useState<Exam[]>([])
  const [classes, setClasses] = useState<ClassLevel[]>([])
  const [selectedExam, setSelectedExam] = useState('all')

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [examTypeId, setExamTypeId] = useState('')

  const [editing, setEditing] = useState<ClassLevel | null>(null)

  async function loadExams() {
    const res = await fetch(`${API}/api/admin/exams`)
    setExams(await res.json())
  }

  async function loadClasses() {
    const query =
      selectedExam !== 'all' ? `?exam=${selectedExam}` : ''

    const res = await fetch(`${API}/api/admin/classes${query}`)
    setClasses(await res.json())
  }

  useEffect(() => {
    loadExams()
  }, [])

  useEffect(() => {
    loadClasses()
  }, [selectedExam])

  async function createClass() {
    if (!name || !slug || !examTypeId) return

    const res = await fetch(`${API}/api/admin/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, examTypeId }),
    })

    if (res.ok) {
      setName('')
      setSlug('')
      setExamTypeId('')
      loadClasses()
    }
  }

  async function updateClass() {
    if (!editing) return

    await fetch(`${API}/api/admin/classes/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editing.name,
        slug: editing.slug,
      }),
    })

    setEditing(null)
    loadClasses()
  }

  async function deleteClass(id: string) {
    if (!confirm('Delete this class?')) return

    await fetch(`${API}/api/admin/classes/${id}`, {
      method: 'DELETE',
    })

    loadClasses()
  }

  const sortedClasses = useMemo(() => {
    return [...classes].sort(
      (a, b) => Number(a.slug) - Number(b.slug)
    )
  }, [classes])

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Classes' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Classes
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create, edit, and organize class folders for each exam type.
          </p>
        </div>

        <Select
          value={selectedExam}
          onValueChange={(value) => setSelectedExam(value ?? 'all')}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by exam" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All exams</SelectItem>
            {exams.map((exam) => (
              <SelectItem key={exam.slug} value={exam.slug}>
                {exam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Create class */}
      <Card>
        <CardHeader>
          <CardTitle>Create class</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-4">
          <Input
            placeholder="Class name (1)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Slug (1)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <Select
            value={examTypeId}
            onValueChange={(value) => setExamTypeId(value ?? '')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select exam" />
            </SelectTrigger>

            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={createClass}>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </CardContent>
      </Card>

      {/* Classes table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Classes</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage all class folders
            </p>
          </div>

          <Badge variant="secondary">
            {sortedClasses.length} classes
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Class</th>
                  <th className="px-6 py-3 text-left font-medium">Slug</th>
                  <th className="px-6 py-3 text-left font-medium">Exam</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedClasses.map((cls) => (
                  <tr
                    key={cls.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg border bg-muted p-2">
                          <Folder className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div>
                          <p className="font-medium">Class {cls.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Class folder
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      /{cls.slug}
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant="secondary">
                        {cls.examType?.name || 'Exam'}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger
                            onClick={() => setEditing(cls)}
                          >
                            <Button variant="outline" size="sm">
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit class</DialogTitle>
                            </DialogHeader>

                            {editing && (
                              <div className="space-y-4">
                                <Input
                                  value={editing.name}
                                  onChange={(e) =>
                                    setEditing({
                                      ...editing,
                                      name: e.target.value,
                                    })
                                  }
                                />

                                <Input
                                  value={editing.slug}
                                  onChange={(e) =>
                                    setEditing({
                                      ...editing,
                                      slug: e.target.value,
                                    })
                                  }
                                />

                                <Button
                                  className="w-full"
                                  onClick={updateClass}
                                >
                                  Save changes
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteClass(cls.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}