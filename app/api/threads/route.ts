import { query } from '@/config';
import { Thread } from '@/types/types';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body: Thread = await req.json();
    const { title } = body;

    // Validate input
    if (!title || title.trim() === '') {
      return NextResponse.json({ message: 'Title is required.' }, { status: 400 });
    }

    // Ensure the threads table exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS threads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        createdAt DATE NOT NULL
      )
    `;
    await query(createTableQuery);

    // Check if thread already exists
    const checkThreadQuery = 'SELECT COUNT(*) AS count FROM threads WHERE title = ?';
    const checkResult = await query<{ count: number }[]>(checkThreadQuery, [title]);

    // Access the first element in the result array
    if (checkResult[0].count > 0) {
      return NextResponse.json({ message: 'Thread already exists.' }, { status: 409 }); // Conflict
    }

    // Insert thread into the database
    const createdAt = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD' format
    const insertQuery = 'INSERT INTO threads (title, createdAt) VALUES (?, ?)';
    const result = await query<{ insertId: number }>(insertQuery, [title, createdAt]);

    return NextResponse.json(
      { message: 'Thread created successfully!', threadId: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function GET() {
  try {
    const threads = await query('SELECT * FROM threads ORDER BY createdAt DESC LIMIT 50');
    return NextResponse.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json({ error: 'Failed to load threads' }, { status: 500 });
  }
}