import { query } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const updatedUserData = await req.json();

    const { userId, name, email, bio } = updatedUserData;

    // SQL query to update user profile
    const sql = `
      UPDATE users
      SET name = ?, email = ?, bio = ?
      WHERE id = ?
    `;

    // Parameters for the SQL query
    const params = [name, email, bio, userId];
    const result = await query(sql, params);

    if (result.affectedRows > 0) {
      return NextResponse.json(
        { message: "Profile updated successfully", data: updatedUserData },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to update profile" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Handle the error if it's an instance of the Error class
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    } else {
      // Fallback in case it's not an Error object
      console.error("Unexpected error:", error);
      return NextResponse.json(
        {
          message: "Internal Server Error",
          error: "An unexpected error occurred",
        },
        { status: 500 }
      );
    }
  }
}
