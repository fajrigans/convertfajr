// src/components/UploadBox.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineCloudUpload } from "react-icons/ai";

const UploadBox = () => {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("");
  const [availableFormats, setAvailableFormats] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const detectAvailableFormats = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    const formats = {
      image: ["jpg", "jpeg", "png", "webp"],
      audio: ["mp3", "wav", "ogg"],
      video: ["mp4", "webm", "mov"],
      document: ["pdf", "txt", "docx"],
      archive: ["zip", "tar", "rar", "gz"]
    };

    let type = "";
    if (["jpg", "jpeg", "png", "webp", "gif", "tiff", "bmp"].includes(ext)) type = "image";
    else if (["mp3", "wav", "ogg", "opus", "mpeg"].includes(ext)) type = "audio";
    else if (["mp4", "webm", "mov", "avi", "flv", "wmv", "mpegps", "3gp"].includes(ext)) type = "video";
    else if (["pdf", "txt", "docx", "rtf"].includes(ext)) type = "document";
    else if (["zip", "tar", "rar", "gz"].includes(ext)) type = "archive";

    setAvailableFormats(formats[type] || []);
    setOutputFormat((formats[type] || [])[0] || "");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      detectAvailableFormats(selectedFile.name);
      setDownloadUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !outputFormat) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("outputFormat", outputFormat);

    try {
      const response = await axios.post(
        "https://74b78a0e-9569-484c-92f7-830f2b59ae41-00-3ckgf1rvks737.pike.replit.dev/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            }
          },
        }
      );
      setDownloadUrl(response.data.downloadUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Terjadi kesalahan saat mengunggah file");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setOutputFormat("");
    setAvailableFormats([]);
    setDownloadUrl(null);
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 w-full max-w-md transition-all">
        {!file ? (
          <label
            htmlFor="file"
            className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-600 p-6 rounded-xl text-gray-600 dark:text-gray-300 hover:border-blue-500"
          >
            <AiOutlineCloudUpload size={48} className="mb-2" />
            <p className="font-semibold text-center">Klik atau tarik file ke sini</p>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={file.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <p className="text-lg font-medium text-gray-800 dark:text-white">
                  {file.name}
                  <button
                    className="text-red-500 ml-2"
                    onClick={removeFile}
                  >
                    Hapus
                  </button>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pilih Format Output
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                >
                  {availableFormats.map((format) => (
                    <option key={format} value={format}>
                      {format.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleUpload}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                disabled={uploading}
              >
                {uploading ? `Mengunggah... (${progress}%)` : "Konversi Sekarang"}
              </button>

              {uploading && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-600 dark:text-blue-400 hover:underline text-center"
                >
                  Download File
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default UploadBox;
