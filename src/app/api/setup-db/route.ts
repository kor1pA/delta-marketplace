import { setupDatabase } from "@/lib/db-setup"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await setupDatabase()

    if (result.success) {
      return NextResponse.json({ message: result.message })
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in setup-db route:", error)
    return NextResponse.json({ error: "Failed to set up database" }, { status: 500 })
  }
}
