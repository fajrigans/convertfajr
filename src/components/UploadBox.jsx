import React, { useState } from "react";
import axios from "axios";

const UploadBox = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [format, setFormat] = useState("mp4");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setDownloadUrl("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setDownloadUrl("");
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("format", format);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/convert", formData, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setDownloadUrl(url);
    } catch (error) {
      alert("Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center shadow-sm bg-white">
        <div className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <img src="/_logoconvertfajr" alt="Logo" className="w-6 h-6" />
          <span>Fajr<span className="text-gray-800">Convert</span></span>
        </div>
        <nav>
          <a href="#" className="text-gray-700 hover:text-blue-600 transition">Home</a>
        </nav>
      </header>

      {/* Main Upload Box */}
      <main className="flex-grow flex items-center justify-center px-4 py-12"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}>
        <div className="w-full max-w-md bg-white p-6 border border-dashed border-gray-300 rounded-xl text-center shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Upload File</h2>
          <p className="text-sm text-gray-500 mb-4">Drag & drop or select a file to convert</p>
          <input
            type="file"
            accept="video/*,audio/*,image/*"
            onChange={handleFileChange}
            className="mb-4"
          />
          {selectedFile && (
            <div className="text-sm text-gray-600 mb-4">
              Selected: {selectedFile.name}
            </div>
          )}
          <select
            className="mb-4 p-2 border rounded w-full"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="mp4">MP4</option>
            <option value="avi">AVI</option>
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleConvert}
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert"}
          </button>
          {downloadUrl && (
            <div className="mt-4">
              <a
                href={downloadUrl}
                download={`converted.${format}`}
                className="text-blue-600 underline"
              >
                Download Converted File
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © 2025 FajrConvert
      </footer>
    </div>
  );
};

export default UploadBox;
