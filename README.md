# AI Room Rental Platform

A full stack AI powered room rental platform with personalized recommendations using ML, DL and NLP.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS v4
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- AI Service: Python + Flask + spaCy
- Cloud Storage: Cloudinary
- Auth: JWT with role-based access

## Three Roles
- **User** — search rooms with NLP, view details, send inquiries to brokers, save wishlist
- **Broker** — list rooms with images, manage listings, view user inquiries, respond to messages
- **Admin** — manage all users, approve brokers, moderate listings

## Week 1 Features (v0.1)
- [x] Project scaffold — React + Vite + Node + MongoDB
- [x] Database schemas — User, Room, Inquiry models
- [x] JWT Authentication — register and login for all 3 roles
- [x] Auth Middleware — protect() and restrictTo() 
- [x] React Auth UI — Login and Register pages
- [x] Protected Routes — role based dashboard access
- [x] Dashboard Shells — User, Broker, Admin dashboards

## Week 2 Features (v0.2) — COMPLETE
- [x] Room CRUD API — create, read, update, delete rooms
- [x] Image Upload — Cloudinary integration for room photos
- [x] NLP Search — spaCy extracts city, type, price, amenities from plain English
- [x] Broker Dashboard — Add Room form, My Listings with delete
- [x] User Search Page — NLP search bar + manual filters
- [x] Room Detail Page — full room info + broker contact
- [x] Inquiry System — users send messages to brokers

## Week 3 Features (Coming)
- ML Recommendation Engine — content based filtering
- Collaborative Filtering — user behavior based recommendations
- DL Image Classifier — auto categorize room images
- Admin Panel — manage users and listings
- Wishlist Feature — save favorite rooms
- Deployment — Vercel (frontend) + Render (backend)

## Setup Instructions

### Backend

cd backend
npm install
node server.js
Runs on http://localhost:5000

### Frontend
cd frontend/myapp
npm install
npm run dev
Runs on http://localhost:5173

### AI Service
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
Runs on http://localhost:5001

## API Endpoints

### Auth
- POST /api/auth/register — Create account
- POST /api/auth/login — Login

### Rooms
- GET /api/rooms — Get all rooms (with filters: city, type, minPrice, maxPrice)
- GET /api/rooms/:id — Get single room
- POST /api/rooms — Create room (broker only)
- PUT /api/rooms/:id — Update room (broker only)
- DELETE /api/rooms/:id — Delete room (broker only)
- POST /api/rooms/:id/images — Upload room images
- POST /api/rooms/search/nlp — NLP search

### Inquiries
- POST /api/inquiries — Send inquiry (user only)
- GET /api/inquiries/user/my-inquiries — User's sent inquiries
- GET /api/inquiries/broker/inquiries — Broker's received inquiries
- PUT /api/inquiries/:id/status — Update inquiry status

## Test Accounts
- User: nauman@test.com / 123456
- Broker: broker@test.com / 123456

## Developer
- Name: Nauman
- Project: CSE AIML Third Year Final Project
- Timeline: 4 weeks (28 days)
- Current: End of Week 2 (Day 14)

## Next Week (Week 3)
- Days 15-21: ML, DL, and advanced features
- Days 22-24: Admin panel and UI polish
- Days 25-27: Deployment and testing
- Day 28: Final release v1.0