huff-a-puff/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application instance & routing
│   │   ├── api/                 # Endpoints (auth.py, posts.py, dms.py)
│   │   ├── models/              # Pydantic models & MongoDB schemas
│   │   ├── services/            # Business logic (ocr_service.py, cloudinary.py)
│   │   ├── core/                # Configuration and security (JWT, hashing)
│   │   └── database.py          # MongoDB connection setup
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Secrets (Atlas URI, Cloudinary keys)
│
└── frontend/
    ├── src/
    │   ├── app/                 # Next.js App Router (pages like /feed, /profile)
    │   ├── components/          # Reusable UI (Navbar, PostCard, OcrModal)
    │   ├── lib/                 # Utility functions and API callers (axios/fetch)
    │   └── styles/              # Global styles (Tailwind)
    ├── package.json             # Node dependencies
    ├── tailwind.config.js       # Minimal theme configurations
    └── .env.local               # Frontend environment variables