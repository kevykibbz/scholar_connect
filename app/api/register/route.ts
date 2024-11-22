import mysql from "mysql2/promise";
import { dbConfig } from "@/config";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs"; 
import { query } from "@/config"; 

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Ensure data is valid
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email already exists
    const checkEmailQuery = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
    
    const rows = await query<{ count: number }[]>(checkEmailQuery, [email]);

    const existingUserCount = rows[0].count;  
    if (existingUserCount > 0) {
      return NextResponse.json({ error: "Email already exists!" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Define the table schema
    const tableName = "users";
    const columns = `
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      bio TEXT  DEFAULT 'An expert in AI and data-driven research.',
      password VARCHAR(255) NOT NULL
    `;

    // Create the table if it doesn't exist
    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
    await query(createTableQuery);

    // Insert the user into the table with the hashed password
    const insertQuery = `INSERT INTO ${tableName} (name, email, password) VALUES (?, ?, ?)`;
    await query(insertQuery, [name, email, hashedPassword]);

    // Return a success response
    return NextResponse.json({ message: "User registered successfully!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    // Return an error response in case of any issues
    return NextResponse.json({ error: "Database error!" }, { status: 500 });
  }
}
