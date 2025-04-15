import React, { useState } from "react";
import axios from "axios";

const UploadBox = () => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("mp3");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl(null);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const handleConvert = async () => {
    if (!file) return alert("⚠️ Pilih file terlebih dahulu");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    setLoading(true);
    try {
      const res = await axios.post(
        "https://74b78a0e-9569-484c-92f7-830f2b59ae41-00-3ckgf1rvks737.pike.replit.dev/api/convert",
        formData
      );

      setDownloadUrl(res.data.downloadUrl);
    } catch (err) {
      console.error("❌ Gagal mengonversi:", err.response?.data || err.message);
      alert("Gagal mengonversi file: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!downloadUrl) return null;

    if (["mp3", "wav", "ogg"].includes(format)) {
      return <audio controls src={downloadUrl} style={{ marginTop: "1rem" }} />;
    } else if (["mp4", "webm", "avi"].includes(format)) {
      return <video controls src={downloadUrl} style={{ marginTop: "1rem", maxWidth: "100%" }} />;
    } else if (["pdf", "docx", "txt"].includes(format)) {
      return (
        <div style={{ marginTop: "1rem" }}>
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            📄 Buka dokumen
          </a>
        </div>
      );
    } else if (["jpg", "jpeg", "png", "webp"].includes(format)) {
      return <img src={downloadUrl} alt="preview" style={{ marginTop: "1rem", maxWidth: "100%" }} />;
    } else {
      return (
        <div style={{ marginTop: "1rem" }}>
          <a href={downloadUrl} download>
            🔽 Download hasil
          </a>
        </div>
      );
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🎧 Convert Fajr</h2>

      <input type="file" onChange={handleFileChange} />
      <select value={format} onChange={handleFormatChange} style={{ marginLeft: "1rem" }}>
        <option value="mp3">mp3</option>
        <option value="wav">wav</option>
        <option value="ogg">ogg</option>
        <option value="jpg">jpg</option>
        <option value="png">png</option>
        <option value="webp">webp</option>
        <option value="pdf">pdf</option>
        <option value="docx">docx</option>
        <option value="txt">txt</option>
        <option value="mp4">mp4</option>
        <option value="webm">webm</option>
        <option value="avi">avi</option>
      </select>

      <button onClick={handleConvert} style={{ marginLeft: "1rem" }} disabled={loading}>
        {loading ? "Mengonversi..." : "Convert"}
      </button>

      {renderPreview()}
    </div>
  );
};

export default UploadBox;
