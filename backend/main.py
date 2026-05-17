from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
import psycopg2 # Veritabanı bağlantısı için ekledik
from psycopg2.extras import RealDictCursor
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Şifreleme ayarları
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "Seda_Collector_Hub_Secret_2026"
ALGORITHM = "HS256"

# Docker-compose içindeki DATABASE_URL'i çekiyoruz
DATABASE_URL = os.getenv("DATABASE_URL", "postgres://yapsed:12345@db:5432/collectors_hub")

# Veritabanı Bağlantı Fonksiyonu
def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"VERİTABANI BAĞLANTI HATASI: {e}")
        return None

# Basit bir kullanıcı veritabanı simülasyonu
users_db = {}

class User(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

def get_password_hash(password):
    return pwd_context.hash(password)

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

class CollectionItem(BaseModel):
    title: str
    img: str
    category: str

# --- 1. GERÇEK VERİTABANINDAN VERİ ÇEKEN GET ENDPOINT ---
@app.get("/api/items")
async def get_all_items():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanına bağlanılamadı")
    
    try:
        # RealDictCursor kullanarak verileri tuple yerine direkt Python sözlüğü (dict) olarak çekiyoruz.
        # Böylece React tarafında "item.title", "item.img" kodların hiç patlamadan tıkır tıkır çalışır.
        from psycopg2.extras import RealDictCursor
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # En son eklenen parça en üstte gözüksün diye id'ye göre tersten sıraladık (büyük kolaylık!)
        cursor.execute("SELECT * FROM items ORDER BY id DESC;")
        items = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return items
    except Exception as e:
        if conn:
            conn.close()
        raise HTTPException(status_code=500, detail=f"Sorgu hatası: {str(e)}")

# --- 2. GERÇEK VERİTABANINA YAZAN POST ENDPOINT ---
@app.post("/api/items")
async def add_new_item(item: CollectionItem):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanına bağlanılamadı")
    
    try:
        cursor = conn.cursor()
        
        # Kategoriyi ID'ye dönüştürme simülasyonu (seed.sql ile tam uyumlu)
        category_id = 1 # Varsayılan: Vinyl
        if item.category == "Photocards":
            category_id = 3 # K-pop Photocard
        elif item.category == "CDs":
            category_id = 2 # CD

        # Sorguyu seed.sql'deki kolon adı olan "image_url" ile güncelledik!
        query = """
            INSERT INTO items (title, image_url, category_id, artist, is_for_sale) 
            VALUES (%s, %s, %s, %s, %s);
        """
        # Şimdilik artist alanına boşluk, satılık mı alanına false geçiyoruz
        cursor.execute(query, (item.title, item.img, category_id, "", False))
        
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Ürün başarıyla veritabanına eklendi! 🚀"}
    except Exception as e:
        if conn:
            conn.rollback()
            conn.close()
        raise HTTPException(status_code=500, detail=f"Veritabanına ekleme hatası: {str(e)}")