const express = require('express');
const app = express();
app.use(express.json());

// Proje gereksinimi: RESTful API [cite: 15]
app.get('/api/items', async (req, res) => {
    // Veritabanından koleksiyon parçalarını çekme (Read) [cite: 17]
});

app.listen(5000, () => console.log('Backend 5000 portunda çalışıyor'));