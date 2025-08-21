import { type NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "vision-2322a",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

export async function POST(request: NextRequest) {
  try {
    const { registration } = await request.json()

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
