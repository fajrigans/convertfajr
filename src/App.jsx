import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import UploadBox from "./components/UploadBox";
import _logoconverfajr from "./assets/_logoconverfajr.png";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';

<Routes>
  <Route path="/" element={<UploadBox />} />
  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
</Routes>


const fileTypes = {
  jpg: ["png", "webp"],
  png: ["jpg", "webp"],
  gif: ["png", "webp"],
  tiff: ["jpg", "png"],
  bmp: ["jpg", "png"],
  pdf: ["jpg", "png"],
  mp3: ["wav", "ogg"],
  wav: ["mp3", "ogg"],
  ogg: ["mp3", "wav"],
  opus: ["mp3", "wav"],
  txt: ["pdf", "docx"],
  docx: ["pdf", "txt"],
  rtf: ["pdf", "txt"],
  zip: ["tar", "rar"],
  rar: ["zip", "tar"],
  tar: ["zip", "rar"],
  gzip: ["zip", "tar"],
  mp4: ["webm", "avi"],
  mov: ["mp4", "webm"],
  avi: ["mp4", "webm"],
  webm: ["mp4", "avi"],
};

const pageTitles = {
  home: "FajrConvert - Konversi File Audio, Video, Gambar",
  about: "Tentang FajrConvert - Layanan Konversi File",
  privacy: "Kebijakan Privasi - FajrConvert",
  terms: "Syarat dan Ketentuan - FajrConvert",
  contact: "Hubungi Kami - FajrConvert",
  blog: "Tutorial Konversi File - FajrConvert",
};

const App = () => {
  const [page, setPage] = useState("home");
  const [article, setArticle] = useState(null);

  useEffect(() => {
    if (page.startsWith("article-")) {
      const slug = page.replace("article-", "");
      const found = articlesData.find((a) => a.slug === slug);
      setArticle(found || null);
    } else {
      setArticle(null);
    }
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6 text-center">Konversi File Mudah dan Cepat</h1>
            <p className="mb-6 text-center max-w-2xl text-gray-700">
              Unggah file Anda dan konversi ke format lain dengan cepat, aman, dan gratis. Dukungan berbagai jenis file: video, audio, dokumen, dan gambar.
            </p>
            <UploadBox fileTypes={fileTypes} />
          </motion.div>
        );
      case "about":
      case "privacy":
      case "terms":
      case "contact":
        const staticContent = {
          about: {
            title: "Tentang ConvertFajr",
            body: "FajrConvert adalah layanan online untuk mengubah berbagai format file seperti MP4 ke MP3, JPG ke PNG, PDF ke JPG, dan banyak lagi...",
          },
          privacy: {
            title: "Kebijakan Privasi",
            body: "Semua file yang Anda unggah hanya digunakan untuk proses konversi dan akan dihapus secara otomatis...",
          },
          terms: {
            title: "Syarat dan Ketentuan",
            body: "Layanan FajrConvert hanya boleh digunakan untuk tujuan yang sah...",
          },
          contact: {
            title: "Hubungi Kami",
            body: "Email: fajrigokil112@gmail.com",
          },
        };
        return (
          <motion.div key={page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto text-gray-700">
            <h1 className="text-3xl font-bold mb-4">{staticContent[page].title}</h1>
            <p>{staticContent[page].body}</p>
          </motion.div>
        );
      case "blog":
        return (
          <motion.div key="blog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto text-gray-700">
            <h1 className="text-3xl font-bold mb-4">Artikel dan Tutorial</h1>
            <ul className="space-y-4">
              {articlesData.map((art) => (
                <li
                  key={art.slug}
                  className="p-4 border rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => setPage(`article-${art.slug}`)}
                >
                  <h2 className="text-xl font-semibold">{art.title}</h2>
                  <p className="text-gray-600">{art.summary}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      default:
        if (page.startsWith("article-") && article) {
          return (
            <motion.div key="article" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto text-gray-700">
              <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
              <p className="text-sm text-gray-400 mb-2">{article.date}</p>
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
              <button className="mt-6 text-blue-600 underline" onClick={() => setPage("blog")}>
                ← Kembali ke daftar artikel
              </button>
            </motion.div>
          );
        }
        return null;
    }
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Helmet>
          <title>{pageTitles[page?.split("-")[0]] || "Artikel - FajrConvert"}</title>
        </Helmet>

        <header className="w-full bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setPage("home")}>
            <img src={_logoconverfajr} alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-xl"></span>
          </div>
          <nav className="flex space-x-4">
            {["home", "about", "privacy", "terms", "contact", "blog"].map((item) => (
              <button
                key={item}
                className={`font-medium capitalize ${page.startsWith(item) ? "text-blue-800 underline" : "text-blue-600"}`}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            ))}
          </nav>
        </header>

        <main className="flex-grow flex items-center justify-center p-6">
          <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
        </main>

        <footer className="text-center py-4 text-gray-500 text-sm border-t">
          © 2025 FajrConvert - Layanan Konversi File Gratis
        </footer>
      </div>
    </HelmetProvider>
  );
};

export default App;
