import { useState, useEffect } from 'react';
import { createLink, fetchLinks, deleteLink } from './api/links';
import './index.css';

export default function App() {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);


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
      </main>
    </div>
  );
}
