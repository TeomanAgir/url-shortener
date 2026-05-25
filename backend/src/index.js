require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb, pool } = require('./db');
const linksRouter = require('./links');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---

// CORS: Tarayıcı, farklı origin'den (domain:port) gelen istekleri varsayılan
// olarak engeller. Bu middleware, sadece FRONTEND_URL'den gelen isteklere izin verir.
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));

// Gelen request body'sini JSON olarak parse eder.
// Bu olmazsa req.body undefined gelir.
app.use(express.json());

// --- Routes ---

// /api/links altındaki tüm istekleri linksRouter'a ilet
app.use('/api/links', linksRouter);

// -------------------------------------------------------
// GET /:code
// Kısa koda gelen isteği orijinal URL'e yönlendirir.
// Bu route /api/links'ten SONRA tanımlanmalı — yoksa "api" de
// bir short_code gibi yorumlanır.
// -------------------------------------------------------
app.get('/:code', async (req, res) => {
  const { code } = req.params;

  const result = await pool.query(
    'SELECT original_url FROM links WHERE short_code = $1',
    [code]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Link bulunamadı.' });
  }

  // Click sayısını artır (fire-and-forget: cevabı beklemeden yönlendir)
  pool.query(
    'UPDATE links SET click_count = click_count + 1 WHERE short_code = $1',
    [code]
  );

  // 302: Geçici yönlendirme. Tarayıcı bu URL'i cache'lemez.
  // 301 kalıcı olurdu — linki silsek bile tarayıcı cache'den giderdi, istemeyiz.
  return res.redirect(302, result.rows[0].original_url);
});

// --- Global hata yakalayıcı ---
// Herhangi bir route'da fırlatılan hata buraya düşer.
// next(err) çağrılırsa veya async route'larda unhandled rejection olursa.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Sunucu hatası.' });
});

// --- Başlat ---
async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Backend çalışıyor: http://localhost:${PORT}`);
  });
}

start();
