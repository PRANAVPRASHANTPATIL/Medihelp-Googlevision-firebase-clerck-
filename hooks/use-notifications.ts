"use client"

// React hook for notification management
import { useState, useEffect } from "react"
import NotificationService, { type MedicationReminder } from "@/lib/notification-service"

export function useNotifications() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const notificationService = NotificationService.getInstance()

  useEffect(() => {
    initializeNotifications()
  }, [])

  const initializeNotifications = async () => {
    setIsLoading(true)
    try {
      const success = await notificationService.initialize()
      setIsInitialized(success)
      setHasPermission(success)

      if (success) {
        const token = notificationService.getToken()
        setFcmToken(token)
      }
    } catch (error) {
      console.error("Failed to initialize notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const requestPermission = async (): Promise<boolean> => {
    const success = await notificationService.initialize()
    setIsInitialized(success)
    setHasPermission(success)

    if (success) {
      const token = notificationService.getToken()
      setFcmToken(token)
    }

    return success
  }

  const scheduleReminder = async (reminder: MedicationReminder): Promise<boolean> => {
    if (!isInitialized) {
      console.error("Notifications not initialized")
      return false
    }

    return await notificationService.scheduleMedicationReminder(reminder)
  }

  const cancelReminder = async (reminderId: string): Promise<boolean> => {
    return await notificationService.cancelMedicationReminder(reminderId)
  }

  const updateToken = async (userId: string): Promise<boolean> => {
    return await notificationService.updateTokenOnBackend(userId)
  }

  return {
    isInitialized,
    hasPermission,
    fcmToken,
    isLoading,
    requestPermission,
    scheduleReminder,
    cancelReminder,
    updateToken,
  }
}
