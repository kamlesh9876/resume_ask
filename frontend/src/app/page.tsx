"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FileUpload from "@/components/FileUpload";

export default function Home() {
  const [candidateName, setCandidateName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    console.log('Uploading file:', file.name, file.type, file.size);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadUrl = 'http://localhost:8000/api/upload-resume';
      console.log('Sending request to:', uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit', // Don't send credentials for now
        headers: {
          // Don't set Content-Type header for FormData - browser sets it automatically with boundary
        },
        body: formData,
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Upload result:', result);
        // Extract name from filename or ask user
        const name = prompt("Enter candidate's name:") || "Candidate";
        setCandidateName(name);
        setResumeUploaded(true);
        
        // Store candidate info in sessionStorage
        sessionStorage.setItem('candidateId', result.candidate_id);
        sessionStorage.setItem('candidateName', name);
      } else {
        console.error('Upload failed:', response.statusText, response.status);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        alert(`Failed to upload resume: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      alert(`Error uploading resume: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
            Resume_see Clean
            <span className="text-blue-600 dark:text-blue-400">.</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-zinc-700 dark:text-zinc-300 mb-8">
            AI Portfolio Assistant
          </h2>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
            Transform any resume into an intelligent AI assistant. Upload a candidate's resume 
            and create a personalized chat interface that answers questions about their skills, 
            experience, and projects.
          </p>
          
          {!resumeUploaded ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 mb-8"
            >
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">
                Upload Candidate Resume
              </h3>
              
              <FileUpload 
                onFileUpload={handleFileUpload}
                isLoading={isUploading}
              />
              
              <div className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                The AI will extract information and create a personalized assistant
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 mb-8"
            >
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
                {candidateName}'s AI Assistant
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Chat with the AI assistant to learn about {candidateName}'s skills, projects, and experience. 
                Get instant answers about their technical background and work.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Start Chatting
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <button
                  onClick={() => {
                    setResumeUploaded(false);
                    setCandidateName("");
                  }}
                  className="inline-flex items-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Upload Different Resume
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-zinc-800 rounded-lg p-6"
            >
              <div className="text-3xl mb-3">�</div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">Resume Upload</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">PDF parsing and analysis</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-zinc-800 rounded-lg p-6"
            >
              <div className="text-3xl mb-3">🤖</div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">AI Integration</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Smart responses about candidates</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white dark:bg-zinc-800 rounded-lg p-6"
            >
              <div className="text-3xl mb-3">💼</div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">Multi-Candidate</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Support for multiple resumes</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
