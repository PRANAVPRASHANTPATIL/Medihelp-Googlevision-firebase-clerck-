"use client"

import { useState, useEffect } from "react"
import { useUser, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  Pill,
  FileText,
  Bell,
  Settings,
  Plus,
  Heart,
  Activity,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { NotificationPermissionDialog } from "@/components/notification-permission-dialog"
import { NotificationStatusBanner } from "@/components/notification-status-banner"
import { useNotifications } from "@/hooks/use-notifications"
import { PrescriptionUpload } from "@/components/prescription-upload"
import { AddMedicationDialog } from "@/components/add-medication-dialog"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  time: string
  instructions?: string
  type: string
  taken?: boolean
}

export default function DashboardPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [showAddMedicationDialog, setShowAddMedicationDialog] = useState(false)
  const [todayProgress, setTodayProgress] = useState(0)
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const { hasPermission, isLoading } = useNotifications()
  const { user } = useUser()

  const todayMedications = medications.map((med) => ({
    ...med,
    taken: false, // Default to not taken for new medications
  }))

  useEffect(() => {
    if (todayMedications.length > 0) {
      const takenCount = todayMedications.filter((med) => med.taken).length
      const progress = Math.round((takenCount / todayMedications.length) * 100)
      setTodayProgress(progress)
    } else {
      setTodayProgress(0)
    }
  }, [todayMedications])

  useEffect(() => {
    // Show notification dialog if user hasn't been asked before
    const hasBeenAsked = localStorage.getItem("notification-permission-asked")
    if (!isLoading && !hasPermission && !hasBeenAsked) {
      // Delay showing dialog to let page load
      const timer = setTimeout(() => {
        setShowNotificationDialog(true)
        localStorage.setItem("notification-permission-asked", "true")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasPermission, isLoading])

  const recentPrescriptions: any[] = []

  const handleUploadComplete = (result: any) => {
    console.log("Upload completed:", result)
    // Handle the OCR result - update medications, show success message, etc.
    // You can refresh the medication list or navigate to scheduler
  }

  const handleAddMedication = (newMedication: Medication) => {
    setMedications((prev) => [...prev, newMedication])
    console.log("[v0] Added new medication:", newMedication)
  }

  const toggleMedicationTaken = (medicationId: string) => {
    setMedications((prev) => prev.map((med) => (med.id === medicationId ? { ...med, taken: !med.taken } : med)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary font-poppins">MediHelp</h1>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowNotificationDialog(true)}>
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Link href="/scheduler">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Scheduler
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 font-poppins">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
          </h2>
          <p className="text-muted-foreground text-lg">
            {medications.length === 0
              ? "Get started by uploading your first prescription or adding medications manually"
              : "Keep track of your medications and stay healthy"}
          </p>
        </div>

        <NotificationStatusBanner />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Progress</p>
                  <p className="text-2xl font-bold text-primary">{todayProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Progress value={todayProgress} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Medications Today</p>
                  <p className="text-2xl font-bold">{todayMedications.length}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Pill className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Next Dose</p>
                  <p className="text-2xl font-bold">
                    {todayMedications.length > 0 ? todayMedications[0]?.time || "--" : "--"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold">0 days</p>
                </div>
                <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <PrescriptionUpload onUploadComplete={handleUploadComplete} />

            {/* Today's Medications */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-poppins">Today's Medications</CardTitle>
                <CardDescription>Track your daily medication schedule</CardDescription>
              </CardHeader>
              <CardContent>
                {todayMedications.length === 0 ? (
                  <div className="text-center py-12">
                    <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No medications scheduled</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload a prescription or add medications manually to get started
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Link href="/scheduler">
                        <Button variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Go to Scheduler
                        </Button>
                      </Link>
                      <Button variant="outline" onClick={() => setShowAddMedicationDialog(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Manually
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayMedications.map((med) => (
                      <div key={med.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleMedicationTaken(med.id)}
                            className={`w-3 h-3 rounded-full border-2 ${
                              med.taken
                                ? "bg-secondary border-secondary"
                                : "bg-transparent border-muted-foreground hover:border-secondary"
                            }`}
                          />
                          <div>
                            <h4 className="font-medium">{med.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {med.dosage} • {med.type} • {med.frequency}
                            </p>
                            {med.instructions && (
                              <p className="text-xs text-muted-foreground mt-1">{med.instructions}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{med.time}</p>
                          <Badge variant={med.taken ? "default" : "secondary"} className="text-xs">
                            {med.taken ? "Taken" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full mt-4 bg-transparent"
                      onClick={() => setShowAddMedicationDialog(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Manual Entry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Reminders */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-poppins">Upcoming</CardTitle>
                <CardDescription>Next medication reminders</CardDescription>
              </CardHeader>
              <CardContent>
                {todayMedications.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No upcoming reminders</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayMedications
                      .filter((med) => !med.taken)
                      .slice(0, 3)
                      .map((med) => (
                        <div key={med.id} className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-accent" />
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {med.time} • {med.dosage}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Prescriptions */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-poppins">Recent Prescriptions</CardTitle>
                <CardDescription>Your prescription history</CardDescription>
              </CardHeader>
              <CardContent>
                {recentPrescriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No prescriptions yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Upload your first prescription to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentPrescriptions.map((prescription) => (
                      <div key={prescription.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{prescription.doctor}</p>
                            <p className="text-sm text-muted-foreground">{prescription.date}</p>
                          </div>
                        </div>
                        <Badge variant={prescription.status === "Active" ? "default" : "secondary"}>
                          {prescription.status}
                        </Badge>
                      </div>
                    ))}
                    <Link href="/prescriptions">
                      <Button variant="outline" className="w-full mt-4 bg-transparent">
                        View All Prescriptions
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-poppins">Health Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm">
                    💡 <strong>Tip:</strong> Take your medications at the same time each day to maintain consistent
                    levels in your body and improve effectiveness.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <NotificationPermissionDialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog} />
      <AddMedicationDialog
        open={showAddMedicationDialog}
        onOpenChange={setShowAddMedicationDialog}
        onAddMedication={handleAddMedication}
      />
    </div>
  )
}
