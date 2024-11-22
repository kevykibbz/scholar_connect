import { query } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { projectTitle, projectDescription } = await req.json();

  if (!projectTitle || !projectDescription) {
    return NextResponse.json(
      { error: "Project Title and Description are required" },
      { status: 400 }
    );
  }

  // Define the table schema
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS proposals (
      ProposalID INT AUTO_INCREMENT PRIMARY KEY,
      ProjectTitle VARCHAR(255) NOT NULL,
      ProjectDescription TEXT NOT NULL,
      Status VARCHAR(50) DEFAULT 'Pending',
      Feedback TEXT
    )
  `;
  await query(createTableQuery);

  // Create the table if it doesn't exist
  await query(createTableQuery);
  // Insert the proposal data into the database
  const insertProposalQuery = `
    INSERT INTO proposals (ProjectTitle, ProjectDescription)
    VALUES (?, ?)
  `;

  try {
    const result = await query<{ insertId: number }>(insertProposalQuery, [
      projectTitle,
      projectDescription,
    ]);

    return NextResponse.json(
      { message: "Proposal created successfully", proposalId: result.insertId },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Error saving proposal" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const proposals = await query("SELECT * FROM proposals");
    return NextResponse.json(proposals);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching proposals" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { proposalId, projectTitle, projectDescription } = await req.json();

  if (!proposalId || !projectTitle || !projectDescription) {
    return NextResponse.json(
      { error: "Proposal ID, Project Title, and Description are required" },
      { status: 400 }
    );
  }

  // Define the update query
  const updateProposalQuery = `
      UPDATE proposals
      SET ProjectTitle = ?, ProjectDescription = ?
      WHERE ProposalID = ?
    `;

  try {
    // Perform the update query
    const result = await query(updateProposalQuery, [
      projectTitle,
      projectDescription,
      proposalId,
    ]);

    // If no rows were affected, return an error (proposal not found)
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Proposal updated successfully", proposalId },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error updating proposal" },
      { status: 500 }
    );
  }
}