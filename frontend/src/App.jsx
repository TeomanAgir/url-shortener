import { useState, useEffect } from 'react';
import { createLink, fetchLinks, deleteLink } from './api/links';
import './index.css';

export default function App() {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Sayfa açılınca mevcut linkleri çek
  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    try {
      const data = await fetchLinks();
      setLinks(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const newLink = await createLink(url);
      // Yeni linki listenin başına ekle, tekrar fetch etmeye gerek yok
      setLinks((prev) => [newLink, ...prev]);
      setUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(code) {
    try {
      await deleteLink(code);
      setLinks((prev) => prev.filter((l) => l.short_code !== code));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCopy(shortUrl, code) {
    await navigator.clipboard.writeText(shortUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <span className="logo">⌗</span>
          <h1>kısa<span className="accent">link</span></h1>
          <p className="tagline">URL'leri küçült, takibini yap</p>
        </div>
      </header>

      <main className="main">
        <section className="shorten-section">
          <form onSubmit={handleSubmit} className="shorten-form">
            <div className="input-row">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://uzun-bir-url-buraya-gelecek.com/sayfa/..."
                className="url-input"
                disabled={loading}
              />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Kısalt'}
              </button>
            </div>
            {error && <p className="error-msg">⚠ {error}</p>}
          </form>
        </section>

        <section className="links-section">
          {links.length === 0 ? (
            <div className="empty-state">
              <span>Henüz link yok.</span>
            </div>
          ) : (
            <ul className="links-list">
              {links.map((link) => (
                <li key={link.id} className="link-card">
                  <div className="link-card-top">
                    <a
                      href={link.short_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="short-url"
                    >
                      {link.short_url}
                    </a>
                    <div className="link-actions">
                      <button
                        className="action-btn copy-btn"
                        onClick={() => handleCopy(link.short_url, link.short_code)}
                      >
                        {copiedCode === link.short_code ? '✓ Kopyalandı' : 'Kopyala'}
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(link.short_code)}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                  <div className="link-card-bottom">
                    <span className="original-url" title={link.original_url}>
                      {link.original_url}
                    </span>
                    <span className="meta">
                      {link.click_count} tıklanma &middot;{' '}
                      {new Date(link.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
