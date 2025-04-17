import React, { useState, useRef } from "react";

const UploadBox = () => {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [availableFormats, setAvailableFormats] = useState([]);
  const dropRef = useRef();

  const detectFileType = (file) => {
    const type = file.type;
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("audio/")) return "audio";
    if (type.startsWith("video/")) return "video";
    if (type === "application/pdf" || type.includes("word") || type.includes("text")) return "document";
    if (type === "application/zip" || type === "application/x-rar-compressed") return "archive";
    return "other";
  };

  const getFormatsForType = (type) => {
    switch (type) {
      case "image": return ["jpg", "png", "webp"];
      case "audio": return ["mp3", "wav", "ogg"];
      case "video": return ["mp4", "webm"];
      case "document": return ["pdf", "txt", "docx"];
      case "archive": return ["zip"];
      default: return [];
    }
  };

  const handleFileInput = (selectedFile) => {
    setFile(selectedFile);
    setDownloadLink("");
    setOutputFormat("");
    setProgress(0);

    const fileType = detectFileType(selectedFile);
    const formats = getFormatsForType(fileType);
    setAvailableFormats(formats);

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type.startsWith("audio/") || selectedFile.type.startsWith("video/")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.style.border = "2px dashed #aaa";
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileInput(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.style.border = "2px solid #00c6ff";
  };

  const handleDragLeave = () => {
    dropRef.current.style.border = "2px dashed #aaa";
  };

  const handleUpload = async () => {
    if (!file || !outputFormat) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("outputFormat", outputFormat);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://74b78a0e-9569-484c-92f7-830f2b59ae41-00-3ckgf1rvks737.pike.replit.dev/api/convert", true);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      const res = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        setDownloadLink(`https://74b78a0e-9569-484c-92f7-830f2b59ae41-00-3ckgf1rvks737.pike.replit.dev/download/${res.filename}`);
      } else {
        alert("Conversion failed");
      }
    };
    xhr.send(formData);
  };

  return (
    <div style={styles.container}>
      <h2>🎛️ File Converter</h2>

      <div
        ref={dropRef}
        style={styles.dropzone}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p>📂 Drag & drop file here</p>
        <p>or</p>
        <input type="file" onChange={(e) => handleFileInput(e.target.files[0])} />
      </div>

      {availableFormats.length > 0 && (
        <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} style={styles.select}>
          <option value="">Pilih format output</option>
          {availableFormats.map((format) => (
            <option key={format} value={format}>{format.toUpperCase()}</option>
          ))}
        </select>
      )}

      {file && outputFormat && (
        <button onClick={handleUpload} style={styles.button}>Convert</button>
      )}

      {progress > 0 && progress < 100 && <p>Uploading: {progress}%</p>}

      {preview && (
        <div style={styles.previewBox}>
          {file.type.startsWith("image/") && <img src={preview} alt="Preview" style={{ maxWidth: "100%" }} />}
          {file.type.startsWith("audio/") && <audio controls src={preview} />}
          {file.type.startsWith("video/") && <video controls src={preview} style={{ maxWidth: "100%" }} />}
        </div>
      )}

      {downloadLink && (
        <a href={downloadLink} download style={styles.downloadLink}>⬇ Download File</a>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 500,
    margin: "auto",
    padding: 20,
    background: "#1e1e1e",
    color: "#fff",
    borderRadius: 10,
    textAlign: "center",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
    fontFamily: "sans-serif",
  },
  dropzone: {
    border: "2px dashed #aaa",
    borderRadius: 8,
    padding: 30,
    marginBottom: 10,
    backgroundColor: "#2c2c2c",
    cursor: "pointer",
  },
  select: {
    marginTop: 10,
    padding: 8,
    fontSize: 16,
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  button: {
    marginTop: 10,
    padding: "10px 20px",
    fontSize: 16,
    background: "#00c6ff",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  previewBox: {
    marginTop: 20,
  },
  downloadLink: {
    marginTop: 20,
    display: "inline-block",
    padding: "10px 15px",
    background: "#4caf50",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 5,
  },
};

export default UploadBox;
