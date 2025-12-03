# 🎶 music-match

A **music data-driven social media website** that connects users based on their listening habits and derived **music personalities**. It leverages the **Spotify API** to access rich user listening history and the **OpenAI API** to generalize those habits into a unique, shareable music profile for matching users.

<p align="left">
    <img src="https://github.com/jerryiscat/music-match/assets/94934251/ade50a98-f122-43c2-aa08-f059586463a2" alt="Music Match Landing Page" width="400"/>
</p>

## ✨ Key Features

* **Spotify Integration:** Securely fetch a user's top tracks, artists, and listening data.
* **AI-Powered Personalization:** Use the **OpenAI API** to analyze raw listening data and generate a **generalized music personality profile**.
* **Music Buddy Matching:** Algorithmically match users who have compatible music personalities.
* **User Profiles:** Display personalized music profiles, matching scores, and listening stats.


## 💻 Tech Stack & Skills
**Frontend (Client)**
- Vue.js: For building the reactive user interface.
- Material UI: For consistent, pre-designed UI components.

**Backend API**
The Backend API handles user authentication (via Spotify), data fetching from external APIs, the AI personality generation logic, and persistence of user data and match results.

- Node.js: The JavaScript runtime environment.
- Express.js: The fast, unopinionated, minimal web framework used for building the REST API.
- Spotify API: Core data source for fetching listening habits.
- OpenAI API: Used for text generalization and music personality derivation.
- GraphQL: A GraphQL layer is available (see `graphql/graphql.js`) and is used alongside REST routes to expose data to the frontend where appropriate.
- Sockets / real-time: A socket-based real-time layer is used for chat/presence (see `server/routes/socket.js` and `frontend/socket/socket.js`).

**Database**
- PostgreSQL: Relational database for storing user profiles, matches, and generated personalities.

## 🚀 Get Started Locally

### 🔑 Environment Variables

Before running, copy the top-level `.env.example` to `.env` (or create a `.env` in the backend folder) and populate the secrets. Do NOT commit your `.env` file to the repository.

Example variables used in this project (refer to `.env.example`):

| Variable | Description |
| :--- | :--- |
| `VITE_SERVER_URL` | URL the frontend uses to reach the backend (e.g., http://localhost:1000) |
| `OPENAI_API_KEY` | Your OpenAI API key for the AI-generation features |
| `PORT` | The port the server listens on (default 1000) |
| `DATABASE`, `DATABASE_USER`, `PASSWORD`, `HOST` | PostgreSQL connection details |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | Spotify OAuth app credentials |

Helpful notes:

- Keep secrets out of source control. This repo now ignores `.env` and common env/key files via `.gitignore`.
- To create a safe local env file:

```bash
# Make a local copy (do not commit this file)
cp .env.example .env
# Edit .env and fill values (e.g. OPENAI_API_KEY)
```

- If you accidentally committed an env file, remove it from the repository history on the current branch with:

```bash
# remove from git index while keeping it locally
git rm --cached .env
git commit -m "remove .env from repository"
```


### 🛠️ Installation and Run

Clone the repository and run the setup commands for both the frontend and backend:

**Frontend (Client)**

```bash
# Navigate to the frontend directory (e.g., cd client)
npm install
npm run dev
```

**Backend (Server)**

```bash
npm install
npm start
```


