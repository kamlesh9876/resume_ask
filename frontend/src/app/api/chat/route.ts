import { NextRequest, NextResponse } from "next/server";

interface ChatRequest {
  message: string;
  history: Array<{ role: "user" | "ai"; content: string }>;
}

interface ChatResponse {
  reply: string;
  sources?: string[];
}

interface ErrorResponse {
  error: string;
}

const SYSTEM_PROMPT = `You are a smart portfolio assistant for Kamlesh, an AI Backend Developer.
Use ONLY the context below to answer questions about Kamlesh.
If you don't know the answer from the provided context, say "I don't have that information about Kamlesh."
Always cite your sources like: [Resume], [Projects], [GitHub]
Be concise, professional, and helpful.

Context:
Kamlesh is an AI Backend Developer specializing in:
- Python, FastAPI, and backend development
- AI integration with Gemini and Groq APIs
- Building scalable, production-ready applications
- Modern web technologies and AI-powered solutions

Key Skills:
- Backend Development: Python, FastAPI, SQL, NoSQL
- AI/ML: Gemini API, Groq, AI integration
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Tools: Git, Docker, CI/CD, cloud platforms

Projects:
- Resume_see: AI Developer Portfolio Assistant (current project)
- Various AI-powered applications and backend systems

Experience:
- Focus on AI backend development
- Building intelligent applications with modern tech stack
- Creating scalable and efficient solutions`;

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | ErrorResponse>> {
  try {
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Format conversation history
    const conversationHistory = history
      .slice(-5) // Keep last 5 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join("\n");

    // For now, we'll use a simple response based on keywords
    // In a real implementation, this would call the AI service
    const lowerMessage = message.toLowerCase();
    let reply = "";
    let sources: string[] = [];

    if (lowerMessage.includes("skill") || lowerMessage.includes("tech") || lowerMessage.includes("stack")) {
      reply = "Kamlesh specializes in AI backend development with Python, FastAPI, and modern AI technologies. His core skills include backend development, AI integration (Gemini & Groq APIs), and building scalable applications. [Skills]";
      sources = ["Skills"];
    } else if (lowerMessage.includes("project")) {
      reply = "Kamlesh is currently working on Resume_see, an AI Developer Portfolio Assistant. He has built various AI-powered applications and backend systems focusing on intelligent solutions. [Projects]";
      sources = ["Projects"];
    } else if (lowerMessage.includes("experience") || lowerMessage.includes("background")) {
      reply = "Kamlesh is an AI Backend Developer with experience building intelligent applications and scalable backend systems. He specializes in AI integration and modern web technologies. [Experience]";
      sources = ["Experience"];
    } else if (lowerMessage.includes("contact") || lowerMessage.includes("reach")) {
      reply = "You can connect with Kamlesh through his portfolio or GitHub profile. As an AI backend developer, he's always open to discussing AI projects and collaborations. [Contact]";
      sources = ["Contact"];
    } else if (lowerMessage.includes("ai") || lowerMessage.includes("gemini") || lowerMessage.includes("groq")) {
      reply = "Kamlesh has extensive experience with AI integration, working with Gemini API and Groq to build intelligent applications. He specializes in AI-powered backend solutions. [AI Experience]";
      sources = ["AI Experience"];
    } else {
      reply = "I can help you learn about Kamlesh's skills in AI backend development, his projects like Resume_see, or his experience with modern technologies. What specific aspect would you like to know more about? [General]";
      sources = ["General"];
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      reply,
      sources
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
