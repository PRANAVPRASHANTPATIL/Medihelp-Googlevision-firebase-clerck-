import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"

let adminApp: any = null

function getFirebaseAdmin() {
  if (!adminApp && !getApps().length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const projectId = "vision-2322a"

    if (!privateKey || !clientEmail) {
      throw new Error("Firebase Admin credentials not configured")
    }

    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    })
  }
  return adminApp
}

export async function POST(request: NextRequest) {
  try {
    try {
      getFirebaseAdmin()
    } catch (adminError) {
      console.error("Firebase Admin initialization failed:", adminError)
      return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 500 })
    }

    const vapidKey = process.env.FIREBASE_VAPID_KEY

    if (!vapidKey) {
      return NextResponse.json({ error: "VAPID key not configured" }, { status: 500 })
    }

    // Return VAPID key securely to client for token generation
    return NextResponse.json({ vapidKey })
  } catch (error) {
    console.error("Error getting VAPID key:", error)
    return NextResponse.json({ error: "Failed to get VAPID key" }, { status: 500 })
  }
}
