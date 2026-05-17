from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
import psycopg2 
from psycopg2.extras import RealDictCursor
import os
from typing import Optional

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
    
@app.on_event("startup")
def startup_event():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS favorites (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, item_id)
                );
            """)
            conn.commit()
            cursor.close()
            conn.close()
            print("FAVORİLER TABLOSU BAŞARIYLA KONTROL EDİLDİ/OLUŞTURULDU! 🌟")
        except Exception as e:
            print(f"Tablo oluşturma hatası: {e}")   

class User(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class CollectionItem(BaseModel):
    title: str
    category: str
    img: Optional[str] = None # Base64 formatında şifrelenmiş görsel (isteğe bağlı)
    image_url: Optional[str] = None # Varsa mevcut görsel URL'i (marketplace'ten gelen)
    is_for_sale: bool = False
    is_for_swap: bool = False
    price: Optional[float] = None
    description: Optional[str] = ""
    condition: Optional[str] = "Mint (10/10)"
    username: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    username: str
    email: str
    password: Optional[str] = None

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/signup")
async def signup(user: User):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantı hatası!")
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = %s;", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı!")
        
        hashed_password = get_password_hash(user.password)
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s);",
            (user.username, user.email, hashed_password)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Kayıt başarılı! Şimdi giriş yapabilirsin."}
    except Exception as e:
        if conn: conn.rollback(); conn.close()
        raise HTTPException(status_code=500, detail=f"Kayıt hatası: {str(e)}")

@app.post("/login")
async def login(request: LoginRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantı hatası!")
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM users WHERE email = %s;", (request.email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            raise HTTPException(status_code=401, detail="Email veya şifre hatalı!")
            
        is_password_correct = False
        if request.password == user["password"]:
            is_password_correct = True
        else:
            try:
                if user["password"].startswith("$2b$") or user["password"].startswith("$2a$"):
                    if pwd_context.verify(request.password, user["password"]):
                        is_password_correct = True
            except Exception:
                is_password_correct = False
            
        if not is_password_correct:
            raise HTTPException(status_code=401, detail="Email veya şifre hatalı!")
        
        access_token = create_access_token(data={"sub": user["email"]})
        return {"access_token": access_token, "token_type": "bearer", "username": user["username"]}
    except Exception as e:
        if conn: conn.close()
        raise HTTPException(status_code=500, detail=f"Giriş hatası: {str(e)}")

@app.get("/api/items")
async def get_all_items(username: Optional[str] = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanına bağlanılamadı")
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        if username:
            query = """
                SELECT items.*, categories.name as category_name 
                FROM items 
                JOIN users ON items.user_id = users.id 
                LEFT JOIN categories ON items.category_id = categories.id
                WHERE users.username = %s
                ORDER BY items.id DESC;
            """
            cursor.execute(query, (username,))
        else:
            query = """
                SELECT items.*, categories.name as category_name 
                FROM items 
                LEFT JOIN categories ON items.category_id = categories.id
                ORDER BY items.id DESC;
            """
            cursor.execute(query)
            
        items = cursor.fetchall()
        cursor.close()
        conn.close()
        return items
    except Exception as e:
        if conn: conn.close()
        raise HTTPException(status_code=500, detail=f"Sorgu hatası: {str(e)}")

@app.get("/api/items/{item_id}")
async def get_single_item(item_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanına bağlanılamadı")
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        # Ürünü kategorisi ve kullanıcı adıyla birlikte çekiyoruz
        query = """
            SELECT items.*, categories.name as category, users.username as owner
            FROM items 
            LEFT JOIN categories ON items.category_id = categories.id
            LEFT JOIN users ON items.user_id = users.id
            WHERE items.id = %s;
        """
        cursor.execute(query, (item_id,))
        item = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not item:
            raise HTTPException(status_code=404, detail="Aradığınız koleksiyon parçası bulunamadı!")
            
        return item
    except Exception as e:
        if conn: conn.close()
        raise HTTPException(status_code=500, detail=f"Veri çekme hatası: {str(e)}")
    
@app.post("/api/items")
async def add_new_item(item: CollectionItem):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanına bağlanılamadı")
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        user_id = 1
        if item.username:
            cursor.execute("SELECT id FROM users WHERE username = %s;", (item.username,))
            user_res = cursor.fetchone()
            if user_res: user_id = user_res["id"]

        category_id = 1
        if item.category == "CDs": category_id = 2
        elif item.category == "Photocards": category_id = 3
        elif item.category == "Vintage Tech": category_id = 4
        elif item.category == "Postcards": category_id = 5
        elif item.category == "Signed Art": category_id = 6

        query = """
            INSERT INTO items (user_id, title, image_url, category_id, artist, is_for_sale, is_for_swap, price, description, condition) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        cursor.execute(query, (user_id, item.title, item.img, category_id, "", item.is_for_sale, item.is_for_swap, item.price, item.description, item.condition))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Ürün başarıyla veritabanına eklendi! 🚀"}
    except Exception as e:
        if conn: conn.rollback(); conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/items/{item_id}")
