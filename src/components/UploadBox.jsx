import React, { useState, useRef } from 'react';

const UploadBox = () => {
  const [file, setFile] = useState(null);
  const [outputFormats, setOutputFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();

  const processFile = (uploadedFile) => {
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setConvertedUrl('');
    setPreviewUrl(URL.createObjectURL(uploadedFile));
    detectFileType(uploadedFile);
  };

  const detectFileType = (file) => {
    const type = file.type;
    let formats = [];

    if (type.startsWith('image/')) {
      formats = ['jpg', 'png', 'webp'];
    } else if (type.startsWith('audio/')) {
      formats = ['mp3', 'wav', 'ogg'];
    } else if (type.startsWith('video/')) {
      formats = ['mp4', 'webm'];
    } else if (type === 'application/pdf' || type.includes('text') || type.includes('word')) {
      formats = ['pdf', 'docx', 'txt'];
    } else if (type.includes('zip') || type.includes('rar')) {
      formats = ['zip', 'tar'];
    }

    setOutputFormats(formats);
    setSelectedFormat(formats[0]);
  };

  const handleConvert = async () => {
    if (!file || !selectedFormat) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('outputFormat', selectedFormat);

    setLoading(true);
    setProgress(10);

    try {
      const response = await fetch('https://74b78a0e-9569-484c-92f7-830f2b59ae41-00-3ckgf1rvks737.pike.replit.dev/api/convert', {
        method: 'POST',
        body: formData,
      });

      setProgress(80);

      const data = await response.json();
      setConvertedUrl(data.downloadUrl);
      setProgress(100);
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    processFile(selected);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📤 File Converter Online</h2>

      <div
        style={styles.dropZone}
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {file ? (
          <span style={styles.fileName}>📁 {file.name}</span>
        ) : (
          <span>Click or drop file here</span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {outputFormats.length > 0 && (
        <div style={styles.formatContainer}>
          {outputFormats.map((format) => (
            <button
              key={format}
              style={{
                ...styles.formatButton,
                backgroundColor: selectedFormat === format ? '#007bff' : '#eee',
                color: selectedFormat === format ? '#fff' : '#333',
              }}
              onClick={() => setSelectedFormat(format)}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {file && (
        <button style={styles.convertButton} onClick={handleConvert} disabled={loading}>
          {loading ? 'Mengonversi...' : 'Konversi File'}
        </button>
      )}

      {loading && (
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
        </div>
      )}

      {convertedUrl && (
        <div style={styles.previewSection}>
          <h4>Hasil:</h4>
          {selectedFormat.match(/(jpg|png|webp)/) && (
            <img src={convertedUrl} alt="Preview" style={styles.previewImg} />
          )}
          {selectedFormat.match(/(mp3|wav|ogg)/) && (
            <audio controls src={convertedUrl}></audio>
          )}
          {selectedFormat.match(/(mp4|webm)/) && (
            <video controls width="300" src={convertedUrl}></video>
          )}
          <a href={convertedUrl} download style={styles.downloadLink}>⬇️ Download File</a>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '30px',
    borderRadius: '15px',
    backgroundColor: '#f7f7f7',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
  },
  dropZone: {
    border: '2px dashed #aaa',
    borderRadius: '10px',
    padding: '30px',
    marginBottom: '15px',
    background: '#fff',
    color: '#777',
    cursor: 'pointer',
  },
  fileName: {
    color: '#555',
    fontWeight: 'bold',
  },
  formatContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '15px',
  },
  formatButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  convertButton: {
    marginTop: '20px',
    padding: '10px 25px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  progressBar: {
    marginTop: '20px',
    height: '8px',
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    transition: 'width 0.3s ease-in-out',
  },
  previewSection: {
    marginTop: '25px',
  },
  previewImg: {
    maxWidth: '100%',
    maxHeight: '250px',
    margin: '10px 0',
    borderRadius: '10px',
  },
  downloadLink: {
    display: 'inline-block',
    marginTop: '10px',
    textDecoration: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px 15px',
    borderRadius: '5px',
  },
};

export default UploadBox;
