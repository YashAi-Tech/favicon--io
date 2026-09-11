from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, Cookie, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
import secrets
from datetime import datetime, timezone, timedelta
import bcrypt
import httpx

from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'favicon_db')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
GEN_MODEL_PROVIDER = os.environ.get('GEN_MODEL_PROVIDER', 'anthropic')
GEN_MODEL_NAME = os.environ.get('GEN_MODEL_NAME', 'claude-sonnet-4-5-20250929')

app = FastAPI(title="Favicon IO / Web Builder API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

SESSION_DAYS = 7


# ----------------------------- Models -----------------------------
class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    auth_provider: str = "email"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RegisterInput(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class SessionInput(BaseModel):
    session_id: str


class GenerateInput(BaseModel):
    prompt: str
    project_id: Optional[str] = None
    name: Optional[str] = None


class Project(BaseModel):
    id: str = Field(default_factory=lambda: f"proj_{uuid.uuid4().hex[:12]}")
    user_id: str
    name: str
    prompt: str
    code: str = ""
    status: str = "generating"  # generating | ready | error
    error: Optional[str] = None
    messages: List[dict] = Field(default_factory=list)
    github_url: Optional[str] = None
    published_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ----------------------------- Helpers -----------------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def new_session_token() -> str:
    return secrets.token_urlsafe(48)


async def create_session(user_id: str) -> str:
    token = new_session_token()
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS),
        "created_at": datetime.now(timezone.utc),
    })
    return token


def set_session_cookie(response: Response, token: str):
    response.set_cookie(
        key="session_token", value=token, httponly=True, secure=True,
        samesite="none", path="/", max_age=SESSION_DAYS * 24 * 60 * 60,
    )


async def get_current_user(
    session_token: Optional[str] = Cookie(default=None),
    authorization: Optional[str] = Header(default=None),
) -> User:
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")

    user_doc = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user_doc)


def clean_code(text: str) -> str:
    """Strip markdown fences and any preamble, keep the HTML document."""
    text = text.strip()
    # Remove ```html ... ``` fences
    fence = re.search(r"```(?:html)?\s*(.*?)```", text, re.DOTALL | re.IGNORECASE)
    if fence:
        text = fence.group(1).strip()
    # If there's stray text before <!DOCTYPE or <html, trim it
    idx = text.lower().find("<!doctype")
    if idx == -1:
        idx = text.lower().find("<html")
    if idx > 0:
        text = text[idx:]
    return text.strip()


async def generate_code(prompt: str, existing_code: str = "") -> str:
    system_message = (
        "You are favicon.io's AI builder, an elite web engineer that builds beautiful, production-grade "
        "single-file websites. You output ONE complete, self-contained HTML document.\n"
        "RULES:\n"
        "1. Return ONLY the raw HTML — no markdown fences, no commentary before or after.\n"
        "2. Include everything inline: <style> for CSS and <script> for JS inside the file.\n"
        "3. Use Tailwind via CDN (<script src=\"https://cdn.tailwindcss.com\"></script>) plus custom CSS as needed.\n"
        "4. Use Google Fonts and modern, polished, responsive design with smooth interactions.\n"
        "5. Use real, sensible placeholder content and images from https://images.unsplash.com.\n"
        "6. Make it fully functional and interactive with vanilla JS where relevant.\n"
        "7. The document MUST start with <!DOCTYPE html>."
    )

    if existing_code:
        text = (
            "Here is the current website HTML:\n\n" + existing_code +
            "\n\nModify the site according to this instruction, keeping everything else intact:\n" +
            prompt + "\n\nReturn the FULL updated HTML document."
        )
    else:
        text = f"Build a complete website for this request:\n\n{prompt}"

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"gen-{uuid.uuid4().hex[:8]}",
        system_message=system_message,
    ).with_model(GEN_MODEL_PROVIDER, GEN_MODEL_NAME)

    resp = await chat.send_message(UserMessage(text=text))
    code = clean_code(resp if isinstance(resp, str) else str(resp))
    if "<html" not in code.lower():
        # Wrap fallback
        code = f"<!DOCTYPE html><html><head><meta charset='utf-8'></head><body>{code}</body></html>"
    return code


# ----------------------------- Auth Routes -----------------------------
@api_router.get("/")
async def root():
    return {"message": "Lovable clone API"}


@api_router.post("/auth/register")
async def register(data: RegisterInput, response: Response):
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    user_doc = {
        "user_id": user_id,
        "email": data.email.lower(),
        "name": data.name,
        "picture": None,
        "auth_provider": "email",
        "password_hash": hash_password(data.password),
        "created_at": datetime.now(timezone.utc),
    }
    await db.users.insert_one(user_doc)
    token = await create_session(user_id)
    set_session_cookie(response, token)
    return {"token": token, "user": User(**{k: v for k, v in user_doc.items() if k != "password_hash"})}


