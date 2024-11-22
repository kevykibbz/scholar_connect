import { query } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const userId = url.searchParams.get("UserId");

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    // Query the database with the UserId
    const applications = await query(
      `
          SELECT ga.*, g.GrantTitle, g.Deadline
          FROM grants_applications ga
          JOIN grants g ON ga.GrantId = g.GrantID
          WHERE ga.UserId = ?
        `,
      [userId]
    );

    console.log(applications);

    return NextResponse.json(applications);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching proposals" },
      { status: 500 }
    );
  }
}
