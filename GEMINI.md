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
- **Cloudinary**: Cloud-based service for managing and serving user-uploaded images (posts, avatars, and banners).
- **JWT (python-jose)**: JSON Web Token implementation for secure authentication.
- **Passlib (bcrypt)**: Industry-standard password hashing.

### Frontend (Next.js/React)
- **Next.js 15+ (App Router)**: React framework for building the user interface with efficient routing and rendering.
- **React 19**: Leveraging the latest React features and hooks for state management.
- **Tailwind CSS 4**: Modern utility-first CSS framework for styling and responsive design.
- **Lucide React**: Icon library for a clean and consistent UI.

### DevOps & Testing
- **GitHub Actions**: Automated CI/CD pipeline ensuring backend stability (Pytest) and frontend stability (Jest/lint/build).
- **Pytest**: Framework utilized for backend unit testing and continuous integration.
- **Jest & React Testing Library**: Frameworks utilized for frontend component testing.

---

## ⚙️ Methodology
- **Asynchronous Design**: Full-stack async implementation (FastAPI `async/await` and React `fetch/hooks`) for high concurrency.
- **OCR Verification Workflow**: A strict registration gate that processes image bytes, identifies the oldest date in the text as the DOB, and calculates age before allowing account creation.
- **Security-First Auth**: JWT-based stateless authentication supplemented by a Redis-backed blacklist to invalidate tokens upon logout.
- **Image Management**: Integrated Cloudinary support for asynchronous uploads of post content, user avatars, and profile banners.
- **Component-Based UI**: Reusable frontend architecture (e.g., `PostCard`, `Sidebar`, `CreatePostModal`) to maintain consistency and scalability.

---

## ✅ Completed Tasks

### Authentication & User Management
- [x] **Registration**: Multi-part form handling with integrated OCR age verification.
- [x] **Login**: JWT-based authentication with hashed password verification.
- [x] **Logout**: Implementation of a Redis-backed token blacklist.
- [x] **Profile Management**: Backend APIs for updating (`PUT /api/profile`) and fetching (`GET /api/profile/{username}`) user profiles.

### Content & Interaction
- [x] **Post Creation**: Support for text and image posts with Cloudinary integration.
- [x] **Post Editing**: API support for authors to update title and text content.
- [x] **Global Feed**: Chronological retrieval of posts with basic pagination support.
- [x] **User Content**: Specific API (`GET /api/posts/user/{username}`) to retrieve posts by a particular user.
- [x] **Engagement**: Toggle like/unlike functionality and comment threading (add/delete).
- [x] **Authorization**: Backend checks to ensure only authors can delete their own posts or comments.

### User Interface
- [x] **Main Feed**: Clean, centered feed layout with modern typography (Satoshi/General Sans).
- [x] **Sidebar**: Navigation hub for the platform.
- [x] **Modals**: Smooth, interactive modals for creating content.
- [x] **Profile Pages**: Dynamic routes (`/profile/[username]`) for viewing any user's profile, featuring banners, avatars, bios, and an interactive post carousel.
- [x] **Edit Profile**: Dedicated interface (`/profile`) for users to update their identity, interests, and profile aesthetics.

### DevOps & Quality Assurance
- [x] **CI/CD Pipeline**: Set up GitHub Actions (`ci.yml`) for automated backend testing (Pytest) and frontend checks (Jest testing, linting & building).
- [x] **Backend Testing**: Initialized test suite (`test_main.py`) for CI integration.
- [x] **Frontend Testing**: Initialized Jest testing environment and React Testing Library (`Sidebar.test.jsx`) for CI integration.

---

## ⏩ Follow-Up Section (Next Steps)

- **Direct Messaging**: Implement the planned `dms.py` router to enable private conversations.
- **Real-Time Updates**: Integrate WebSockets for instant notifications of likes, comments, and messages.
- **Search Functionality**: Add a search bar to discover users and post content.
- **Refine OCR**: Enhance the OCR service to handle more diverse ID formats and edge cases in date parsing.
- **Mobile Optimization**: Ensure the UI is fully responsive across all device sizes.

---
*Last updated: June 1, 2026*