// Firebase messaging service worker for background notifications
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js")

// Declare the firebase variable
const firebase = self.firebase

// Note: In production, these should be replaced with actual values
const firebaseConfig = {
  apiKey: "your-firebase-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
}

// Initialize the Firebase app in the service worker
firebase.initializeApp(firebaseConfig)

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload)

  const notificationTitle = payload.notification?.title || "MediHelp Reminder"
  const notificationOptions = {
    body: payload.notification?.body || "Time for your medication",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    tag: "medication-reminder",
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: {
      medicationId: payload.data?.medicationId,
      medicationName: payload.data?.medicationName,
      dosage: payload.data?.dosage,
      url: "/dashboard",
    },
    actions: [
      {
        action: "taken",
        title: "✓ Mark as Taken",
        icon: "/icon-192x192.png",
      },
      {
        action: "snooze",
        title: "⏰ Snooze 15 min",
        icon: "/icon-192x192.png",
      },
      {
        action: "view",
        title: "📋 View Details",
        icon: "/icon-192x192.png",
      },
    ],
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received.", event)

  event.notification.close()

  const action = event.action
  const data = event.notification.data

  let url = "/dashboard"

  switch (action) {
    case "taken":
      // Handle medication taken action
      url = `/dashboard?action=medication-taken&id=${data.medicationId}`
      // You can also make an API call here to mark medication as taken
      break
    case "snooze":
      // Handle snooze action - reschedule notification for 15 minutes later
      url = `/dashboard?action=snooze&id=${data.medicationId}`
      break
    case "view":
      // Handle view details action
      url = `/scheduler?medication=${data.medicationId}`
      break
    default:
      // Default action - open the dashboard
      url = "/dashboard"
      break
  }

  // Open the app with the appropriate URL
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus()
          client.navigate(url)
          return
        }
      }
      // If app is not open, open it
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    }),
  )
})

self.addEventListener("push", (event) => {
  console.log("[firebase-messaging-sw.js] Push event received.", event)

  if (event.data) {
    const data = event.data.json()
    const notificationTitle = data.title || "MediHelp Reminder"
    const notificationOptions = {
      body: data.body || "You have a medication reminder",
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      tag: "medication-reminder",
      data: data.data || {},
    }

    event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions))
  }
})

self.addEventListener("install", (event) => {
  console.log("[firebase-messaging-sw.js] Service worker installing...")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("[firebase-messaging-sw.js] Service worker activating...")
  event.waitUntil(self.clients.claim())
})