async def update_item(item_id: int, item: CollectionItem):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()

        # Eğer React'tan Base64 formatında (img) yeni bir görsel gelirse onu kullanırız,
        # gelmezse mevcut image_url'i koruruz.
        final_image_url = item.image_url
        if item.img:
            # Not: Gerçek bir üretim ortamında bu Base64 verisi S3 gibi bir bulut depolama servisine yüklenip
            # URL'e dönüştürülmelidir. Biz simülasyon gereği veriyi doğrudan kaydediyoruz.
            final_image_url = item.img

        query = """
            UPDATE items 
            SET title=%s, image_url=%s, category_id=(SELECT id FROM categories WHERE name=%s), 
                is_for_sale=%s, is_for_swap=%s, price=%s, description=%s, condition=%s
            WHERE id=%s;
        """
        cursor.execute(query, (item.title, final_image_url, item.category, item.is_for_sale, item.is_for_swap, item.price, item.description, item.condition, item_id))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Ürün ve görsel başarıyla güncellendi! 🚀"}
    except Exception as e:
        if conn: conn.rollback(); conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/categories")
async def get_categories():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM categories;")
        categories = cursor.fetchall()
        cursor.close()
        conn.close()
        return categories
    except Exception as e:
        if conn: conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/user/profile")
async def update_user_profile(request: ProfileUpdateRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanı bağlantı hatası!")
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Python mantığına göre and / or kelimelerini düzelttik!
        if request.password and request.password != "********" and request.password.strip() != "":
            hashed_password = get_password_hash(request.password)
            query = "UPDATE users SET username = %s, email = %s, password = %s WHERE username = %s;"
            cursor.execute(query, (request.username, request.email, hashed_password, request.username))
        else:
            query = "UPDATE users SET username = %s, email = %s WHERE username = %s;"
            cursor.execute(query, (request.username, request.email, request.username))
            
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Profil bilgileri ve şifre başarıyla güncellendi! 🔐"}
    except Exception as e:
        if conn:
            conn.rollback()
            conn.close()
        raise HTTPException(status_code=500, detail=f"Profil güncelleme hatası: {str(e)}")

@app.delete("/api/items/{item_id}")
async def delete_item(item_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanına bağlanılamadı")
    try:
        cursor = conn.cursor()
        # Ürünün var olup olmadığını kontrol edelim
        cursor.execute("SELECT id FROM items WHERE id = %s;", (item_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Silinmek istenen parça bulunamadı!")

        # Silme işlemini gerçekleştirelim
        cursor.execute("DELETE FROM items WHERE id = %s;", (item_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Koleksiyon parçası başarıyla silindi! 🗑️"}
    except Exception as e:
        if conn: conn.rollback(); conn.close()
        raise HTTPException(status_code=500, detail=str(e))
   
    
# --- FAVORİLERİ GETİREN ENDPOINT ---
@app.get("/api/favorites")
async def get_favorites(username: Optional[str] = "koleksiyoner1"):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanına bağlanılamadı")
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
            SELECT items.*, categories.name as category_name 
            FROM favorites
            JOIN items ON favorites.item_id = items.id
            JOIN users ON favorites.user_id = users.id
            LEFT JOIN categories ON items.category_id = categories.id
            WHERE users.username = %s
            ORDER BY favorites.id DESC;
        """
        cursor.execute(query, (username,))
        fav_items = cursor.fetchall()
        cursor.close()
        conn.close()
        return fav_items
    except Exception as e:
        if conn: conn.close()
        raise HTTPException(status_code=500, detail=str(e))

# --- FAVORİYE ÜRÜN EKLEME ENDPOINT'İ ---
@app.post("/api/favorites/{item_id}")
async def add_to_favorites(item_id: int, username: Optional[str] = "koleksiyoner1"):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanına bağlanılamadı")
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE username = %s;", (username,))
        user_res = cursor.fetchone()
        user_id = user_res['id'] if user_res else 1

        query = "INSERT INTO favorites (user_id, item_id) VALUES (%s, %s) ON CONFLICT DO NOTHING;"
        cursor.execute(query, (user_id, item_id))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Ürün gerçek veritabanı favorilerine eklendi! 🌟"}
    except Exception as e:
        if conn: conn.rollback(); conn.close()
        raise HTTPException(status_code=500, detail=str(e))

# --- FAVORİDEN ÜRÜN SİLME ENDPOINT'İ ---
@app.delete("/api/favorites/{item_id}")
async def remove_from_favorites(item_id: int, username: Optional[str] = "koleksiyoner1"):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Veritabanına bağlanılamadı")
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE username = %s;", (username,))
        user_res = cursor.fetchone()
        user_id = user_res['id'] if user_res else 1

        query = "DELETE FROM favorites WHERE user_id = %s AND item_id = %s;"
        cursor.execute(query, (user_id, item_id))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Ürün veritabanı favorilerinden silindi! 🗑️"}
    except Exception as e:
        if conn: conn.rollback(); conn.close()
        raise HTTPException(status_code=500, detail=str(e))