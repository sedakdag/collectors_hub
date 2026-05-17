# Node yerine Python kullanıyoruz
FROM python:3.11-slim

# Çalışma dizini
WORKDIR /app

# Gerekli kütüphaneleri kopyala ve yükle
# (Klasöründe requirements.txt yoksa aşağıda manuel yüklemeyi de yazdım)
COPY . .

RUN pip install --no-cache-dir \
    "fastapi[all]" \
    "uvicorn" \
    "python-jose[cryptography]" \
    "passlib[bcrypt]" \
    "bcrypt==4.0.1" \
    "psycopg2-binary==2.9.9"
# Portu aç
EXPOSE 5000

# FastAPI'yi başlat
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]