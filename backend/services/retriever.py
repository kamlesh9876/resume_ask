import json
import os
from typing import Dict, List

class Retriever:
    def __init__(self):
        self.knowledge_path = "knowledge"
    
    def load_json(self, filepath: str) -> Dict:
        """Load data from JSON file"""
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def get_relevant_context(self, query: str, candidate_id: str = "") -> Dict:
        """Get relevant context based on keyword matching and candidate ID"""
        query = query.lower()
        context = []
        sources = []
        
        if candidate_id:
            # Load candidate-specific data
            resume_path = f"{self.knowledge_path}/candidates/{candidate_id}_resume.json"
            projects_path = f"{self.knowledge_path}/candidates/{candidate_id}_projects.json"
            github_path = f"{self.knowledge_path}/candidates/{candidate_id}_github.json"
            
            resume = self.load_json(resume_path)
            projects = self.load_json(projects_path)
            github = self.load_json(github_path)
            
            # Keyword-based matching for candidate data
            if any(kw in query for kw in ["project", "built", "made", "work", "portfolio"]):
                if projects:
                    context.append(f"PROJECTS: {json.dumps(projects)}")
                    sources.append("Candidate Projects")
            
            if any(kw in query for kw in ["skill", "tech", "stack", "language", "experience"]):
                if resume:
                    context.append(f"RESUME: {resume.get('content', '')}")
                    sources.append("Candidate Resume")
            
            if any(kw in query for kw in ["github", "repo", "code", "readme", "repository"]):
                if github:
                    context.append(f"GITHUB: {json.dumps(github)}")
                    sources.append("Candidate GitHub")
            
            # If no specific context found, return all available candidate data
            if not context:
                if resume:
                    context.append(f"RESUME: {resume.get('content', '')}")
                    sources.append("Candidate Resume")
                if projects:
                    context.append(f"PROJECTS: {json.dumps(projects)}")
                    sources.append("Candidate Projects")
        else:
            # Load general knowledge base files (fallback)
            resume = self.load_json(f"{self.knowledge_path}/resume.json")
            projects = self.load_json(f"{self.knowledge_path}/projects.json")
            github = self.load_json(f"{self.knowledge_path}/github_data.json")
            
            # Keyword-based matching
            if any(kw in query for kw in ["project", "built", "made", "work", "portfolio"]):
                if projects:
                    context.append(f"PROJECTS: {json.dumps(projects)}")
                    sources.append("Projects")
            
            if any(kw in query for kw in ["skill", "tech", "stack", "language", "experience"]):
                if resume:
                    context.append(f"RESUME: {resume.get('content', '')}")
                    sources.append("Resume")
            
            if any(kw in query for kw in ["github", "repo", "code", "readme", "repository"]):
                if github:
                    context.append(f"GITHUB: {json.dumps(github)}")
                    sources.append("GitHub")
            
            # If no specific context found, return all available
            if not context:
                if resume:
                    context.append(f"RESUME: {resume.get('content', '')}")
                    sources.append("Resume")
                if projects:
                    context.append(f"PROJECTS: {json.dumps(projects)}")
                    sources.append("Projects")
        
        return {
            "context": "\n\n".join(context),
            "sources": sources
        }
