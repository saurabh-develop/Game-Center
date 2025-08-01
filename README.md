# 🎮 Game Center

**Game Center** is a full-stack real-time multiplayer game hub where users can play Chess ♟️, Sudoku 🧩, and Tic-Tac-Toe ❌⭕ with strangers. It includes secure authentication, player profiles, leaderboards, a chat box for every game, and animated gameplay — all wrapped in a sleek, glassmorphic UI.

![Game Center Banner](https://ik.imagekit.io/kcekezhkm/banner.png?updatedAt=1754026831911)

---

## 🧠 Features

- 🔗 **Real-time Multiplayer** — Play games in sync using WebSockets (Socket.IO)
- 👥 **Authentication** — Secure login via JWT or play as guest
- 🧾 **Profile Dashboard** — View wins, longest streaks, favorite game, recent matches
- 🏆 **Leaderboard** — Ranks players by performance
- 💬 **Chat Box** — Chat live with others across the platform
- 📱 **Responsive UI** — Optimized for desktop (dark/glassmorphic theme)
- 🔐 **Secure Backend** — Express, MongoDB, password hashing (bcrypt)

---

## 🛠 Tech Stack

| Frontend       | Backend             | Real-time     | Auth        |
|----------------|---------------------|---------------|-------------|
| React          | Node.js + Express   | Socket.IO     | JWT, bcrypt |
| Tailwind CSS   | MongoDB (Mongoose)  | WebSockets    |             |
| Framer Motion  |                     |               |             |

---

## 🧩 Games Implemented

- ♟️ **Chess** – Fully functional, real-time, with move history
- 🧠 **Sudoku** – 1v1 timed match with solution validation
- ❌⭕ **Tic-Tac-Toe** – Fast-paced and reactive multiplayer

---

## 📸 Screenshots

| Login Page  | Game Lobby | In-Game UI |
|-------------|------------|-------------|
| ![login](https://ik.imagekit.io/kcekezhkm/Screenshot%202025-08-01%20at%2011.20.17%E2%80%AFAM.png?updatedAt=1754027429237) | ![lobby](https://ik.imagekit.io/kcekezhkm/Screenshot%202025-08-01%20at%2011.21.43%E2%80%AFAM.png?updatedAt=1754027510574) | ![game](https://ik.imagekit.io/kcekezhkm/Screenshot%202025-08-01%20at%2011.22.38%E2%80%AFAM.png?updatedAt=1754027566839) |

---

## 📂 Folder Structure

## 🔒 Authentication Flow

- Protected routes and WebSocket access based on token presence
- Separate logic for guests (ephemeral) vs logged-in users (persistent)

---

## 📊 Profile Dashboard

- Total wins per game
- Longest win streak
- Favorite game
- Achievements (🥇 First Win, 🧠 Sudoku Champ, ⚔️ Chess Master)
- Match history with result, opponent, time taken

---

## 📈 Leaderboard

- Ranks based on total wins
- Filterable by game
- Real-time updates after match results

---

## 🧪 Setup Instructions

```bash
# Clone the repo
git clone https://github.com/saurabh-develop/Game-Center.git
cd Game-Center

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Start backend
cd ../server
nodemon index.js

# Start frontend
cd ../client
npm run dev

