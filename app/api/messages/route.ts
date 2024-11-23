// app/api/messages/route.ts
import { query } from "@/config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

// Define the handler for GET requests
export async function GET(req: NextRequest) {
  // Get the current user session
  const session = await getServerSession(authOptions);
  
  // Check if the user is authenticated
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }
  
  // Retrieve query parameters from the request
  const selectedUserId = req.nextUrl.searchParams.get("selectedUserId");
  const currentUser = session.user.id;
  
  // Ensure the selectedUserId parameter is provided
  if (!selectedUserId) {
    return NextResponse.json(
      { error: "Missing required parameters." },
      { status: 400 }
    );
  }

  try {
    // SQL query to get messages between the logged-in user and the selected user
    const sql = `
      SELECT m.sender_id AS senderId, m.message_text AS content, m.created_at AS createdAt
      FROM messages m
      WHERE (m.sender_id = ? AND m.recipient_id = ?)
        OR (m.sender_id = ? AND m.recipient_id = ?)
      ORDER BY m.created_at ASC
    `;

    // Parameters for the query: current user and selected user
    const params = [currentUser, selectedUserId, selectedUserId, currentUser];

    // Execute the query
    const messages = await query(sql, params);

    // Return the messages as a response
    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error fetching messages." },
      { status: 500 }
    );
  }
}