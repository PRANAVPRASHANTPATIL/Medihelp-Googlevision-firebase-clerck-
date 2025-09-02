import { redirect } from "next/navigation"

export default function DashboardRedirect() {
  redirect("/manual/index.html")
  return null
}
