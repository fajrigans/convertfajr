import React, { useState } from "react";

const UploadBox = () => {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [previewType, setPreviewType] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleConvert = async () => {
    if (!file || !outputFormat) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", outputFormat);

    setIsLoading(true);
    setDownloadUrl(null);
    setPreviewType("");

    try {
      const response = await fetch(
        "https://74b78a0e-9569-484c-92f7-830f2b59ae41-00-3ckgf1rvks737.pike.replit.dev/api/convert",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      if (data.downloadUrl) {
        const url = `https://74b78a0e-9569-484c-92f7-830f2b59ae41-00-3ckgf1rvks737.pike.replit.dev${data.downloadUrl}`;
        setDownloadUrl(url);

        const ext = outputFormat.toLowerCase();
        if (["jpg", "jpeg", "png", "webp"].includes(ext)) {
          setPreviewType("image");
        } else if (["mp3", "wav", "ogg", "opus"].includes(ext)) {
          setPreviewType("audio");
        } else if (["mp4", "webm", "mov"].includes(ext)) {
          setPreviewType("video");
        } else if (["pdf"].includes(ext)) {
          setPreviewType("pdf");
        } else {
          setPreviewType("download");
        }
      } else {
        alert("Konversi gagal.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Terjadi kesalahan saat konversi.");
    } finally {
      setIsLoading(false);
    }
  };

  const boxStyle = {
    backgroundColor: "#f8f9fa",
    color: "#333",
    border: "2px dashed #ccc",
    padding: "30px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    margin: "30px auto",
    textAlign: "center",
    transition: "0.3s ease",
  };

  const draggingStyle = {
    ...boxStyle,
    backgroundColor: "#e9ecef",
    borderColor: "#999",
  };

  const dropAreaStyle = {
    border: "2px dashed #999",
    padding: "20px",
    marginBottom: "20px",
    cursor: "pointer",
    borderRadius: "10px",
    position: "relative",
    backgroundColor: "#ffffff",
  };

  const fileInputStyle = {
    position: "absolute",
    opacity: 0,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    cursor: "pointer",
  };

  const selectStyle = {
    padding: "10px",
    margin: "10px 0",
    width: "100%",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "10px",
    marginTop: "10px",
    width: "100%",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: isLoading ? "#aaa" : "#28a745",
    color: "#fff",
    fontWeight: "bold",
    cursor: isLoading ? "not-allowed" : "pointer",
    transition: "0.2s ease",
  };

  return (
    <div style={isDragging ? draggingStyle : boxStyle}>
      <h2>🚀 Konversi File Online</h2>

      <div
        style={dropAreaStyle}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {file ? (
          <p>📄 {file.name}</p>
        ) : (
          <p>Tarik file ke sini atau klik untuk memilih</p>
        )}
        <input type="file" onChange={handleFileChange} style={fileInputStyle} />
      </div>

      <select
        value={outputFormat}
        onChange={(e) => setOutputFormat(e.target.value)}
        style={selectStyle}
      >
        <option value="">Pilih format output</option>
        <option value="jpg">JPG</option>
        <option value="png">PNG</option>
        <option value="webp">WEBP</option>
        <option value="mp3">MP3</option>
        <option value="wav">WAV</option>
        <option value="ogg">OGG</option>
        <option value="mp4">MP4</option>
        <option value="webm">WEBM</option>
        <option value="pdf">PDF</option>
        <option value="txt">TXT</option>
      </select>

      <button
        onClick={handleConvert}
        disabled={!file || !outputFormat || isLoading}
        style={buttonStyle}
      >
        {isLoading ? "⏳ Mengonversi..." : "Konversi"}
      </button>

      {downloadUrl && (
        <div style={{ marginTop: "20px" }}>
          <h4>Hasil:</h4>
          {previewType === "image" && (
            <img
              src={downloadUrl}
              alt="Preview"
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
          )}
          {previewType === "audio" && (
            <audio controls src={downloadUrl} style={{ width: "100%" }} />
          )}
          {previewType === "video" && (
            <video controls src={downloadUrl} style={{ width: "100%" }} />
          )}
          {previewType === "pdf" && (
            <iframe
              src={downloadUrl}
              title="Preview PDF"
              style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
            />
          )}
          {previewType === "download" && (
            <a href={downloadUrl} download style={{ color: "#007bff" }}>
              📥 Klik untuk unduh ulang
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadBox;
