import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    const sqlPath = path.join(process.cwd(), "src/database/reviews-foreign-keys.sql");
    const sql = readFileSync(sqlPath, "utf8");
    
    await executeQuery(sql);
    
    return NextResponse.json({ success: true, message: "Reviews relations added successfully" });
  } catch (error: any) {
    console.error("Error adding reviews relations:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
