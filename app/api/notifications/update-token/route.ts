// API route for updating FCM tokens
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, fcmToken } = body

    // Here you would save the FCM token to your database
    // Example: Update user's FCM token in MongoDB
    // await db.collection('users').updateOne(
    //   { _id: userId },
    //   { $set: { fcmToken: fcmToken, updatedAt: new Date() } }
    // )

    console.log("Updating FCM token for user:", userId)

    return NextResponse.json({
      success: true,
      message: "FCM token updated successfully",
    })
  } catch (error) {
    console.error("Error updating FCM token:", error)
    return NextResponse.json({ success: false, error: "Failed to update FCM token" }, { status: 500 })
  }
}
