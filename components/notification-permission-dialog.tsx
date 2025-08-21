"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, BellOff, Smartphone, Clock, Shield, X } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { useToast } from "@/hooks/use-toast"

interface NotificationPermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationPermissionDialog({ open, onOpenChange }: NotificationPermissionDialogProps) {
  const [isRequesting, setIsRequesting] = useState(false)
  const { requestPermission } = useNotifications()
  const { toast } = useToast()

  const handleEnableNotifications = async () => {
    setIsRequesting(true)
    try {
      const granted = await requestPermission()
      if (granted) {
        toast({
          title: "Notifications Enabled!",
          description: "You'll now receive medication reminders on time.",
        })
        onOpenChange(false)
      } else {
        toast({
          title: "Permission Denied",
          description: "You can enable notifications later in your browser settings.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRequesting(false)
    }
  }

  const handleSkip = () => {
    onOpenChange(false)
    toast({
      title: "Notifications Skipped",
      description: "You can enable them later from Settings.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-poppins">Enable Notifications</DialogTitle>
                <DialogDescription>Never miss your medication schedule</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Timely Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified exactly when it's time for your medication
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-secondary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-secondary" />
                  <div>
                    <h4 className="font-medium">Works Everywhere</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications even when the app is closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-accent" />
                  <div>
                    <h4 className="font-medium">Privacy First</h4>
                    <p className="text-sm text-muted-foreground">Your health data stays secure and private</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>How it works:</strong> We'll send you gentle reminders at your scheduled medication times. You can
              always disable notifications later in Settings.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleSkip} className="w-full sm:w-auto bg-transparent">
            <BellOff className="w-4 h-4 mr-2" />
            Maybe Later
          </Button>
          <Button onClick={handleEnableNotifications} disabled={isRequesting} className="w-full sm:w-auto">
            <Bell className="w-4 h-4 mr-2" />
            {isRequesting ? "Enabling..." : "Enable Notifications"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
