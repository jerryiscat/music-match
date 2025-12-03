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

**Database**
- PostgreSQL: Relational database for storing user profiles, matches, and generated personalities.

## 🚀 Get Started Locally

### 🔑 Environment Variables

Before running, you must create a `.env` file in the root of the **backend directory** and provide the following API keys:

| Variable | Description | Source |
| :--- | :--- | :--- |
| `SPOTIFY_CLIENT_ID` | Your Spotify developer application Client ID. | Spotify Developer Dashboard |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify developer application Client Secret. | Spotify Developer Dashboard |
| `OPENAI_API_KEY` | Your secret key for accessing the generalization model. | OpenAI |
| `PG_CONNECTION_STRING` | Connection details for your PostgreSQL database. | PostgreSQL Setup |

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


