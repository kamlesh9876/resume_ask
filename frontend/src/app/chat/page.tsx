"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [candidateId, setCandidateId] = useState<string>("");
  const [candidateName, setCandidateName] = useState<string>("");

  useEffect(() => {
    // Get candidate info from localStorage or sessionStorage
    const storedCandidateId = sessionStorage.getItem('candidateId');
    const storedCandidateName = sessionStorage.getItem('candidateName');
    
    if (storedCandidateId && storedCandidateName) {
      setCandidateId(storedCandidateId);
      setCandidateName(storedCandidateName);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate API call with local logic
      const lowerMessage = input.toLowerCase();
      let reply = "";

      if (lowerMessage.includes("skill") || lowerMessage.includes("tech")) {
        reply = "I specialize in AI backend development with Python, FastAPI, and modern AI technologies. My core skills include backend development, AI integration, and building scalable applications.";
      } else if (lowerMessage.includes("project")) {
        reply = "I'm currently working on Resume_see, an AI Developer Portfolio Assistant. I've built various AI-powered applications focusing on intelligent solutions.";
      } else if (lowerMessage.includes("experience")) {
        reply = "I'm an AI Backend Developer with experience building intelligent applications and scalable backend systems. I specialize in AI integration and modern web technologies.";
      } else if (lowerMessage.includes("contact") || lowerMessage.includes("reach")) {
        reply = "You can connect with me through my portfolio or GitHub profile. As an AI backend developer, I'm always open to discussing AI projects and collaborations.";
      } else if (lowerMessage.includes("ai") || lowerMessage.includes("gemini") || lowerMessage.includes("groq")) {
        reply = "I have extensive experience with AI integration, working with various AI APIs to build intelligent applications. I specialize in AI-powered backend solutions.";
      } else {
        reply = "I can help you learn about my skills in AI backend development, my projects like Resume_see, or my experience with modern technologies. What specific aspect would you like to know more about?";
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiMessage: Message = { 
        role: "ai", 
        content: reply 
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { 
        role: "ai", 
        content: "Sorry, there was an error processing your message. Please try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <div className="container mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
          
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            {candidateName ? `${candidateName}'s AI Assistant` : 'AI Portfolio Assistant'}
          </h1>
          
          <div className="w-20"></div>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">🤖</div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                      Hello! I'm {candidateName ? `${candidateName}'s` : 'the'} AI Assistant
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                      Ask me anything about {candidateName ? `${candidateName}'s` : 'the candidate\'s'} skills, projects, experience, or technical background. 
                      I'm here to help you learn more about their work!
                    </p>
                    
                    <div className="mt-8 flex flex-wrap gap-2 justify-center">
                      {[
                        "What are your main skills?",
                        "Tell me about your projects",
                        "What's your experience with AI?",
                        "How can I contact you?"
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setInput(suggestion)}
                          className="px-3 py-1 text-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-full text-zinc-700 dark:text-zinc-300 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white"
                        }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))
                )}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-zinc-100 dark:bg-zinc-700 px-4 py-3 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-700 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask about ${candidateName ? `${candidateName}'s` : 'the candidate\'s'} skills, projects, or experience...`}
                    className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-white placeholder-zinc-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
