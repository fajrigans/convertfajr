const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static("converted"));

const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "converted");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Tambahkan daftar format gambar
const imageFormats = ["png", "jpg", "jpeg", "bmp", "webp"];

app.post("/api/convert", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const targetFormat = req.body.format;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    console.log(`✅ Received file: ${file.originalname}`);
    console.log(`🎯 Target format: ${targetFormat}`);

    const inputFilePath = file.path;
    const outputFilename = `${Date.now()}.${targetFormat}`;
    const outputFilePath = path.join(outputDir, outputFilename);

    if (!fs.existsSync(inputFilePath)) {
      return res.status(500).json({ error: "Uploaded file not found on server." });
    }

    let command = ffmpeg(inputFilePath);

    if (imageFormats.includes(targetFormat)) {
      command = command.outputOptions("-frames:v 1"); // untuk gambar
    }

    command
      .output(outputFilePath)
      .on("end", () => {
        fs.unlinkSync(inputFilePath);
        console.log(`✅ Conversion complete: ${outputFilename}`);
        res.json({
          downloadUrl: `http://localhost:${PORT}/${outputFilename}`,
        });
      })
      .on("error", (err) => {
        console.error("❌ Conversion error:", err.message);
        res.status(500).json({ error: "Conversion failed", details: err.message });
      })
      .run();
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
