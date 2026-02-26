import os
import groq
from typing import List, Dict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AIService:
    def __init__(self):
        # Initialize only Groq API
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        
        print(f"🔑 Environment Variables Debug:")
        print(f"   GROQ_API_KEY: {self.groq_api_key[:10] + '...' if self.groq_api_key else 'None'}")
        
        print(f"🔑 API Keys loaded:")
        print(f"   Groq: {'✅' if self.groq_api_key else '❌'}")
        
        if self.groq_api_key:
            self.groq_client = groq.Groq(api_key=self.groq_api_key)
            print(f"✅ Groq client initialized with key: {self.groq_api_key[:10]}...")
        else:
            print(f"❌ Groq API key not found")
    
    def format_context(self, context: Dict) -> str:
        """Format context for AI prompt"""
        return context.get("context", "")
    
    def format_history(self, history: List[Dict]) -> str:
        """Format conversation history"""
        if not history:
            return ""
        
        history_text = []
        for msg in history[-5:]:  # Keep last 5 messages
            role = msg.get("role", "user")
            content = msg.get("content", "")
            history_text.append(f"{role}: {content}")
        
        return "\n".join(history_text)
    
    async def generate(self, question: str, context: Dict, history: List[Dict]) -> str:
        """Generate AI response using only Groq API"""
        
        system_prompt = """You are an intelligent portfolio assistant representing a specific candidate.

Your responsibility is to provide accurate, factual, and professional answers about the candidate using ONLY the provided context.

ABSOLUTE TRUTH RULE:
• You must NEVER invent, assume, infer, or guess any information.
• Every statement must be directly supported by the provided context.
• If information is missing, incomplete, or unclear, say exactly:
  "I don’t have that information about this candidate."

NO HALLUCINATION POLICY:
• Do NOT fill gaps with general knowledge.
• Do NOT assume typical skills, tools, or responsibilities.
• Do NOT extrapolate beyond explicitly stated facts.
• Do NOT interpret or speculate beyond the provided content.

PRECISION MODE:
• Only include information that is directly relevant to the question.
• Do NOT add extra background unless explicitly asked.
• Prefer exact facts over summaries when possible.
• Do NOT exaggerate achievements, impact, or expertise.

COMMUNICATION STYLE:
• Professional, confident, and natural tone.
• Concise and precise: 2–4 sentences preferred.
• Use clear, factual statements.
• Avoid filler phrases, marketing language, or storytelling.
• Avoid generic phrases like "based on the context provided."

SOURCE VERIFICATION REQUIREMENT:
Before answering, internally verify:
1. Is this information explicitly present in the context?
2. Is every sentence supported by context?
3. Am I adding anything not explicitly stated?

If any part cannot be verified, do NOT include it.

SOURCE CITATION:
Always cite the source at the end of the answer using brackets.

Examples:
[Candidate Resume]
[Candidate Projects]
[Candidate GitHub]
[Candidate Portfolio]

Only cite sources that directly support the answer.

SCOPE LIMITATION:
• Only answer questions related to the candidate.
• Do NOT answer unrelated general questions.
• Do NOT provide opinions or subjective judgments unless explicitly supported by context.

FAILSAFE RESPONSE:
If the question cannot be answered fully from context, respond with:
"I don’t have enough information about this candidate to answer that."

PERSONALITY:
• Professional
• Precise
• Neutral and factual
• Recruiter-focused
• Trustworthy and accurate

Your primary goal is factual accuracy, not completeness.
Accuracy is more important than helpfulness.
Never risk providing incorrect information."""
        
        full_context = self.format_context(context)
        history_text = self.format_history(history)
        
        # Use only Groq API
        try:
            if self.groq_api_key:
                print(f"🟢 Using Groq API with key: {self.groq_api_key[:10]}...")
                self.groq_client = groq.Groq(api_key=self.groq_api_key)
                chat_completion = self.groq_client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Context:\n{full_context}\n\nQuestion: {question}"}
                    ],
                    max_tokens=500,
                    temperature=0.7
                )
                response = chat_completion.choices[0].message.content
                print("✅ Groq API success!")
                return response
            else:
                print("❌ Groq API key not found")
                return "Groq API key not configured. Please check your .env file."
        except Exception as e:
            print(f"❌ Groq API error: {e}")
            print(f"Error type: {type(e).__name__}")
            print(f"Error details: {str(e)}")
            return f"Groq API error: {str(e)}"
