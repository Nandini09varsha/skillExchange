# SkillSwap — Peer Learning Platform

SkillSwap is a **full-stack peer learning platform** where users can exchange skills with each other.  
Users can discover people who offer skills they want to learn, request learning sessions, chat, and conduct video calls.

The platform encourages **collaborative learning through skill exchange instead of money**.

---

# Features

## User Authentication
- Sign up and login system
- JWT based authentication
- Password encryption using bcrypt

## User Profiles
- Public profile page
- Skills offered and skills wanted
- Bio and rating system
- Skill level and preferred learning mode

## Skill Matching
- Users can search others by skills
- View matching profiles
- Initiate conversations

## Session Request System

Users can request structured learning sessions.

Workflow:

```
User A requests session
        ↓
User B receives request
        ↓
Accept / Reject
        ↓
Session starts
```

## Chat System
- Real time messaging using **Socket.IO**
- Conversation-based chat rooms

## Video Call System
- Peer to peer video calling
- WebRTC signaling via Socket.IO
- Call request and acceptance flow

## Credit System
Users earn credits by teaching.

```
Teach session → gain credits
Learn session → spend credits
```

## Notifications
Users receive notifications when:
- Someone sends a session request
- Session gets accepted
- Session gets completed

---

# Tech Stack

## Frontend
- React
- TailwindCSS
- React Router
- Axios
- Socket.IO Client

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Socket.IO

## Realtime Communication
- WebSockets using Socket.IO
- WebRTC for video calls

---

# Project Structure

```
SkillSwapModified
│
├── Backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   └── context
│
└── README.md
```

---

# Core Workflow

### 1️⃣ Skill Discovery
Users browse profiles based on skills offered.

### 2️⃣ Session Request
A learner sends a request to a tutor.

### 3️⃣ Incoming Requests
Tutor sees pending requests and can:
- Accept
- Reject

### 4️⃣ Session Interaction
Once accepted:
- Chat available
- Video call available

### 5️⃣ Session Completion
Credits transfer between users.

---

# Database Models

## User

```
name
email
password
skillsOffered[]
skillsWanted[]
credits
sessionsTaught
sessionsLearned
reviews[]
```

## Session

```
requester
tutor
skill
mode
status
createdAt
```

## Notification

```
user
type
message
read
```

---

# Installation

## Clone Repository

```
git clone https://github.com/yourusername/skillswap.git
```

---

## Backend Setup

```
cd Backend
npm install
npm start
```

Create `.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

# Running the Project

Backend runs on:

```
http://localhost:5000
```

Frontend runs on:

```
http://localhost:5173
```

---

# Future Improvements

- AI based skill matching
- Calendar scheduling for sessions
- Session rating system
- Push notifications
- Deployment on cloud (AWS / Render)

---

# Learning Outcomes

This project demonstrates:

- Full stack application development
- REST API design
- Real time communication
- WebRTC video integration
- MongoDB schema design
- State management in React
- Scalable backend architecture

---

# Author

Parth  
Full Stack Developer Project
