import { NextResponse } from "next/server"
import { initializeDatabase, insertSampleData } from "@/lib/init-db"

export async function POST() {
  try {
    // Only allow this in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not allowed in production" }, { status: 403 })
    }

    await initializeDatabase()
    await insertSampleData()

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully with sample data",
    })
  } catch (error) {
    console.error("Database initialization failed:", error)
    return NextResponse.json({ error: "Failed to initialize database", details: error }, { status: 500 })
  }
}
