import React, { useState } from "react";
import UploadBox from "./components/UploadBox";
import _logoconverfajr from "./assets/_logoconverfajr.png";

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

const App = () => {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6 text-center">Konversi File Mudah dan Cepat</h1>
            <p className="mb-6 text-center max-w-2xl text-gray-700">
              Unggah file Anda dan konversi ke format lain dengan cepat, aman, dan gratis. Dukungan berbagai jenis file: video, audio, dokumen, dan gambar.
            </p>
            <UploadBox fileTypes={fileTypes} />
          </div>
        );
      case "about":
        return (
          <div className="max-w-2xl mx-auto text-gray-700">
            <h1 className="text-3xl font-bold mb-4">Tentang ConvertFajr</h1>
            <p className="mb-4">
            FajrConvert adalah layanan online untuk mengubah berbagai format file seperti MP4 ke MP3, JPG ke PNG, PDF ke JPG, dan banyak lagi. Kami menghadirkan konversi file yang cepat, praktis, dan tanpa biaya.
            </p>
            <p>
              Website ini dibuat untuk memudahkan siapa saja mengakses alat konversi profesional tanpa perlu install software tambahan.
            </p>
          </div>
        );
      case "privacy":
        return (
          <div className="max-w-2xl mx-auto text-gray-700">
            <h1 className="text-3xl font-bold mb-4">Kebijakan Privasi</h1>
            <p className="mb-4">
              Semua file yang Anda unggah hanya digunakan untuk proses konversi dan akan dihapus secara otomatis setelah proses selesai. Kami tidak menyimpan data pengguna ataupun file secara permanen.
            </p>
            <p>
              Keamanan dan privasi pengguna adalah prioritas kami.
            </p>
          </div>
        );
      case "terms":
        return (
          <div className="max-w-2xl mx-auto text-gray-700">
            <h1 className="text-3xl font-bold mb-4">Syarat dan Ketentuan</h1>
            <p className="mb-4">
              Layanan FajrConvert hanya boleh digunakan untuk tujuan yang sah. Kami tidak bertanggung jawab atas penggunaan file hasil konversi untuk aktivitas ilegal atau pelanggaran hak cipta.
            </p>
            <p>
              Dengan menggunakan layanan ini, Anda menyetujui untuk bertanggung jawab penuh atas file yang Anda unggah dan konversi.
            </p>
          </div>
        );
      case "contact":
        return (
          <div className="max-w-2xl mx-auto text-gray-700">
            <h1 className="text-3xl font-bold mb-4">Hubungi Kami</h1>
            <p className="mb-2">Ada pertanyaan atau saran? Hubungi tim FajrConvert di:</p>
            <p className="mb-2">Email: fajrigokil112@gmail.com</p>
          </div>
        );
      case "blog":
        return (
          <div className="max-w-2xl mx-auto text-gray-700">
            <h1 className="text-3xl font-bold mb-4">Tutorial: Cara Konversi MP4 ke MP3</h1>
            <p className="mb-4">
              Untuk mengubah file MP4 ke MP3 di FajrConvert, cukup klik "Pilih File", unggah video Anda, pilih format MP3, lalu klik "Konversi". Dalam beberapa detik, file MP3 siap diunduh tanpa kehilangan kualitas suara.
            </p>
            <p>
              Proses ini gratis, aman, dan mendukung file hingga ukuran 50MB.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setPage("home")}>
          <img src={_logoconverfajr} alt="Logo" className="h-8 w-auto" />
          <span className="font-bold text-xl"></span>
        </div>
        <nav className="flex space-x-4">
          <button className="text-blue-600 font-medium" onClick={() => setPage("home")}>Home</button>
          <button className="text-blue-600 font-medium" onClick={() => setPage("about")}>About</button>
          <button className="text-blue-600 font-medium" onClick={() => setPage("privacy")}>Privacy</button>
          <button className="text-blue-600 font-medium" onClick={() => setPage("terms")}>Terms</button>
          <button className="text-blue-600 font-medium" onClick={() => setPage("contact")}>Contact</button>
          <button className="text-blue-600 font-medium" onClick={() => setPage("blog")}>Blog</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm border-t">
        © 2025 FajrConvert - Layanan Konversi File Gratis
      </footer>
    </div>
  );
};

export default App;
