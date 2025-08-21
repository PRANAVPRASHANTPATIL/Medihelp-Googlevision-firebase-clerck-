import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to base64 for Google Vision API
    const bytes = await image.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString("base64")

    // Call Google Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: "TEXT_DETECTION",
                  maxResults: 1,
                },
              ],
            },
          ],
        }),
      },
    )

    if (!visionResponse.ok) {
      throw new Error("Google Vision API request failed")
    }

    const visionData = await visionResponse.json()
    const extractedText = visionData.responses[0]?.textAnnotations[0]?.description || ""

    // Basic medication extraction (you can enhance this with NLP)
    const medications = extractMedications(extractedText)

    // Here you would typically save to your database
    // For now, we'll return the extracted data
    return NextResponse.json({
      success: true,
      extractedText,
      medications,
      userId,
    })
  } catch (error) {
    console.error("OCR processing error:", error)
    return NextResponse.json({ error: "Failed to process prescription" }, { status: 500 })
  }
}

function extractMedications(text: string) {
  // Simple medication extraction logic
  // You can enhance this with more sophisticated NLP
  const lines = text.split("\n").filter((line) => line.trim())
  const medications = []

  for (const line of lines) {
    // Look for patterns like "Medication Name 500mg" or "Take 2 tablets"
    const medicationMatch = line.match(/([A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+(?:\.\d+)?)\s*(mg|g|ml|tablets?|capsules?)/i)
    const dosageMatch = line.match(/take\s+(\d+)\s*(tablet|capsule|pill)s?\s*(daily|twice|morning|evening|night)/i)

    if (medicationMatch) {
      medications.push({
        name: medicationMatch[1].trim(),
        dosage: `${medicationMatch[2]}${medicationMatch[3]}`,
        instructions: dosageMatch ? dosageMatch[0] : "As prescribed",
      })
    }
  }

  return medications
}
