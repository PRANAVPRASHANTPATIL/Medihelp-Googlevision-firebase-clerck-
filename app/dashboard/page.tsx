"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Camera,
  Upload,
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
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [todayProgress] = useState(75)

  // Mock data - replace with real data from your backend
  const todayMedications = [
    { id: 1, name: "Metformin", dosage: "500mg", time: "8:00 AM", taken: true, type: "Diabetes" },
    { id: 2, name: "Lisinopril", dosage: "10mg", time: "12:00 PM", taken: true, type: "Blood Pressure" },
    { id: 3, name: "Atorvastatin", dosage: "20mg", time: "6:00 PM", taken: false, type: "Cholesterol" },
    { id: 4, name: "Aspirin", dosage: "81mg", time: "9:00 PM", taken: false, type: "Heart Health" },
  ]

  const recentPrescriptions = [
    { id: 1, date: "2024-01-15", doctor: "Dr. Smith", medications: 3, status: "Active" },
    { id: 2, date: "2024-01-10", doctor: "Dr. Johnson", medications: 2, status: "Completed" },
    { id: 3, date: "2024-01-05", doctor: "Dr. Brown", medications: 4, status: "Active" },
  ]

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
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 font-poppins">Welcome to Your Dashboard</h2>
          <p className="text-muted-foreground text-lg">Here's your medication overview for today</p>
        </div>

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
                  <p className="text-2xl font-bold">4</p>
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
                  <p className="text-2xl font-bold">6:00 PM</p>
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
                  <p className="text-2xl font-bold">7 days</p>
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
            {/* Quick Actions */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-poppins">Quick Actions</CardTitle>
                <CardDescription>Upload new prescriptions or manage your medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button size="lg" className="h-16 flex-col gap-2">
                    <Camera className="w-6 h-6" />
                    <span>Take Photo</span>
                  </Button>
                  <Button variant="outline" size="lg" className="h-16 flex-col gap-2 bg-transparent">
                    <Upload className="w-6 h-6" />
                    <span>Upload File</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Medications */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-poppins">Today's Medications</CardTitle>
                <CardDescription>Track your daily medication schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayMedications.map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${med.taken ? "bg-secondary" : "bg-muted"}`} />
                        <div>
                          <h4 className="font-medium">{med.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {med.dosage} • {med.type}
                          </p>
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
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Manual Entry
                </Button>
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
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium">Atorvastatin</p>
                      <p className="text-sm text-muted-foreground">6:00 PM (in 2 hours)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Aspirin</p>
                      <p className="text-sm text-muted-foreground">9:00 PM (in 5 hours)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Prescriptions */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-poppins">Recent Prescriptions</CardTitle>
                <CardDescription>Your prescription history</CardDescription>
              </CardHeader>
              <CardContent>
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
                </div>
                <Link href="/prescriptions">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Prescriptions
                  </Button>
                </Link>
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
    </div>
  )
}
