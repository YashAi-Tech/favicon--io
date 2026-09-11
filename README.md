# Favicon IO - AI Web App Builder

Full-stack application consisting of a React frontend and a FastAPI backend with MongoDB and AI generation capabilities.

---

## 🚀 Web Hosting & Deployment Guide

This project is separated into two parts:
1. **Frontend** (`/frontend`) - React SPA
2. **Backend** (`/backend`) - Python FastAPI + MongoDB

---

### 1. Backend Deployment (Render / Railway / VPS)

#### Recommended Host: [Render](https://render.com) or [Railway](https://railway.app)
1. Create a new **Web Service** and connect your GitHub repository `https://github.com/YashAi-Tech/favlcon.git`.
2. Configure settings:
   - **Root Directory:** `backend`
   - **Environment / Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
3. Add **Environment Variables** in Render / Railway dashboard:
   - `MONGO_URL`: Your MongoDB connection URI (from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
     - Example: `mongodb+srv://<user>:<password>@cluster0.abc.mongodb.net/?retryWrites=true&w=majority`
   - `DB_NAME`: `favicon_db`
   - `EMERGENT_LLM_KEY`: Your LLM / Emergent API key (or Anthropic API key)
   - `GEN_MODEL_PROVIDER`: `anthropic` (default)
   - `GEN_MODEL_NAME`: `claude-sonnet-4-5-20250929` (default)
4. Once deployed, note your backend URL (e.g. `https://your-backend-api.onrender.com`).

---

### 2. Frontend Deployment (Vercel / Netlify)

#### Recommended Host: [Vercel](https://vercel.com)
1. Create a **New Project** on Vercel and import your repository.
2. Configure project settings:
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` or `yarn build`
   - **Output Directory:** `build`
3. Add **Environment Variables** in Vercel:
   - `REACT_APP_BACKEND_URL`: Your deployed Backend URL (e.g. `https://your-backend-api.onrender.com`)
4. Click **Deploy**.

---

## ⚙️ Environment Variables Summary

### Backend (`/backend/.env`)
| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `MONGO_URL` | Yes | MongoDB Atlas or database connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `DB_NAME` | Yes | Database name in MongoDB | `favicon_db` |
| `EMERGENT_LLM_KEY`| Yes | API Key for AI generation model | `sk-...` |
| `GEN_MODEL_PROVIDER`| No | AI Model Provider (default: `anthropic`) | `anthropic` |
| `GEN_MODEL_NAME` | No | AI Model Name (default: `claude-sonnet-4-5-20250929`) | `claude-sonnet-4-5-20250929` |
| `PORT` | No | Server port (auto-set by hosting platforms) | `8000` |

### Frontend (`/frontend/.env`)
| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `REACT_APP_BACKEND_URL` | Yes | Public URL of the deployed FastAPI backend | `https://your-backend.onrender.com` |

---

## 💻 Local Development

### 1. Run Backend
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

### 2. Run Frontend
```bash
cd frontend
yarn install # or npm install
yarn start   # or npm start
```
Frontend runs at `http://localhost:3000` and proxies API calls to `http://localhost:8000`.
