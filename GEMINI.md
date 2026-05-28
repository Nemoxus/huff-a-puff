# GEMINI.md - Project Huff-a-Puff

This document provides an overview of the Huff-a-Puff project, its architecture, frameworks, and progress to ensure continuity for future development sessions.

## 🚀 Project Overview
Huff-a-Puff is a modern social platform focused on verified interaction and content sharing. Its standout feature is an automated OCR-based age verification system during registration to ensure a safe environment.

---

## 🛠️ Frameworks & Technologies

### Backend (Python/FastAPI)
- **FastAPI**: Main web framework for building high-performance asynchronous APIs.
- **MongoDB (Motor)**: NoSQL database used for flexible storage of user profiles, posts, and comments.
- **Redis**: Utilized for real-time token blacklisting to handle secure logouts.
- **Tesseract OCR (pytesseract)**: Used for extracting dates of birth from uploaded ID images for age verification.
- **Cloudinary**: Cloud-based service for managing and serving user-uploaded post images.
- **JWT (python-jose)**: JSON Web Token implementation for secure authentication.
- **Passlib (bcrypt)**: Industry-standard password hashing.

### Frontend (Next.js/React)
- **Next.js 15+ (App Router)**: React framework for building the user interface with efficient routing and rendering.
- **React 19**: Leveraging the latest React features and hooks for state management.
- **Tailwind CSS 4**: Modern utility-first CSS framework for styling and responsive design.
- **Lucide React**: Icon library for a clean and consistent UI.

---

## ⚙️ Methodology
- **Asynchronous Design**: Full-stack async implementation (FastAPI `async/await` and React `fetch/hooks`) for high concurrency.
- **OCR Verification Workflow**: A strict registration gate that processes image bytes, identifies the oldest date in the text as the DOB, and calculates age before allowing account creation.
- **Security-First Auth**: JWT-based stateless authentication supplemented by a Redis-backed blacklist to invalidate tokens upon logout.
- **Component-Based UI**: Reusable frontend architecture (e.g., `PostCard`, `Sidebar`, `CreatePostModal`) to maintain consistency and scalability.

---

## ✅ Completed Tasks

### Authentication & Security
- [x] **Registration**: Multi-part form handling with integrated OCR age verification.
- [x] **Login**: JWT-based authentication with hashed password verification.
- [x] **Logout**: Implementation of a Redis-backed token blacklist.

### Content & Interaction
- [x] **Post Creation**: Support for text and image posts with Cloudinary integration.
- [x] **Post Editing**: API support for authors to update title and text content.
- [x] **Global Feed**: Chronological retrieval of posts with basic pagination support.
- [x] **Engagement**: Toggle like/unlike functionality and comment threading (add/delete).
- [x] **Authorization**: Backend checks to ensure only authors can delete their own posts or comments.

### User Interface
- [x] **Main Feed**: Clean, centered feed layout with modern typography (Satoshi/General Sans).
- [x] **Sidebar**: Navigation hub for the platform.
- [x] **Modals**: Smooth, interactive modals for creating content.
- [x] **Edit Profile**: Minimalist screen for editing & updating user's display name, profile picture, bio and more

---

## ⏩ Follow-Up Section (Next Steps)

- **User Profiles**: Develop a dedicated profile page (`/profile/[username]`) showing user-specific posts and stats.
- **Direct Messaging**: Implement the planned `dms.py` router to enable private conversations.
- **Real-Time Updates**: Integrate WebSockets for instant notifications of likes, comments, and messages.
- **Search Functionality**: Add a search bar to discover users and post content.
- **Refine OCR**: Enhance the OCR service to handle more diverse ID formats and edge cases in date parsing.
- **Mobile Optimization**: Ensure the UI is fully responsive across all device sizes.

---
*Last updated: May 29, 2026*
