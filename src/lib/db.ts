import mysql from "mysql2/promise";

// Define types for query results
export type QueryResult = any[]; // Can be replaced with a more specific type

// Create a connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export executeQuery function
export async function executeQuery(query: string, params?: any[]): Promise<QueryResult> {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params || []);
    return rows as QueryResult;
  } finally {
    if (connection) connection.release();
  }
}