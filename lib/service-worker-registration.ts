// Service worker registration utility
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.warn("Service workers are not supported in this environment")
    return null
  }

  try {
    // Register the service worker
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/",
    })

    console.log("Service Worker registered successfully:", registration)

    // Handle service worker updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New service worker is available
            console.log("New service worker available")
            // You can show a notification to the user here
          }
        })
      }
    })

    return registration
  } catch (error) {
    console.error("Service Worker registration failed:", error)
    return null
  }
}

// Unregister service worker
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      const result = await registration.unregister()
      console.log("Service Worker unregistered:", result)
      return result
    }
    return false
  } catch (error) {
    console.error("Service Worker unregistration failed:", error)
    return false
  }
}

// Check if service worker is supported and registered
export const isServiceWorkerSupported = (): boolean => {
  return typeof window !== "undefined" && "serviceWorker" in navigator
}

// Get current service worker registration
export const getServiceWorkerRegistration = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    return null
  }

  try {
    return await navigator.serviceWorker.getRegistration()
  } catch (error) {
    console.error("Failed to get service worker registration:", error)
    return null
  }
}
