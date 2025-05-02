import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import _logoconverfajr from "./assets/_logoconverfajr.png";
import UploadBox from "./components/UploadBox";

// Optional: Daftar format
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

// Halaman Artikel
const ArticleCard = ({ title, content, date }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-700 text-lg mb-4">{content.slice(0, 300)}...</p>
      <p className="text-gray-500 text-sm">Published on {date}</p>
      <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700">
        Read More
      </button>
    </div>
  );
};

// Halaman Artikel
const Articles = () => {
  const articles = [
    {
      title: "Panduan Lengkap Konversi File untuk Pemula",
      content: "Konversi file adalah proses mengubah format file ke format lain agar dapat dibuka atau digunakan sesuai kebutuhan...",
      date: "2025-05-02",
    },
    {
      title: "Cara Mengonversi Gambar Tanpa Kehilangan Kualitas",
      content: "Mengonversi gambar dengan kualitas terbaik bisa dilakukan dengan menggunakan beberapa tools dan teknik yang tepat...",
      date: "2025-05-01",
    },
    {
      title: "Mengubah Format Video: Panduan Lengkap untuk Semua Orang",
      content: "Video adalah salah satu format file yang paling umum digunakan. Namun, terkadang Anda perlu mengubah format video untuk kompatibilitas...",
      date: "2025-04-30",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Artikel Terbaru</h1>
      {articles.map((article, index) => (
        <ArticleCard key={index} title={article.title} content={article.content} date={article.date} />
      ))}
    </div>
  );
};

// Halaman Home
const Home = () => (
  <motion.div
    key="home"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center"
  >
    <h1 className="text-3xl font-bold mb-6 text-center">Konversi File Mudah dan Cepat</h1>
    <p className="mb-6 text-center max-w-2xl text-gray-700">
      Unggah file Anda dan konversi ke format lain dengan cepat, aman, dan gratis.
    </p>
    <UploadBox fileTypes={fileTypes} />
  </motion.div>
);

// Halaman statis
const StaticPage = ({ title, body }) => (
  <motion.div
    key={title}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="max-w-2xl mx-auto text-gray-700"
  >
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p>{body}</p>
  </motion.div>
);

// Wrapper utama dengan animasi transisi antar halaman
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/about"
          element={
            <StaticPage
              title="Tentang FajrConvert"
              body="FajrConvert adalah layanan online untuk mengubah berbagai format file..."
            />
          }
        />
        <Route
          path="/terms"
          element={
            <StaticPage
              title="Syarat dan Ketentuan"
              body="Layanan FajrConvert hanya boleh digunakan untuk tujuan yang sah..."
            />
          }
        />
        <Route
          path="/contact"
          element={
            <StaticPage
              title="Hubungi Kami"
              body="Email: fajrigokil112@gmail.com"
            />
          }
        />
        {/* Menambahkan route untuk Artikel */}
        <Route path="/articles" element={<Articles />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Helmet>
            <title>FajrConvert - Konversi File</title>
          </Helmet>

          <header className="w-full bg-white shadow p-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={_logoconverfajr} alt="Logo" className="h-8 w-auto" />
              <span className="font-bold text-xl"></span>
            </Link>
            <nav className="flex space-x-4">
              {[{ name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Privacy", path: "/privacy-policy" },
                { name: "Terms", path: "/terms" },
                { name: "Contact", path: "/contact" },
                { name: "Articles", path: "/articles" }, // Menambahkan link ke halaman artikel
              ].map((item) => (
                <Link key={item.path} to={item.path} className="text-blue-600 hover:underline">
                  {item.name}
                </Link>
              ))}
            </nav>
          </header>

          <main className="flex-grow flex items-center justify-center p-6">
            <AnimatedRoutes />
          </main>

          <footer className="text-center py-4 text-gray-500 text-sm border-t">
            © 2025 FajrConvert - Layanan Konversi File Gratis
          </footer>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
