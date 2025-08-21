// API route for cancelling notifications
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reminderId = params.id

    // Here you would integrate with your backend service
    // Example: Cancel notification in Firebase Cloud Functions or your backend
    // const response = await fetch(`your-backend-api/cancel-notification/${reminderId}`, {
    //   method: 'DELETE'
    // })

    console.log("Cancelling notification:", reminderId)

    return NextResponse.json({
      success: true,
      message: "Notification cancelled successfully",
    })
  } catch (error) {
    console.error("Error cancelling notification:", error)
    return NextResponse.json({ success: false, error: "Failed to cancel notification" }, { status: 500 })
  }
}
