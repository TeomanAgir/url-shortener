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
