import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided", status: "error" },
        { status: 400 }
      );
    }

    // Check if file is PDF
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: "Only PDF files are allowed", status: "error" },
        { status: 400 }
      );
    }

    // Generate unique candidate ID
    const candidateId = `candidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      candidate_id: candidateId,
      message: "Resume uploaded successfully",
      status: "success"
    });

  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Failed to upload resume", status: "error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Upload endpoint is ready",
    status: "healthy"
  });
}
