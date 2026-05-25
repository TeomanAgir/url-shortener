const { Pool } = require('pg');

// Pool: veritabanı bağlantılarını yeniden kullanır.
// Her istek için yeni bağlantı açmak yerine havuzdan alır → performanslı.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Supabase SSL gerektirir. rejectUnauthorized: false → sertifika doğrulamayı
    // atlar. Production'da sertifikayı doğrulamak daha güvenli ama Supabase
    // için bu ayar yaygın kabul görmüş pratiktir.
    rejectUnauthorized: false,
  },
});

// Tabloyu ilk çalışmada oluşturur. IF NOT EXISTS → ikinci çalıştırmada hata vermez.
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS links (
      id          SERIAL PRIMARY KEY,
      original_url TEXT NOT NULL,
      short_code  VARCHAR(10) UNIQUE NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      click_count INT DEFAULT 0
    )
  `);
  console.log('DB tablosu hazır.');
}

module.exports = { pool, initDb };
