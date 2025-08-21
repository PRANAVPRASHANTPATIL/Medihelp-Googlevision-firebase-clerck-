"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, BellOff, X, Settings } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { useToast } from "@/hooks/use-toast"

export function NotificationStatusBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const { hasPermission, isLoading, requestPermission } = useNotifications()
  const { toast } = useToast()

  useEffect(() => {
    // Show banner if notifications are not enabled and not dismissed
    const dismissed = localStorage.getItem("notification-banner-dismissed")
    if (!isLoading && !hasPermission && !dismissed) {
      setIsVisible(true)
    }
  }, [hasPermission, isLoading])

  const handleEnableNotifications = async () => {
    const granted = await requestPermission()
    if (granted) {
      setIsVisible(false)
      toast({
        title: "Notifications Enabled!",
        description: "You'll now receive medication reminders.",
      })
    } else {
      toast({
        title: "Permission Required",
        description: "Please allow notifications in your browser settings.",
        variant: "destructive",
      })
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem("notification-banner-dismissed", "true")
    toast({
      title: "Banner Dismissed",
      description: "You can enable notifications anytime from Settings.",
    })
  }

  const handleOpenSettings = () => {
    // Open browser notification settings
    if ("Notification" in window) {
      toast({
        title: "Browser Settings",
        description: "Please check your browser's notification settings for this site.",
      })
    }
  }

  if (!isVisible || hasPermission || isDismissed) {
    return null
  }

  return (
    <Card className="border-amber-200 bg-amber-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <BellOff className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-800">Stay on Track with Notifications</h3>
              <p className="text-sm text-amber-700">
                Enable notifications to receive timely medication reminders and never miss a dose.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenSettings}
              className="border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent"
            >
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
            <Button
              size="sm"
              onClick={handleEnableNotifications}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Bell className="w-4 h-4 mr-1" />
              Enable
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-amber-600 hover:bg-amber-100">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
