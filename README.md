# kısalink — URL Kısaltıcı

Express + React + PostgreSQL (Supabase) ile yazılmış tam stack link kısaltıcı.

## Proje Yapısı

```
url-shortener/
├── backend/          → Express API (Railway'e deploy edilir)
│   ├── src/
│   │   ├── index.js  → Ana uygulama, middleware, redirect route
│   │   ├── links.js  → /api/links endpoint'leri
│   │   └── db.js     → PostgreSQL bağlantısı ve tablo init
│   └── package.json
└── frontend/         → React + Vite (Vercel'e deploy edilir)
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   └── api/links.js  → Tüm fetch çağrıları
    └── package.json
```

## API Endpointleri

| Method | URL | Açıklama |
|--------|-----|----------|
| POST | `/api/links` | Yeni kısa link oluştur |
| GET | `/api/links` | Tüm linkleri listele |
| DELETE | `/api/links/:code` | Link sil |
| GET | `/:code` | Orijinal URL'e yönlendir |

## Local Kurulum

### 1. Repoyu kopyala
```bash
git clone <repo-url>
cd url-shortener
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# .env dosyasını düzenle (DATABASE_URL ekle)
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
# .env: VITE_API_URL=http://localhost:3001
npm install
npm run dev
```

---

## Deploy — Adım Adım

### Adım 1: Supabase (Veritabanı)

1. https://supabase.com → Yeni proje oluştur
2. Sol menü → **Settings → Database**
3. **Connection string → URI** sekmesi → kopyala
4. Bu string'i bir yere not et (Railway'de kullanacaksın)

Tablo otomatik oluşturulur (`initDb` fonksiyonu çalışınca).

---

### Adım 2: Railway (Backend)

1. https://railway.app → GitHub ile giriş yap
2. **New Project → Deploy from GitHub repo**
3. Repoyu seç
4. Railway repoyu analiz edecek → backend klasörünü tanıyacak
5. **Settings → General → Root Directory** → `/backend` yaz
6. **Variables** sekmesine git, şunları ekle:

```
DATABASE_URL    = postgresql://...  (Supabase'den kopyaladığın string)
FRONTEND_URL    = https://senin-vercel-url.vercel.app
BASE_URL        = https://senin-railway-url.up.railway.app
PORT            = 3001
```

7. Deploy tetiklenir. Logs sekmesinden "Backend çalışıyor" mesajını gör.
8. **Settings → Domains** → Railway'in verdiği URL'i kopyala.

---

### Adım 3: Vercel (Frontend)

1. https://vercel.com → GitHub ile giriş yap
2. **Add New Project → Import Git Repository**
3. Repoyu seç
4. **Root Directory** → `frontend` yaz
5. **Environment Variables** ekle:

```
VITE_API_URL = https://senin-railway-url.up.railway.app
```

6. **Deploy** → Vercel build edip URL verecek.

---

### Adım 4: Railway'i güncelle

Vercel URL'i aldıktan sonra Railway'e dön:
- `FRONTEND_URL` değişkenini Vercel URL'i ile güncelle (CORS için)
- Railway otomatik redeploy eder.

---

## Sık Karşılaşılan Sorunlar

**CORS hatası:** `FRONTEND_URL` Railway'de yanlış → Vercel URL'ini doğru gir.

**DB bağlantı hatası:** `DATABASE_URL` yanlış format. Supabase'de "URI" sekmesinden al, "JDBC" değil.

**`nanoid` import hatası:** `package.json`'da `"nanoid": "^3.3.7"` olmalı. v4+ ESM only, Express ile CommonJS require çalışmaz.