@api_router.post("/auth/login")
async def login(data: LoginInput, response: Response):
    user_doc = await db.users.find_one({"email": data.email.lower()})
    if not user_doc or not user_doc.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(data.password, user_doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = await create_session(user_doc["user_id"])
    set_session_cookie(response, token)
    clean = {k: v for k, v in user_doc.items() if k not in ("password_hash", "_id")}
    return {"token": token, "user": User(**clean)}


@api_router.post("/auth/session")
async def google_session(data: SessionInput, response: Response):
    """Exchange Emergent Google session_id for our own session."""
    async with httpx.AsyncClient() as hc:
        r = await hc.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": data.session_id},
            timeout=20,
        )
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google session")
    info = r.json()
    email = info["email"].lower()

    user_doc = await db.users.find_one({"email": email})
    if not user_doc:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": email,
            "name": info.get("name", email.split("@")[0]),
            "picture": info.get("picture"),
            "auth_provider": "google",
            "created_at": datetime.now(timezone.utc),
        }
        await db.users.insert_one(user_doc)
    else:
        await db.users.update_one({"email": email}, {"$set": {"picture": info.get("picture")}})

    token = await create_session(user_doc["user_id"])
    set_session_cookie(response, token)
    clean = {k: v for k, v in user_doc.items() if k not in ("password_hash", "_id")}
    return {"token": token, "user": User(**clean)}


@api_router.get("/auth/me", response_model=User)
async def me(user: User = Depends(get_current_user)):
    return user


@api_router.post("/auth/logout")
async def logout(response: Response, session_token: Optional[str] = Cookie(default=None),
                 authorization: Optional[str] = Header(default=None)):
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}


# ----------------------------- Project Routes -----------------------------
async def run_generation(project_id: str, prompt: str, existing_code: str):
    """Background task: generate code and update the project when done."""
    try:
        code = await generate_code(prompt, existing_code)
        await db.projects.update_one(
            {"id": project_id},
            {"$set": {"code": code, "status": "ready", "error": None, "updated_at": datetime.now(timezone.utc)}},
        )
    except Exception as e:
        logger.exception("Background generation failed")
        await db.projects.update_one(
            {"id": project_id},
            {"$set": {"status": "error", "error": str(e), "updated_at": datetime.now(timezone.utc)}},
        )


@api_router.post("/projects/generate")
async def generate_project(data: GenerateInput, user: User = Depends(get_current_user)):
    if not data.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required")

    now = datetime.now(timezone.utc)

    if data.project_id:
        pdoc = await db.projects.find_one({"id": data.project_id, "user_id": user.user_id}, {"_id": 0})
        if not pdoc:
            raise HTTPException(status_code=404, detail="Project not found")
        messages = pdoc.get("messages", [])
        messages.append({"role": "user", "content": data.prompt, "at": now.isoformat()})
        await db.projects.update_one(
            {"id": pdoc["id"]},
            {"$set": {"status": "generating", "messages": messages, "updated_at": now}},
        )
        # fire-and-forget background generation (avoids ingress timeout; frontend polls)
        asyncio.create_task(run_generation(pdoc["id"], data.prompt, pdoc.get("code", "")))
        updated = await db.projects.find_one({"id": pdoc["id"]}, {"_id": 0})
        return updated
    else:
        name = data.name or (data.prompt[:40] + ("..." if len(data.prompt) > 40 else ""))
        new_proj = Project(
            user_id=user.user_id, name=name, prompt=data.prompt, code="", status="generating",
            messages=[{"role": "user", "content": data.prompt, "at": now.isoformat()}],
        )
        doc = new_proj.dict()
        await db.projects.insert_one(doc)
        doc.pop("_id", None)
        asyncio.create_task(run_generation(doc["id"], data.prompt, ""))
        return doc


@api_router.get("/projects")
async def list_projects(user: User = Depends(get_current_user)):
    docs = await db.projects.find({"user_id": user.user_id}, {"_id": 0, "code": 0, "messages": 0}).sort("updated_at", -1).to_list(200)
    return docs


@api_router.get("/projects/{project_id}")
async def get_project(project_id: str, user: User = Depends(get_current_user)):
    doc = await db.projects.find_one({"id": project_id, "user_id": user.user_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return doc


@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, user: User = Depends(get_current_user)):
    res = await db.projects.delete_one({"id": project_id, "user_id": user.user_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"ok": True}


@api_router.post("/projects/{project_id}/github")
async def push_github(project_id: str, user: User = Depends(get_current_user)):
    """SIMULATED GitHub push. Real push requires a user GitHub token/OAuth app."""
    doc = await db.projects.find_one({"id": project_id, "user_id": user.user_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    slug = re.sub(r"[^a-z0-9]+", "-", doc["name"].lower()).strip("-")[:30] or "lovable-app"
    repo_url = f"https://github.com/{user.name.split()[0].lower()}/{slug}"
    await db.projects.update_one({"id": project_id}, {"$set": {"github_url": repo_url}})
    return {"github_url": repo_url, "simulated": True}


@api_router.post("/projects/{project_id}/publish")
async def publish_project(project_id: str, user: User = Depends(get_current_user)):
    """SIMULATED publish. Returns a fake live URL for the MVP."""
    doc = await db.projects.find_one({"id": project_id, "user_id": user.user_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    slug = re.sub(r"[^a-z0-9]+", "-", doc["name"].lower()).strip("-")[:24] or "app"
    url = f"https://{slug}-{project_id[-4:]}.lovable.app"
    await db.projects.update_one({"id": project_id}, {"$set": {"published_url": url}})
    return {"published_url": url, "simulated": True}


app.include_router(api_router)

@app.get("/")
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "favicon-io-backend"}

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False)

