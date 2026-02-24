from fastapi import APIRouter, UploadFile, File, HTTPException
from services.github_service import GitHubService
import json
import pdfplumber
import os
import io
from datetime import datetime

router = APIRouter()
github_service = GitHubService()

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Read PDF content
        content = await file.read()
        
        # Parse PDF content
        text_content = ""
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                text_content += page.extract_text() + "\n"
        
        # Generate unique candidate ID
        candidate_id = f"candidate_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Create candidate data structure
        resume_data = {
            "candidate_id": candidate_id,
            "filename": file.filename,
            "content": text_content,
            "type": "resume",
            "uploaded_at": datetime.now().isoformat()
        }
        
        # Save to knowledge base with candidate ID
        os.makedirs("knowledge/candidates", exist_ok=True)
        with open(f'knowledge/candidates/{candidate_id}_resume.json', 'w') as f:
            json.dump(resume_data, f, indent=2)
        
        # Update candidates index
        candidates_index = {}
        if os.path.exists('knowledge/candidates/index.json'):
            with open('knowledge/candidates/index.json', 'r') as f:
                candidates_index = json.load(f)
        
        candidates_index[candidate_id] = {
            "filename": file.filename,
            "uploaded_at": datetime.now().isoformat(),
            "status": "active"
        }
        
        with open('knowledge/candidates/index.json', 'w') as f:
            json.dump(candidates_index, f, indent=2)
        
        return {
            "message": "Resume uploaded successfully", 
            "candidate_id": candidate_id,
            "filename": file.filename
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fetch-github")
async def fetch_github_data(username: str, candidate_id: str = ""):
    try:
        github_data = await github_service.fetch_repo_data(username)
        
        if candidate_id:
            # Save to specific candidate folder
            with open(f'knowledge/candidates/{candidate_id}_github.json', 'w') as f:
                json.dump(github_data, f, indent=2)
        else:
            # Save to general knowledge base
            with open('knowledge/github_data.json', 'w') as f:
                json.dump(github_data, f, indent=2)
        
        return {"message": "GitHub data fetched successfully", "repos_count": len(github_data)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-project")
async def add_project(project_data: dict, candidate_id: str = ""):
    try:
        if candidate_id:
            # Load candidate's projects
            try:
                with open(f'knowledge/candidates/{candidate_id}_projects.json', 'r') as f:
                    projects = json.load(f)
            except FileNotFoundError:
                projects = {"projects": []}
        else:
            # Load general projects
            try:
                with open('knowledge/projects.json', 'r') as f:
                    projects = json.load(f)
            except FileNotFoundError:
                projects = {"projects": []}
        
        # Add new project
        projects["projects"].append(project_data)
        
        # Save back
        if candidate_id:
            with open(f'knowledge/candidates/{candidate_id}_projects.json', 'w') as f:
                json.dump(projects, f, indent=2)
        else:
            with open('knowledge/projects.json', 'w') as f:
                json.dump(projects, f, indent=2)
        
        return {"message": "Project added successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/candidates")
async def get_candidates():
    try:
        candidates_index = {}
        if os.path.exists('knowledge/candidates/index.json'):
            with open('knowledge/candidates/index.json', 'r') as f:
                candidates_index = json.load(f)
        
        return {"candidates": candidates_index}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
