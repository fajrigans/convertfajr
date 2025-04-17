import React, { useState } from "react";
import axios from "axios";

const UploadBox = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [outputFormats, setOutputFormats] = useState([]);
  const [outputFormat, setOutputFormat] = useState("");
  const [convertedUrl, setConvertedUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const detectFileType = (file) => {
    const type = file.type;
    if (type.startsWith("image/")) {
      setFileType("image");
      setOutputFormats(["jpg", "jpeg", "png", "webp"]);
    } else if (type.startsWith("audio/")) {
      setFileType("audio");
      setOutputFormats(["mp3", "wav", "ogg"]);
    } else if (type.startsWith("video/")) {
      setFileType("video");
      setOutputFormats(["mp4", "webm", "mov"]);
    } else if (
      type === "application/pdf" ||
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type === "text/plain"
    ) {
      setFileType("document");
      setOutputFormats(["pdf", "docx", "txt"]);
    } else if (
      type === "application/zip" ||
      type === "application/x-rar-compressed" ||
      type === "application/gzip"
    ) {
      setFileType("archive");
      setOutputFormats(["zip", "tar", "gz"]);
    } else {
      setFileType("unknown");
      setOutputFormats([]);
    }
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setConvertedUrl("");
    detectFileType(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !outputFormat) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("outputFormat", outputFormat);

    setUploading(true);
    setProgress(0);
    try {
      const response = await axios.post("https://convertfajr-backend.yourdomain.com/api/convert", formData, {
        responseType: "blob",
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setConvertedUrl(url);
    } catch (error) {
      console.error("Conversion error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  return (
    <div className="upload-container">
      <h2>📦 File Converter Online</h2>

      <div
        className={`drop-area ${isDragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
      >
        📁 Drag & drop file here or click to browse
      </div>

      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e.target.files[0])}
      />

      {selectedFile && (
        <div className="preview-section">
          <p><strong>File:</strong> {selectedFile.name}</p>

          {fileType === "image" && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="preview"
              className="preview-image"
            />
          )}

          {outputFormats.length > 0 && (
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
            >
              <option value="">Pilih format output</option>
              {outputFormats.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          )}

          <button onClick={handleUpload} disabled={uploading || !outputFormat}>
            {uploading ? "Converting..." : "Convert"}
          </button>

          {uploading && <div className="progress-bar"><div style={{ width: `${progress}%` }} /></div>}
        </div>
      )}

      {convertedUrl && (
        <div className="download-section">
          <a href={convertedUrl} download>
            ⬇️ Download File
          </a>
        </div>
      )}

      <style>{`
        .upload-container {
          max-width: 480px;
          margin: 60px auto;
          padding: 24px;
          border-radius: 16px;
          background-color: var(--bg);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', sans-serif;
          color: var(--text);
        }

        .drop-area {
          border: 2px dashed #999;
          padding: 40px;
          text-align: center;
          border-radius: 12px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .drop-area.dragging {
          background-color: #f0f0f0;
        }

        .preview-section {
          margin-top: 20px;
        }

        .preview-image {
          width: 100%;
          max-height: 240px;
          object-fit: contain;
          margin-top: 12px;
          border-radius: 8px;
        }

        select {
          padding: 8px;
          border-radius: 8px;
          margin: 12px 0;
          width: 100%;
        }

        button {
          padding: 10px 20px;
          background-color: #0084ff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          width: 100%;
        }

        .progress-bar {
          margin-top: 10px;
          width: 100%;
          height: 10px;
          background-color: #eee;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-bar > div {
          height: 100%;
          background-color: #00c853;
          width: 0%;
          transition: width 0.3s;
        }

        .download-section {
          margin-top: 20px;
          text-align: center;
        }

        a {
          background: #00c853;
          color: white;
          padding: 10px 16px;
          border-radius: 8px;
          text-decoration: none;
        }

        :root {
          --bg: #f9fafb;
          --text: #111;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #1e1e1e;
            --text: #eee;
          }

          .drop-area {
            border-color: #555;
          }

          button {
            background-color: #007acc;
          }

          .progress-bar {
            background-color: #444;
          }

          .progress-bar > div {
            background-color: #80e27e;
          }
        }
      `}</style>
    </div>
  );
};

export default UploadBox;
