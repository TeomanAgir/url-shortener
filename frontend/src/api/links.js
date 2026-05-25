// Tüm backend istekleri buradan geçer.
// Base URL'i tek yerden yönetmek için — değiştiğinde her fetch'i düzeltmek zorunda kalmazsın.
const BASE = import.meta.env.VITE_API_URL;

export async function createLink(url) {
  const res = await fetch(`${BASE}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();

  // HTTP 2xx dışı durumlarda fetch hata fırlatmaz — manuel kontrol gerekir.
  if (!res.ok) throw new Error(data.error || 'Bir hata oluştu.');

  return data;
}

export async function fetchLinks() {
  const res = await fetch(`${BASE}/api/links`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Linkler alınamadı.');
  return data;
}

export async function deleteLink(code) {
  const res = await fetch(`${BASE}/api/links/${code}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Silinemedi.');
  return data;
}
