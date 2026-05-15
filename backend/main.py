from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# main.py içinde
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Bu şekilde her şeyi kabul eder
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Şifreleme ayarları
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "Seda_Collector_Hub_Secret_2026" # Bunu gizli tutmalısın
ALGORITHM = "HS256"

# Basit bir kullanıcı veritabanı simülasyonu (Gerçekte PostgreSQL kullanacağız)
users_db = {}

class User(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# Şifre hashleme fonksiyonu
def get_password_hash(password):
    return pwd_context.hash(password)

# Token üretme
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/signup")
async def signup(user: User):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı!")
    
    hashed_password = get_password_hash(user.password)
    users_db[user.email] = {
        "username": user.username,
        "password": hashed_password
    }
    return {"message": "Kayıt başarılı! Şimdi giriş yapabilirsin."}

@app.post("/login")
async def login(request: LoginRequest):
    user = users_db.get(request.email)
    if not user or not pwd_context.verify(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Email veya şifre hatalı!")
    
    access_token = create_access_token(data={"sub": request.email})
    return {"access_token": access_token, "token_type": "bearer", "username": user["username"]}