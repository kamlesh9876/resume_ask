# Resume_see - AI Developer Portfolio Assistant

An intelligent chat system that answers questions about Kamlesh's portfolio using AI. Built with Next.js frontend and FastAPI backend.

## 🚀 Features

- **AI-Powered Chat**: Interactive chat interface to learn about Kamlesh's skills and projects
- **Smart Context Retrieval**: Automatically finds relevant information from resume, projects, and GitHub data
- **Modern UI**: Clean, responsive design with animations and dark mode support
- **Real-time Responses**: Fast API responses with loading states
- **Knowledge Base**: Simple JSON-based storage for portfolio information

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations

### Backend
- **FastAPI** - Modern Python web framework
- **AI Integration** - Gemini API (primary) + Groq (fallback)
- **HTTP Client** - httpx for async requests
- **Knowledge Storage** - JSON files (easily upgradeable to database)

## 📁 Project Structure

```
Resume_see/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── page.tsx        # Homepage with upload
│   │   └── chat/page.tsx   # Chat interface
│   ├── components/
│   │   └── FileUpload.tsx   # Upload component
│   └── package.json
├── backend/                  # FastAPI application
│   ├── routes/
│   │   ├── chat.py          # Chat endpoint
│   │   └── ingest.py        # Upload/ingest endpoint
│   ├── services/
│   │   ├── ai_service.py    # AI integration
│   │   ├── retriever.py     # Context retrieval
│   │   └── github_service.py # GitHub integration
│   ├── knowledge/            # Candidate data storage
│   ├── main.py              # FastAPI app
│   ├── requirements.txt      # Python deps
│   └── .env.example        # Env template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🔧 API Endpoints

### POST /api/upload-resume
Upload and parse a PDF resume
- **Body**: multipart/form-data with 'file' field
- **Response**: JSON with candidate_id

### POST /api/chat  
Chat with AI about a candidate
- **Body**: JSON with question, candidate_id, history
- **Response**: AI answer with sources

## 🤖 AI Services

The application tries AI services in this order:
1. **xAI (Grok)** - Primary choice
2. **Groq** - Fast, reliable backup  
3. **Gemini** - Final fallback

## �️ Security Notes

- API keys are never committed to version control
- Resume data is stored locally only
- No external data sharing
- CORS configured for development
  ```json
  {
    "message": "What are your main skills?",
    "history": []
  }
  ```

### Health Check
- `GET /` - API status
- `GET /health` - Health check

## 🎨 Features in Detail

### Chat Interface
- Clean, modern design with animations
- Message history tracking
- Loading states and error handling
- Suggested questions for quick interaction
- Responsive design for mobile and desktop

### AI Integration
- Context-aware responses based on resume and projects
- Source citations for transparency
- Fallback mechanism between AI providers
- Conversation history support

### Knowledge Retrieval
- Keyword-based context matching
- Automatic source detection
- Extensible to vector search (ChromaDB)

## 🔮 Future Enhancements

- [ ] Vector database integration (ChromaDB)
- [ ] PDF resume parsing
- [ ] GitHub repository analysis
- [ ] Advanced AI conversation memory
- [ ] Multi-language support
- [ ] Admin panel for knowledge management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for showcasing AI development skills**
