import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Simple rule-based responses
    const lowerMessage = message.toLowerCase();
    let reply = "";

    if (lowerMessage.includes("skill") || lowerMessage.includes("tech")) {
      reply = "I specialize in AI backend development with Python, FastAPI, and modern AI technologies. My core skills include backend development, AI integration, and building scalable applications.";
    } else if (lowerMessage.includes("project")) {
      reply = "I'm currently working on Resume_see, an AI Developer Portfolio Assistant. I've built various AI-powered applications focusing on intelligent solutions.";
    } else if (lowerMessage.includes("experience")) {
      reply = "I'm an AI Backend Developer with experience building intelligent applications and scalable backend systems. I specialize in AI integration and modern web technologies.";
    } else {
      reply = "I can help you learn about my skills in AI backend development, my projects like Resume_see, or my experience with modern technologies. What would you like to know more about?";
    }

    return NextResponse.json({
      reply
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
