import { query } from "@/config";
import { APIThreadMessage } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

// GET method to fetch thread messages
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  
  const threadId = url.pathname.split('/').pop();
  
  if (!threadId) {
    return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
  }

  try {
    // Fetch messages for the given thread ID
    const threads = await query<APIThreadMessage[]>(`
        SELECT tm.*, u.name
        FROM thread_messages tm
        LEFT JOIN users u ON tm.sender_id = u.id
        WHERE tm.thread_id = ?
        ORDER BY tm.created_at DESC
        LIMIT 50
      `, [threadId]);

    return NextResponse.json(threads, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
