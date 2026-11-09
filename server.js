const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Penyimpanan memori sementara (bisa diganti file SQLite/JSON jika ingin permanen)
let database = {
    RiwayatRuang1: {},
    RiwayatInsiden: {}
};

// 1. Endpoint untuk menangani metode POST (Menyimpan data dari ESP32)
app.post('/:node.json', (req, res) => {
    const nodeName = req.params.node; // Contoh: RiwayatRuang1 atau RiwayatInsiden
    const newData = req.body;

    if (!database[nodeName]) {
        database[nodeName] = {};
    }

    // Membuat ID unik otomatis mirip Firebase (timestamp/random key)
    const uniqueKey = 'ID_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    database[nodeName][uniqueKey] = newData;

    console.log(`[DATA MASUK] ke ${nodeName}:`, newData);
    res.status(200).json({ name: uniqueKey });
});

// 2. Endpoint untuk menangani metode GET (Membaca data untuk Dashboard HTML)
app.get('/:node.json', (req, res) => {
    const nodeName = req.params.node;
    res.status(200).json(database[nodeName] || {});
});

// Jalankan server di port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Cloud buatan sendiri aktif berjalan di http://localhost:${PORT}`);
});
