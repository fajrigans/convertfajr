import Logo from './assets/_logoconverfajr.png';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const videoFormats = ['MP4', 'MOV', 'AVI', 'WEBM'];
  const audioFormats = ['MP3', 'WAV', 'OGG'];
  const imageFormats = ['JPG', 'PNG', 'BMP', 'WEBP'];

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    handleFileSelect(selected);
  };

  const handleFileSelect = (selected) => {
    if (selected) {
      const type = selected.type;
      const maxSize = 50 * 1024 * 1024; // 50MB

      if (selected.size > maxSize) {
        alert('Ukuran file maksimal 50MB');
        return;
      }

      if (type.startsWith('video/') || type.startsWith('audio/') || type.startsWith('image/')) {
        setFile(selected);
        setDownloadUrl(null);
        setPreviewUrl(URL.createObjectURL(selected));

        if (type.startsWith('video/')) {
          setSelectedFormat(videoFormats[0]);
        } else if (type.startsWith('audio/')) {
          setSelectedFormat(audioFormats[0]);
        } else if (type.startsWith('image/')) {
          setSelectedFormat(imageFormats[0]);
        }
      } else {
        alert('File tidak didukung. Silakan pilih file video, audio, atau gambar.');
      }
    }
  };

  const handleConvert = async () => {
    if (!file || !selectedFormat) return;

    setIsConverting(true);
    setProgress(0);
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', selectedFormat.toLowerCase());

    try {
      const response = await axios.post("https://74b78a0e-9569-484c-92f7-830f2b59ae41-00-3ckgf1rvks737.pike.replit.dev/api/convert",formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
    } catch (err) {
      alert('Gagal mengonversi file.');
      console.error(err);
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  const getAvailableFormats = () => {
    if (!file) return [];
    const type = file.type;
    if (type.startsWith('video/')) return videoFormats;
    if (type.startsWith('audio/')) return audioFormats;
    if (type.startsWith('image/')) return imageFormats;
    return [];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="w-full flex items-center justify-between p-4 shadow bg-white">
      <img src={Logo} alt="FajrConvert Logo" style={{ height: '40px' }} />
        <nav className="space-x-6 text-sm text-gray-600 font-medium">
          <a href="#" className="hover:text-blue-600">Home</a>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4">
        {!file ? (
          <>
            <p className="text-lg text-center mb-4">Tarik file ke sini atau klik untuk pilih file</p>
            <label
              htmlFor="file-upload"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full max-w-md p-6 bg-white border-2 ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300'} rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all`}
            >
              <span className="mt-2 text-sm text-gray-500">Drag & Drop</span>
              <input
                id="file-upload"
                type="file"
                accept="video/*,audio/*,image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <button
              onClick={() => document.getElementById('file-upload').click()}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Pilih File
            </button>
          </>
        ) : (
          <div className="mt-4 w-full max-w-md p-4 bg-white rounded-xl shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">{file.name}</span>
              <button onClick={() => { setFile(null); setPreviewUrl(null); }} className="text-sm text-red-500 hover:underline">Hapus</button>
            </div>

            {previewUrl && (
              <div className="mb-4">
                {file.type.startsWith('video') && <video src={previewUrl} controls className="w-full rounded-md" />}
                {file.type.startsWith('audio') && <audio src={previewUrl} controls className="w-full" />}
                {file.type.startsWith('image') && <img src={previewUrl} alt="Preview" className="w-full rounded-md" />}
              </div>
            )}

            <label className="block text-sm text-gray-600 mb-1">Pilih Format Output</label>
            <select
              className="w-full border px-3 py-2 rounded-md text-gray-700 focus:outline-none"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              {getAvailableFormats().map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <button
              onClick={handleConvert}
              disabled={isConverting}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition w-full disabled:opacity-50"
            >
              {isConverting ? 'Mengonversi...' : 'Konversi Sekarang'}
            </button>

            {isConverting && (
              <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
              </div>
            )}

            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`converted.${selectedFormat.toLowerCase()}`}
                className="mt-4 block text-center text-blue-600 hover:underline"
              >
                Download Hasil
              </a>
            )}
          </div>
        )}
      </main>

      <footer className="w-full text-center text-sm text-gray-500 p-4 bg-white shadow">
        © 2025 FajrConvert
      </footer>
    </div>
  );
}

export default App;
