import { executeQuery } from "./db"
import fs from "fs"
import path from "path"

export async function setupDatabase() {
  try {
    // Read schema SQL file
    const schemaPath = path.join(process.cwd(), "database", "schema.sql")
    const schemaSql = fs.readFileSync(schemaPath, "utf8")

    // Split SQL statements by semicolon
    const schemaStatements = schemaSql
      .split(";")
      .filter((statement) => statement.trim() !== "")
      .map((statement) => statement + ";")

    // Execute each statement
    for (const statement of schemaStatements) {
      await executeQuery(statement)
    }

    console.log("Database schema created successfully")

    // Read sample data SQL file
    const sampleDataPath = path.join(process.cwd(), "database", "sample-data.sql")
    const sampleDataSql = fs.readFileSync(sampleDataPath, "utf8")

    // Split SQL statements by semicolon
    const sampleDataStatements = sampleDataSql
      .split(";")
      .filter((statement) => statement.trim() !== "")
      .map((statement) => statement + ";")

    // Execute each statement
    for (const statement of sampleDataStatements) {
      await executeQuery(statement)
    }

    console.log("Sample data inserted successfully")

    return { success: true, message: "Database setup completed successfully" }
  } catch (error) {
    console.error("Error setting up database:", error)
    return { success: false, message: "Error setting up database", error }
  }
}
