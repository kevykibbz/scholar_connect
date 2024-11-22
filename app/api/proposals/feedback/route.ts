import { query } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { proposalID, feedback } = await req.json();

  if (!proposalID || !feedback) {
    return NextResponse.json(
      { error: "Proposal ID and Feedback are required" },
      { status: 400 }
    );
  }

  // Define the update query
  const updateProposalQuery = `UPDATE proposals SET Feedback = ? WHERE ProposalID = ? `;

  try {
    // Perform the update query
    const result = await query(updateProposalQuery, [feedback,proposalID]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Feedback sent successfully", proposalID },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error sending feedback" },
      { status: 500 }
    );
  }
}
