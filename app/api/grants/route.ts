import { query } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const proposals = await query(` SELECT g.*, CASE WHEN ga.GrantId IS NOT NULL THEN true ELSE false END AS applied FROM grants g LEFT JOIN grants_applications ga ON g.grantid = ga.grantid `);  
    return NextResponse.json(proposals);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching proposals" },
      { status: 500 }
    );
  }
}

// Change the parameter type from NextResponse to NextRequest
export async function POST(req: NextRequest) {
  const { grantID, userID } = await req.json();

  if (!grantID || !userID) {
    return NextResponse.json(
      { error: "Grant Id and User Id are required" },
      { status: 400 }
    );
  }

  // Define the table schema
  const createTableQuery = `
   CREATE TABLE IF NOT EXISTS grants_applications (
    ApplicationID INT AUTO_INCREMENT PRIMARY KEY,
    GrantId INT NOT NULL,
    UserId INT NOT NULL,
    ApplicationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Approved', 'Declined') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (GrantId) REFERENCES grants(GrantId),
    FOREIGN KEY (UserId) REFERENCES users(id)
    );
  `;

  await query(createTableQuery);

  // Check if the user has already applied for the grant
  const checkApplicationQuery = `
  SELECT COUNT(*) AS count FROM grants_applications 
  WHERE GrantId = ? AND UserId = ?
`;

  try {
    const results = await query(checkApplicationQuery, [grantID, userID]);

    if (results && results[0] && results[0].count > 0) {
      return NextResponse.json(
        { error: "You have already applied for this grant" },
        { status: 400 }
      );
    }

    const insertQuery = `
    INSERT INTO grants_applications (GrantId, UserId)
    VALUES (?, ?)
  `;
    // Execute the insert query
    const result = await query(insertQuery, [grantID, userID]);
    console.log("Application inserted successfully:", result);

    // Return a success response
    return NextResponse.json(
      {
        message: "Successfully applied for the grant",
        applicationId: result.insertId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inserting application:", error);
    return NextResponse.json(
      { error: "Error inserting application" },
      { status: 500 }
    );
  }
}