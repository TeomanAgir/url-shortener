const express = require('express');
const { nanoid } = require('nanoid');
const { pool } = require('./db');

const router = express.Router();

// --- Yardımcı fonksiyon ---
function isValidUrl(str) {
  try {
    const url = new URL(str);
    // Sadece http ve https kabul et
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// -------------------------------------------------------
// POST /api/links
// Body: { url: "https://..." }
// Yeni kısa link oluşturur.
// -------------------------------------------------------
router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'url alanı zorunlu.' });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Geçerli bir URL girin (http veya https ile başlamalı).' });
  }

  // nanoid(7) → "x7k2pQr" gibi 7 karakterlik rastgele ID üretir.
  // Collision (çakışma) ihtimali 7 karakter + 64 alfabe ile son derece düşük.
  const short_code = nanoid(7);

  const result = await pool.query(
    'INSERT INTO links (original_url, short_code) VALUES ($1, $2) RETURNING *',
    [url, short_code]
  );

  const link = result.rows[0];

  return res.status(201).json({
    id: link.id,
    original_url: link.original_url,
    short_code: link.short_code,
    short_url: `${process.env.BASE_URL}/${link.short_code}`,
    created_at: link.created_at,
    click_count: link.click_count,
  });
});

// -------------------------------------------------------
// GET /api/links
// Tüm linkleri listeler (en yeni önce).
// -------------------------------------------------------
router.get('/', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM links ORDER BY created_at DESC'
  );

  const links = result.rows.map((link) => ({
    ...link,
    short_url: `${process.env.BASE_URL}/${link.short_code}`,
  }));

  return res.json(links);
});

// -------------------------------------------------------
// DELETE /api/links/:code
// Verilen short_code'a sahip linki siler.
// -------------------------------------------------------
router.delete('/:code', async (req, res) => {
  const { code } = req.params;

  const result = await pool.query(
    'DELETE FROM links WHERE short_code = $1 RETURNING id',
    [code]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Link bulunamadı.' });
  }

  return res.json({ message: 'Link silindi.' });
});

module.exports = router;
