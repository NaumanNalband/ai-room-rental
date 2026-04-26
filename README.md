# AI Room Rental Platform

A full stack AI powered room rental platform with personalized recommendations using ML, DL and NLP.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS v4
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- AI Service: Python + Flask (Week 3)
- Auth: JWT with role-based access

## Three Roles
- User — search rooms, get AI recommendations, save wishlist
- Broker — list rooms, manage listings, view inquiries
- Admin — manage users, approve brokers, moderate listings

## AI Features (Week 3)
- NLP Search — plain English room search using spaCy
- ML Recommendation — content based filtering using scikit-learn
- Collaborative Filtering — user behaviour based recommendations
- DL Image Classifier — auto tag room images using TensorFlow

## Week 1 Progress
- [x] Project scaffold — React + Vite + Node + MongoDB
- [x] Database schemas — User, Room, Inquiry models
- [x] JWT Authentication — register and login for all 3 roles
- [x] Auth Middleware — protect() and restrictTo() 
- [x] React Auth UI — Login and Register pages
- [x] Protected Routes — role based dashboard access
- [x] Dashboard Shells — User, Broker, Admin dashboards

## Setup Instructions
### Backend
cd backend
npm install
node server.js
### Frontend
cd frontend/myapp
npm install
npm run dev

## Developer
- Name: Nauman
- Project: CSE AIML Third Year Project
- Timeline: 4 weeks