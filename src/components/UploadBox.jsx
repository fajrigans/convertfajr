import React, { useState, useRef } from "react";

const formatOptions = {
  image: ["jpg", "png", "webp"],
  audio: ["mp3", "ogg", "wav"],
  video: ["mp4", "webm", "mov"],
  document: ["pdf", "docx", "txt"],
  archive: ["zip", "tar", "rar"],
};

const detectFileType = (mime) => {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  if (mime.includes("pdf") || mime.includes("officedocument")) return "document";
  if (mime.includes("zip") || mime.includes("rar") || mime.includes("gzip")) return "archive";
  return null;
};

const UploadBox = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const inputRef = useRef();

  const handleFileSelect = (selected) => {
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setDownloadUrl(null);
    const type = detectFileType(selected.type);
    setFileType(type);
    setSelectedFormat(formatOptions[type]?.[0] || "");
  };

  const handleConvert = async () => {
    if (!file || !selectedFormat) return;

    setIsConverting(true);
    setProgress(30);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", selectedFormat);

    try {
      const response = await fetch("https://74b78a0e-9569-484c-92f7-830f2b59ae41-00-3ckgf1rvks737.pike.replit.dev/api/convert", {
        method: "POST",
        body: formData,
      });

      setProgress(70);
      const data = await response.json();
      if (data.downloadUrl) {
        setProgress(100);
        setDownloadUrl(`https://74b78a0e-9569-484c-92f7-830f2b59ae41-00-3ckgf1rvks737.pike.replit.dev${data.downloadUrl}`);
      } else {
        alert("Gagal konversi file.");
        setProgress(0);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat konversi.");
      setProgress(0);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div
        style={styles.dropZone}
        onClick={() => inputRef.current.click()}
      >
        <p style={styles.text}>
          {file ? `📁 ${file.name}` : "Klik atau tarik file ke sini"}
        </p>
        <input
          type="file"
          style={{ display: "none" }}
          ref={inputRef}
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />
      </div>

      {fileType && (
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          style={styles.select}
        >
          {formatOptions[fileType].map((fmt) => (
            <option key={fmt} value={fmt}>
              .{fmt}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={handleConvert}
        disabled={!file || isConverting}
        style={styles.button}
      >
        {isConverting ? "Mengonversi..." : "Konversi File"}
      </button>

      {progress > 0 && (
        <div style={styles.progressWrapper}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }} />
        </div>
      )}

      {previewUrl && (
        <div style={styles.preview}>
          {file.type.startsWith("image/") && <img src={previewUrl} style={{ maxWidth: "100%" }} />}
          {file.type.startsWith("audio/") && <audio controls src={previewUrl} />}
          {file.type.startsWith("video/") && <video controls width="100%" src={previewUrl} />}
        </div>
      )}

      {downloadUrl && (
        <a href={downloadUrl} download style={styles.download}>
          ⬇️ Unduh File Hasil
        </a>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: 480,
    margin: "50px auto",
    padding: 30,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  dropZone: {
    padding: 40,
    border: "2px dashed #ccc",
    borderRadius: 10,
    cursor: "pointer",
    marginBottom: 10,
  },
  text: { fontSize: 16, color: "#444" },
  select: {
    marginTop: 10,
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    padding: "12px 24px",
    fontSize: "1rem",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
  },
  progressWrapper: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginTop: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    transition: "width 0.3s ease",
  },
  preview: {
    marginTop: 20,
  },
  download: {
    display: "inline-block",
    marginTop: 20,
    textDecoration: "none",
    color: "#4CAF50",
    fontWeight: "bold",
  },
};

export default UploadBox;
