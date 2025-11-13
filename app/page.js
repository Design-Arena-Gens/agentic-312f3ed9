'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState(null);

  const handleDownload = async (e) => {
    e.preventDefault();
    setError('');
    setVideoData(null);

    if (!url.includes('instagram.com')) {
      setError('कृपया एक मान्य Instagram URL दर्ज करें');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'डाउनलोड में त्रुटि हुई');
      }

      setVideoData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          📱 Instagram Reels Downloader
        </h1>
        <p className={styles.subtitle}>
          इंस्टाग्राम रील्स को मुफ्त में डाउनलोड करें
        </p>

        <form onSubmit={handleDownload} className={styles.form}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Instagram Reel का URL यहाँ पेस्ट करें..."
            className={styles.input}
            disabled={loading}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={loading || !url}
          >
            {loading ? 'डाउनलोड हो रहा है...' : 'डाउनलोड करें'}
          </button>
        </form>

        {error && (
          <div className={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {videoData && (
          <div className={styles.result}>
            <h2>✅ वीडियो तैयार है!</h2>
            <div className={styles.videoInfo}>
              <p><strong>शीर्षक:</strong> {videoData.title || 'Instagram Reel'}</p>
              {videoData.thumbnail && (
                <img
                  src={videoData.thumbnail}
                  alt="Thumbnail"
                  className={styles.thumbnail}
                />
              )}
            </div>
            <a
              href={videoData.downloadUrl}
              download
              className={styles.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 वीडियो डाउनलोड करें
            </a>
          </div>
        )}

        <div className={styles.instructions}>
          <h3>📝 उपयोग निर्देश:</h3>
          <ol>
            <li>Instagram ऐप खोलें और जिस रील को डाउनलोड करना है उसे खोलें</li>
            <li>शेयर बटन (📤) पर क्लिक करें</li>
            <li>"लिंक कॉपी करें" चुनें</li>
            <li>लिंक को ऊपर दिए गए बॉक्स में पेस्ट करें</li>
            <li>"डाउनलोड करें" बटन पर क्लिक करें</li>
          </ol>
        </div>

        <footer className={styles.footer}>
          <p>⚠️ नोट: कृपया सामग्री निर्माताओं के अधिकारों का सम्मान करें</p>
        </footer>
      </div>
    </main>
  );
}
