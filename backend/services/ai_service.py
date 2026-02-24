import os
import google.generativeai as genai
import groq
import openai  # xAI uses OpenAI-compatible API
from typing import List, Dict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AIService:
    def __init__(self):
        # Initialize APIs with correct env var names
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.xai_api_key = os.getenv("XAI_API_KEY")  # ✅ Fixed: use XAI_API_KEY not GROQ_API_KEY
        
        print(f"🔑 Environment Variables Debug:")
        print(f"   GEMINI_API_KEY: {self.gemini_api_key[:10] + '...' if self.gemini_api_key else 'None'}")
        print(f"   GROQ_API_KEY: {self.groq_api_key[:10] + '...' if self.groq_api_key else 'None'}")
        print(f"   XAI_API_KEY: {self.xai_api_key[:10] + '...' if self.xai_api_key else 'None'}")
        
        print(f"🔑 API Keys loaded:")
        print(f"   Gemini: {'✅' if self.gemini_api_key else '❌'}")
        print(f"   Groq: {'✅' if self.groq_api_key else '❌'}")
        print(f"   xAI: {'✅' if self.xai_api_key else '❌'}")
        
        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
            self.gemini_model = genai.GenerativeModel('gemini-pro')  # TODO: Update to newer model
            print(f"✅ Gemini client initialized")
        
        if self.groq_api_key and self.groq_api_key.startswith("gsk_"):
            self.groq_client = groq.Groq(api_key=self.groq_api_key)
            print(f"✅ Groq client initialized")
        elif self.groq_api_key:
            print(f"⚠️ Groq key format invalid (should start with 'gsk_'): {self.groq_api_key[:10]}...")
        
        if self.xai_api_key and self.xai_api_key.startswith("xai-"):
            self.xai_client = openai.OpenAI(
                api_key=self.xai_api_key,
                base_url="https://api.x.ai/v1"
            )
            print(f"✅ xAI client initialized")
        elif self.xai_api_key:
            print(f"⚠️ xAI key format invalid (should start with 'xai-'): {self.xai_api_key[:10]}...")
    
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
        """Generate AI response with xAI (Grok) as primary, Groq as secondary, Gemini as fallback"""
        
        system_prompt = """You are a smart portfolio assistant for a candidate.
Use ONLY the context below to answer questions about the candidate.
If you don't know the answer from the provided context, say "I don't have that information about this candidate."
Always cite your sources like: [Candidate Resume], [Candidate Projects], [Candidate GitHub]
Be concise, professional, and helpful."""
        
        full_context = self.format_context(context)
        history_text = self.format_history(history)
        
        prompt = f"""{system_prompt}

Context:
{full_context}

Conversation so far:
{history_text}

Question: {question}"""
        
        # Try xAI (Grok) first
        try:
            if self.xai_api_key and self.xai_api_key.startswith("xai-"):
                print("🚀 Trying xAI (Grok) API...")
                response = self.xai_client.responses.create(
                    model="grok-4-1-fast-reasoning",
                    input=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Context:\n{full_context}\n\nQuestion: {question}"}
                    ],
                )
                result = response.output_text
                print("✅ xAI (Grok) API success!")
                return result
        except Exception as e:
            print(f"❌ xAI (Grok) API error: {e}")
            print(f"Error type: {type(e).__name__}")
            print(f"Error details: {str(e)}")
        
        # Try Groq second
        try:
            if self.groq_api_key and self.groq_api_key.startswith("gsk_"):
                print("🟢 Trying Groq API...")
                chat_completion = self.groq_client.chat.completions.create(
                    model="llama3-8b-8192",
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
        except Exception as e:
            print(f"❌ Groq API error: {e}")
            print(f"Error type: {type(e).__name__}")
            print(f"Error details: {str(e)}")
        
        # Fallback to Gemini
        try:
            if self.gemini_api_key:
                print("🟡 Trying Gemini API as fallback...")
                response = self.gemini_model.generate_content(f"{system_prompt}\n\nContext:\n{full_context}\n\nQuestion: {question}")
                print("✅ Gemini API success!")
                return response.text
        except Exception as e:
            print(f"❌ Gemini API error: {e}")
            print(f"Error type: {type(e).__name__}")
            print(f"Error details: {str(e)}")
        
        # If all fail, return a default response
        print("❌ All AI APIs failed!")
        return "I'm experiencing technical difficulties with my AI services right now. Please try again later. [System Error]"
