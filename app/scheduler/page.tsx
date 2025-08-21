"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Edit3, Save, X, Plus, Heart, Info, Trash2 } from "lucide-react"
import Link from "next/link"

export default function SchedulerPage() {
  const [editingMed, setEditingMed] = useState<number | null>(null)
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      times: ["8:00 AM", "8:00 PM"],
      instructions: "Take with food to reduce stomach upset",
      type: "Diabetes",
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      times: ["8:00 AM"],
      instructions: "Take at the same time each day",
      type: "Blood Pressure",
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      times: ["9:00 PM"],
      instructions: "Take in the evening, can be taken with or without food",
      type: "Cholesterol",
      color: "bg-purple-500",
    },
    {
      id: 4,
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      times: ["8:00 AM"],
      instructions: "Take with food or milk to prevent stomach irritation",
      type: "Heart Health",
      color: "bg-red-500",
    },
  ])

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const timeSlots = [
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
  ]

  const handleEditMedication = (id: number) => {
    setEditingMed(id)
  }

  const handleSaveMedication = () => {
    setEditingMed(null)
    // TODO: Save changes to backend
  }

  const handleCancelEdit = () => {
    setEditingMed(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary font-poppins">MediHelp</h1>
                <p className="text-sm text-muted-foreground">Medication Scheduler</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 font-poppins">Medication Schedule</h2>
          <p className="text-muted-foreground text-lg">Manage your daily medication routine</p>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="schedule">Schedule View</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          {/* Schedule View */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="grid gap-6">
              {/* Time-based Schedule */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="font-poppins">Today's Schedule</CardTitle>
                  <CardDescription>Your medication timeline for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeSlots.map((time) => {
                      const medsAtTime = medications.filter((med) => med.times.some((medTime) => medTime === time))

                      if (medsAtTime.length === 0) return null

                      return (
                        <div key={time} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="flex items-center justify-center w-20 h-12 bg-primary/10 rounded-lg">
                            <span className="font-semibold text-primary">{time}</span>
                          </div>
                          <div className="flex-1 space-y-2">
                            {medsAtTime.map((med) => (
                              <div
                                key={med.id}
                                className="flex items-center justify-between p-3 bg-card rounded-lg border"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full ${med.color}`} />
                                  <div>
                                    <h4 className="font-medium">{med.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {med.dosage} • {med.type}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline">{med.frequency}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Medications Management */}
          <TabsContent value="medications" className="space-y-6">
            <div className="grid gap-6">
              {medications.map((med) => (
                <Card key={med.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${med.color}`} />
                        <div>
                          <CardTitle className="font-poppins">{med.name}</CardTitle>
                          <CardDescription>
                            {med.dosage} • {med.type}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingMed === med.id ? (
                          <>
                            <Button size="sm" onClick={handleSaveMedication}>
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleEditMedication(med.id)}>
                              <Edit3 className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive bg-transparent">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingMed === med.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`name-${med.id}`}>Medication Name</Label>
                            <Input id={`name-${med.id}`} defaultValue={med.name} />
                          </div>
                          <div>
                            <Label htmlFor={`dosage-${med.id}`}>Dosage</Label>
                            <Input id={`dosage-${med.id}`} defaultValue={med.dosage} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`frequency-${med.id}`}>Frequency</Label>
                          <Input id={`frequency-${med.id}`} defaultValue={med.frequency} />
                        </div>
                        <div>
                          <Label htmlFor={`times-${med.id}`}>Times (comma separated)</Label>
                          <Input id={`times-${med.id}`} defaultValue={med.times.join(", ")} />
                        </div>
                        <div>
                          <Label htmlFor={`instructions-${med.id}`}>Instructions</Label>
                          <Textarea id={`instructions-${med.id}`} defaultValue={med.instructions} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Schedule</h4>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <strong>Frequency:</strong> {med.frequency}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {med.times.map((time, index) => (
                                  <Badge key={index} variant="secondary">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {time}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Instructions</h4>
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{med.instructions}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-poppins">Weekly Overview</CardTitle>
                <CardDescription>Your medication schedule for the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2">
                  <div className="p-2 font-medium text-center">Time</div>
                  {weekDays.map((day) => (
                    <div key={day} className="p-2 font-medium text-center bg-muted/50 rounded">
                      {day}
                    </div>
                  ))}

                  {timeSlots.slice(0, 10).map((time) => (
                    <>
                      <div key={time} className="p-2 text-sm font-medium text-center bg-muted/30 rounded">
                        {time}
                      </div>
                      {weekDays.map((day) => {
                        const medsAtTime = medications.filter((med) => med.times.some((medTime) => medTime === time))
                        return (
                          <div key={`${day}-${time}`} className="p-1 min-h-[60px] border rounded">
                            {medsAtTime.map((med) => (
                              <div key={med.id} className={`text-xs p-1 mb-1 rounded text-white ${med.color}`}>
                                {med.name}
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
