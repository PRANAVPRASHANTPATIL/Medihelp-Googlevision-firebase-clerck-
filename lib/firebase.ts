// Firebase configuration and initialization
import { initializeApp } from "firebase/app"
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyDrpFZOUIMJj5_1QKymoinuLg31A3gLG8s",
  authDomain: "vision-2322a.firebaseapp.com",
  projectId: "vision-2322a",
  storageBucket: "vision-2322a.firebasestorage.app",
  messagingSenderId: "159397162265",
  appId: "1:159397162265:web:c91bd2f59bddae56f1e988",
  measurementId: "G-P0ME6KK7QT",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

let messaging: any = null
let messagingInitialized = false

const initializeMessaging = async (): Promise<boolean> => {
  if (messagingInitialized) {
    return messaging !== null
  }

  if (typeof window === "undefined") {
    return false
  }

  try {
    const supported = await isSupported()
    if (supported) {
      messaging = getMessaging(app)
      messagingInitialized = true
      return true
    } else {
      console.warn("Firebase messaging is not supported in this browser")
      messagingInitialized = true
      return false
    }
  } catch (error) {
    console.error("Error initializing Firebase messaging:", error)
    messagingInitialized = true
    return false
  }
}

export { messaging }

// Function to get FCM token
export const getFCMToken = async (): Promise<string | null> => {
  const initialized = await initializeMessaging()
  if (!initialized || !messaging) {
    console.warn("Firebase messaging not available")
    return null
  }

  try {
    const vapidResponse = await fetch("/api/fcm-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration: true }),
    })

    if (!vapidResponse.ok) {
      throw new Error("Failed to get VAPID key")
    }

    const { vapidKey } = await vapidResponse.json()

    const token = await getToken(messaging, { vapidKey })
    return token
  } catch (error) {
    console.error("Error getting FCM token:", error)
    return null
  }
}

// Function to handle foreground messages
export const onMessageListener = async () => {
  const initialized = await initializeMessaging()
  if (!initialized || !messaging) {
    throw new Error("Firebase messaging not available")
  }

  return new Promise((resolve, reject) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })
}
