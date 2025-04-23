import React, { useState } from "react";

const UploadBox = () => {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("");
  const [convertedFileUrl, setConvertedFileUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  const fileTypeMap = {
    image: ["jpg", "png", "webp"],
    audio: ["mp3", "wav", "ogg"],
    video: ["mp4", "webm"],
    document: ["pdf", "docx", "txt"],
    archive: ["zip", "tar", "rar"],
  };

  const detectFileCategory = (type) => {
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("audio/")) return "audio";
    if (type.startsWith("video/")) return "video";
    if (type.includes("pdf") || type.includes("word") || type.includes("text"))
      return "document";
    if (type.includes("zip") || type.includes("rar") || type.includes("tar"))
      return "archive";
    return null;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setConvertedFileUrl("");
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    const category = detectFileCategory(selectedFile.type);
    const defaultFormat = fileTypeMap[category]?.[0] || "";
    setOutputFormat(defaultFormat);
  };

  const handleConvert = async () => {
    if (!file || !outputFormat) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("outputFormat", outputFormat);

    setIsConverting(true);
    setProgress(30);

    try {
      const response = await fetch("https://convertfajr-backend-production-4294.up.railway.app/api/convert", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.url) {
        const fullUrl = `https://convertfajr-backend-production-4294.up.railway.app${data.url}`;

        // Ambil file dari server dan convert ke blob
        const fileResponse = await fetch(fullUrl);
        const blob = await fileResponse.blob();

        // Buat URL lokal untuk preview
        const localUrl = URL.createObjectURL(blob);
        setConvertedFileUrl(localUrl);
        setProgress(100);

        // Auto download file
        const a = document.createElement("a");
        a.href = localUrl;
        a.download = `converted.${outputFormat}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("Konversi gagal.");
        setProgress(0);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan saat konversi.");
      setProgress(0);
    }

    setIsConverting(false);
  };

  return (
    <div style={styles.uploadBox}>
      <h2>Konversi File Otomatis</h2>

      <div
        style={styles.dropZone}
        onClick={() => document.getElementById("fileInput").click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileChange({ target: { files: e.dataTransfer.files } });
        }}
      >
        {file ? <p>{file.name}</p> : <p>Drag & drop file di sini atau klik</p>}
        <input
          id="fileInput"
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {file && (
        <div style={styles.options}>
          <label>Format Output:</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            style={styles.select}
          >
            {fileTypeMap[detectFileCategory(file.type)]?.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>
      )}

      {file && (
        <button
          onClick={handleConvert}
          disabled={isConverting}
          style={styles.button}
        >
          {isConverting ? "Mengonversi..." : "Konversi"}
        </button>
      )}

      {progress > 0 && progress < 100 && (
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressInner, width: `${progress}%` }}></div>
        </div>
      )}

      {convertedFileUrl && (
        <div style={styles.previewSection}>
          <h4>Preview Hasil:</h4>
          {outputFormat.match(/(jpg|png|webp)/) && (
            <img src={convertedFileUrl} alt="Hasil" width="200" />
          )}
          {outputFormat.match(/(mp3|wav|ogg)/) && (
            <audio controls src={convertedFileUrl}></audio>
          )}
          {outputFormat.match(/(mp4|webm)/) && (
            <video controls src={convertedFileUrl} width="300"></video>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  uploadBox: {
    background: "#2e2e2e",
    color: "white",
    padding: "2rem",
    borderRadius: "16px",
    maxWidth: "500px",
    margin: "auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  dropZone: {
    border: "2px dashed #aaa",
    padding: "2rem",
    cursor: "pointer",
    marginBottom: "1rem",
    borderRadius: "12px",
  },
  options: {
    marginBottom: "1rem",
  },
  select: {
    marginLeft: "10px",
    padding: "0.4rem",
    borderRadius: "6px",
    border: "1px solid #999",
  },
  button: {
    background: "#5c5cff",
    border: "none",
    padding: "0.5rem 1.5rem",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "1rem",
  },
  progressBar: {
    background: "#444",
    height: "10px",
    borderRadius: "5px",
    overflow: "hidden",
    marginTop: "10px",
  },
  progressInner: {
    background: "#5c5cff",
    height: "100%",
    transition: "width 0.3s",
  },
  previewSection: {
    marginTop: "1rem",
    textAlign: "center",
  },
};

export default UploadBox;
