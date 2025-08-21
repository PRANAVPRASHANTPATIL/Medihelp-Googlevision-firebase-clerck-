// API route for scheduling notifications
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, medicationName, dosage, time, frequency, userId, fcmToken } = body

    // Here you would integrate with your backend service
    // For now, we'll simulate the API response

    // Example: Send to Firebase Cloud Functions or your backend
    // const response = await fetch('your-backend-api/schedule-notification', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     fcmToken,
    //     medicationName,
    //     dosage,
    //     time,
    //     frequency,
    //     userId
    //   })
    // })

    console.log("Scheduling notification for:", {
      medicationName,
      time,
      userId,
    })

    return NextResponse.json({
      success: true,
      message: "Notification scheduled successfully",
      reminderId: id,
    })
  } catch (error) {
    console.error("Error scheduling notification:", error)
    return NextResponse.json({ success: false, error: "Failed to schedule notification" }, { status: 500 })
  }
}
