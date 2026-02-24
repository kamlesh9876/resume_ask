import os
import json
import httpx
from typing import List, Dict

class GitHubService:
    def __init__(self):
        self.token = os.getenv("GITHUB_TOKEN")
        self.base_url = "https://api.github.com"
    
    async def fetch_repo_data(self, username: str) -> List[Dict]:
        """Fetch repository data for a GitHub user"""
        headers = {}
        if self.token:
            headers["Authorization"] = f"token {self.token}"
        
        async with httpx.AsyncClient() as client:
            # Get user repos
            repos_response = await client.get(
                f"{self.base_url}/users/{username}/repos",
                headers=headers
            )
            
            if repos_response.status_code != 200:
                raise Exception(f"Failed to fetch repos: {repos_response.status_code}")
            
            repos = repos_response.json()
            data = []
            
            for repo in repos[:10]:  # Limit to 10 most recent repos
                try:
                    # Get README content
                    readme_response = await client.get(
                        f"{self.base_url}/repos/{username}/{repo['name']}/readme",
                        headers={**headers, "Accept": "application/vnd.github.raw"}
                    )
                    
                    readme_content = ""
                    if readme_response.status_code == 200:
                        readme_content = readme_response.text[:2000]  # Limit size
                    else:
                        readme_content = repo.get('description', '')
                    
                    data.append({
                        "name": repo["name"],
                        "description": repo.get("description", ""),
                        "stars": repo.get("stargazers_count", 0),
                        "language": repo.get("language", ""),
                        "forks": repo.get("forks_count", 0),
                        "updated_at": repo.get("updated_at", ""),
                        "html_url": repo.get("html_url", ""),
                        "readme": readme_content
                    })
                    
                except Exception as e:
                    print(f"Error fetching README for {repo['name']}: {e}")
                    continue
            
            return data
