// Notification service for medication reminders
import { getFCMToken, onMessageListener } from "./firebase"

export interface MedicationReminder {
  id: string
  medicationName: string
  dosage: string
  time: string
  frequency: string
  userId: string
}

export interface NotificationPayload {
  title: string
  body: string
  data?: Record<string, string>
}

class NotificationService {
  private static instance: NotificationService
  private fcmToken: string | null = null
  private isInitialized = false

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Initialize the notification service
  async initialize(): Promise<boolean> {
    try {
      if (typeof window === "undefined" || !("Notification" in window)) {
        console.warn("Notifications not supported in this environment")
        return false
      }

      // Request notification permission
      const permission = await this.requestPermission()
      if (permission !== "granted") {
        console.warn("Notification permission not granted")
        return false
      }

      // Get FCM token
      this.fcmToken = await getFCMToken()
      if (!this.fcmToken) {
        console.warn("Failed to get FCM token - notifications may not work")
        // return false
      }

      // Set up foreground message listener only if messaging is available
      if (this.fcmToken) {
        this.setupForegroundListener()
      }

      // Register service worker
      await this.registerServiceWorker()

      this.isInitialized = true
      console.log("Notification service initialized successfully")
      return true
    } catch (error) {
      console.error("Failed to initialize notification service:", error)
      return false
    }
  }

  // Request notification permission
  private async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.error("This browser does not support notifications")
      return "denied"
    }

    if (Notification.permission === "granted") {
      return "granted"
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      return permission
    }

    return Notification.permission
  }

  // Register service worker for background notifications
  private async registerServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js")
        console.log("Service Worker registered successfully:", registration)
      } catch (error) {
        console.error("Service Worker registration failed:", error)
      }
    }
  }

  // Set up foreground message listener
  private setupForegroundListener(): void {
    onMessageListener()
      .then((payload: any) => {
        console.log("Received foreground message:", payload)
        this.showNotification({
          title: payload.notification?.title || "MediHelp Reminder",
          body: payload.notification?.body || "Time for your medication",
          data: payload.data,
        })
      })
      .catch((error) => {
        console.warn("Foreground message listener not available:", error)
      })
  }

  // Show local notification
  private showNotification(payload: NotificationPayload): void {
    if (Notification.permission === "granted") {
      new Notification(payload.title, {
        body: payload.body,
        icon: "/icon-192x192.png",
        badge: "/badge-72x72.png",
        tag: "medication-reminder",
        requireInteraction: true,
      })
    }
  }

  // Get FCM token for backend registration
  getToken(): string | null {
    return this.fcmToken
  }

  // Check if service is initialized
  isReady(): boolean {
    return this.isInitialized
  }

  // Schedule medication reminder (to be sent to backend)
  async scheduleMedicationReminder(reminder: MedicationReminder): Promise<boolean> {
    if (!this.isInitialized || !this.fcmToken) {
      console.error("Notification service not initialized")
      return false
    }

    try {
      // Send reminder data to backend API
      const response = await fetch("/api/notifications/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reminder,
          fcmToken: this.fcmToken,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule notification")
      }

      console.log("Medication reminder scheduled successfully")
      return true
    } catch (error) {
      console.error("Error scheduling medication reminder:", error)
      return false
    }
  }

  // Cancel medication reminder
  async cancelMedicationReminder(reminderId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/notifications/cancel/${reminderId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to cancel notification")
      }

      console.log("Medication reminder cancelled successfully")
      return true
    } catch (error) {
      console.error("Error cancelling medication reminder:", error)
      return false
    }
  }

  // Update FCM token on backend
  async updateTokenOnBackend(userId: string): Promise<boolean> {
    if (!this.fcmToken) return false

    try {
      const response = await fetch("/api/notifications/update-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          fcmToken: this.fcmToken,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("Error updating FCM token:", error)
      return false
    }
  }
}

export default NotificationService
