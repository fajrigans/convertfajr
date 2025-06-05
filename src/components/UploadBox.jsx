import React, { useState } from "react";

const UploadBox = () => {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("");
  const [convertedFileUrl, setConvertedFileUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false); // NEW

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
    if (type.includes("pdf") || type.includes("word") || type.includes("text")) return "document";
    if (type.includes("zip") || type.includes("rar") || type.includes("tar")) return "archive";
    return null;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 50 * 1024 * 1024) {
      // Replaced alert with a custom message handling
      showMessage("Ukuran File Terlalu Besar", "Ukuran file melebihi batas 50MB.");
      return;
    }

    setFile(selectedFile);
    setConvertedFileUrl("");
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    const category = detectFileCategory(selectedFile.type);
    const defaultFormat = fileTypeMap[category]?.[0] || "";
    setOutputFormat(defaultFormat);
  };

  const handleConvert = async () => {
    if (!file || !outputFormat) {
      // Replaced alert with a custom message handling
      showMessage("Peringatan", "Pilih file dan format output terlebih dahulu.");
      return;
    }

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

        const fileResponse = await fetch(fullUrl);
        const blob = await fileResponse.blob();

        const localUrl = URL.createObjectURL(blob);
        setConvertedFileUrl(localUrl);
        setProgress(100);

        const a = document.createElement("a");
        a.href = localUrl;
        a.download = `converted.${outputFormat}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        // Replaced alert with a custom message handling
        showMessage("Konversi Gagal", "Konversi gagal. Format tidak sesuai atau file tidak valid.");
        setProgress(0);
      }
    } catch (err) {
      console.error("Error:", err);
      // Replaced alert with a custom message handling
      showMessage("Kesalahan", "Terjadi kesalahan saat konversi.");
      setProgress(0);
    }

    setIsConverting(false);
  };

  // Custom message modal functions
  const showMessage = (title, text) => {
    document.getElementById("message-modal-title").innerText = title;
    document.getElementById("message-modal-text").innerText = text;
    document.getElementById("message-modal").classList.remove("hidden");
  };

  const hideMessage = () => {
    document.getElementById("message-modal").classList.add("hidden");
  };

  // Main App Component with Ad Layout
  return (
    // Flex container to hold left ad, main content, and right ad
    <div className="flex justify-center items-stretch min-h-screen bg-gray-100 p-4 lg:p-8">

      {/* Left Ad Sidebar (hidden on small screens, shown on large screens) */}
      {/* Note: In a real scenario, you'd handle ad loading and display more robustly. */}
      <aside className="hidden lg:flex w-[120px] flex-shrink-0 mr-8 items-center justify-center overflow-hidden">
        <div className="sticky top-4">
          {/* Ad Code for Left Sidebar */}
          <ins style={{ width: '120px', height: '600px', display: 'block' }} data-width="120" data-height="600" className="kd61ac79696" data-domain="//data963.click" data-affquery="/7f5b626c906376c2d2f4/d61ac79696/?placementName=farjconvert">
            <script src="//data963.click/js/responsive.js" async></script>
          </ins>
        </div>
      </aside>

      {/* Main Content (UploadBox) */}
      {/* The UploadBox component is centered and takes up available width */}
      <div className="flex-grow flex justify-center items-start">
        <div style={styles.uploadBox} className="w-full max-w-xl"> {/* Added Tailwind classes for responsiveness */}
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Konversi File Otomatis</h2>

          <div
            style={styles.dropZone}
            onClick={() => document.getElementById("fileInput").click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange({ target: { files: e.dataTransfer.files } });
            }}
            className="border-2 border-dashed border-gray-300 p-8 rounded-xl cursor-pointer mb-6 bg-white transition duration-200 hover:border-indigo-400"
          >
            {file ? (
              <>
                <p className="text-lg font-medium text-gray-700">{file.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Ukuran: {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </>
            ) : (
              <p className="text-lg text-gray-500">Drag & drop file di sini atau klik untuk memilih</p>
            )}
            <input id="fileInput" type="file" hidden onChange={handleFileChange} />
          </div>

          {file && (
            <div style={styles.options} className="mb-6 flex items-center justify-center">
              <label className="text-gray-700 font-medium mr-2">Format Output:</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                style={styles.select}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
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
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConverting ? "Mengonversi..." : "Konversi"}
            </button>
          )}

          {progress > 0 && progress < 100 && (
            <div style={styles.progressBar} className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
              <div style={{ ...styles.progressInner, width: `${progress}%` }} className="bg-indigo-600 h-2.5 rounded-full"></div>
            </div>
          )}

          {convertedFileUrl && (
            <div style={styles.previewSection} className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xl font-semibold mb-4 text-gray-700">Preview Hasil:</h4>
              {outputFormat.match(/(jpg|png|webp)/) && (
                <img src={convertedFileUrl} alt="Hasil Konversi" className="max-w-full h-auto mx-auto rounded-md shadow-sm" />
              )}
              {outputFormat.match(/(mp3|wav|ogg)/) && (
                <audio controls src={convertedFileUrl} className="w-full mt-4"></audio>
              )}
              {outputFormat.match(/(mp4|webm)/) && (
                <video controls src={convertedFileUrl} className="max-w-full h-auto mx-auto mt-4 rounded-md shadow-sm"></video>
              )}
            </div>
          )}

          <div style={styles.privacyLink} className="mt-8 text-sm text-gray-500">
            Dengan melanjutkan, Anda menyetujui <button onClick={() => showMessage("Kebijakan Privasi", "Ini adalah contoh teks Kebijakan Privasi Anda. Tambahkan konten kebijakan privasi aktual Anda di sini.")} style={styles.linkButton} className="text-indigo-600 hover:underline">Ketentuan Penggunaan</button> kami.
          </div>
        </div>
      </div>

      {/* Right Ad Sidebar (hidden on small screens, shown on large screens) */}
      <aside className="hidden lg:flex w-[120px] flex-shrink-0 ml-8 items-center justify-center overflow-hidden">
        <div className="sticky top-4">
          {/* Ad Code for Right Sidebar */}
          <ins style={{ width: '120px', height: '600px', display: 'block' }} data-width="120" data-height="600" className="kd61ac79696" data-domain="//data963.click" data-affquery="/7f5b626c906376c2d2f4/d61ac79696/?placementName=farjconvert">
            <script src="//data963.click/js/responsive.js" async></script>
          </ins>
        </div>
      </aside>

      {/* Message Modal (reused from Kaspocket HTML) */}
      <div id="message-modal" className="modal hidden">
        <div className="message-modal-content">
          <span id="close-message-modal-button" className="modal-close-button" onClick={hideMessage}>&times;</span>
          <h3 id="message-modal-title" className="text-xl font-semibold mb-3"></h3>
          <p id="message-modal-text" className="text-gray-700 mb-4"></p>
          <button id="ok-message-modal-button" className="btn-primary" onClick={hideMessage}>OK</button>
        </div>
      </div>

    </div>
  );
};

// Styles object remains largely the same, but Tailwind is preferred for styling directly in JSX
const styles = {
  // Keeping uploadBox, dropZone, options, select, button, progressBar, progressInner, previewSection, privacyLink, linkButton, section for consistency
  // but many of these styles are now covered by Tailwind classes directly in the JSX.
  // The 'style' prop can still be used for dynamic or very specific inline styles not easily covered by Tailwind.
  uploadBox: {
    background: "#f2f2f2",
    color: "#333",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Inter, sans-serif", // Changed to Inter font
    textAlign: "center",
  },
  dropZone: {
    // border: "2px dashed #ccc", // Covered by Tailwind
    // padding: "2rem", // Covered by Tailwind
    // cursor: "pointer", // Covered by Tailwind
    // marginBottom: "1rem", // Covered by Tailwind
    // borderRadius: "12px", // Covered by Tailwind
    background: "#fff",
  },
  options: {
    // marginBottom: "1rem", // Covered by Tailwind
  },
  select: {
    // marginLeft: "10px", // Covered by Tailwind mr-2 on label
    // padding: "0.4rem", // Covered by Tailwind
    // borderRadius: "6px", // Covered by Tailwind
    // border: "1px solid #ccc", // Covered by Tailwind
    background: "#fff",
    color: "#333",
  },
  button: {
    // background: "#4a90e2", // Covered by Tailwind
    border: "none",
    // padding: "0.5rem 1.5rem", // Covered by Tailwind
    // color: "#fff", // Covered by Tailwind
    // borderRadius: "8px", // Covered by Tailwind
    // cursor: "pointer", // Covered by Tailwind
    // marginTop: "1rem", // Covered by Tailwind
    // fontWeight: "bold", // Covered by Tailwind
  },
  progressBar: {
    // background: "#ddd", // Covered by Tailwind
    // height: "10px", // Covered by Tailwind
    // borderRadius: "5px", // Covered by Tailwind
    overflow: "hidden",
    // marginTop: "10px", // Covered by Tailwind
  },
  progressInner: {
    // background: "#4a90e2", // Covered by Tailwind
    // height: "100%", // Covered by Tailwind
    transition: "width 0.3s",
  },
  previewSection: {
    // marginTop: "1rem", // Covered by Tailwind
    textAlign: "center",
  },
  privacyLink: {
    // marginTop: "2rem", // Covered by Tailwind
    // fontSize: "0.9rem", // Covered by Tailwind
    // opacity: 0.7, // Tailwind equivalent is text-opacity-70 or direct rgba
  },
  linkButton: {
    background: "none",
    border: "none",
    // color: "#4a90e2", // Covered by Tailwind
    cursor: "pointer",
    // textDecoration: "underline", // Covered by Tailwind
    // fontSize: "0.9rem", // Covered by Tailwind
    padding: 0,
  },
  section: {
    marginBottom: "2rem",
    textAlign: "left",
  },
  // Modal styles for message modal - copied from your HTML, adapted for React className
  modal: {
    position: 'fixed',
    zIndex: 1000,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fefefe',
    margin: 'auto',
    padding: '2.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
    textAlign: 'center',
  },
  messageModalContent: {
    backgroundColor: '#fefefe',
    margin: 'auto',
    padding: '2.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    width: '90%',
    maxWidth: '400px',
    position: 'relative',
    textAlign: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: '1rem',
    right: '1.5rem',
    color: '#aaa',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};

export default UploadBox;
