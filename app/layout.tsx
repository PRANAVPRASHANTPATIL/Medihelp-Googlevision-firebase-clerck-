import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "MediHelp - Smart Medication Management",
  description: "AI-powered prescription management for better health outcomes",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""

  return (
    <ClerkProvider publishableKey={publishableKey || undefined}>
      <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
        <body className="font-sans antialiased">
          <div className="min-h-dvh flex flex-col">
            <main className="flex-1">{children}</main>
            <footer role="contentinfo" className="border-t">
              <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-gray-500">
                created by G4- Pranav Patil
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
