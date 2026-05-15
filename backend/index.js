const express = require('express');
const cors = require('cors'); // 1. CORS'u ekledik
const pool = require('./db'); // 2. pool (veritabanı bağlantısı) içeri alındı
const app = express();

app.use(cors()); // 3. Tarayıcı erişimine izin verildi
app.use(express.json());

// Proje gereksinimi: RESTful API
// Tüm koleksiyon ürünlerini getiren endpoint (READ)
app.get('/api/items', async (req, res) => {
    try {
        // JOIN işlemini şimdilik kaldıralım, önce düz veriyi çekelim
        const allItems = await pool.query("SELECT * FROM items");
        res.json(allItems.rows);
    } catch (err) {
        console.error("DB HATASI:", err.message); // Bu mesaj terminalde görünecek
        res.status(500).json({ error: err.message }); // Hatayı tarayıcıya da basalım
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend ${PORT} portunda çalışıyor` || "Sunucu başlatılamadı"));