import React from "react";
import UploadBox from "./components/UploadBox";
import _logoconverfajr from "./assets/_logoconverfajr.png"; // pastikan logo.png kamu taruh di folder src/assets/

const fileTypes = {
  jpg: ["png", "webp"],
  png: ["jpg", "webp"],
  gif: ["png", "webp"],
  tiff: ["jpg", "png"],
  bmp: ["jpg", "png"],
  pdf: ["jpg", "png"],
  mp3: ["wav", "ogg"],
  wav: ["mp3", "ogg"],
  ogg: ["mp3", "wav"],
  opus: ["mp3", "wav"],
  txt: ["pdf", "docx"],
  docx: ["pdf", "txt"],
  rtf: ["pdf", "txt"],
  zip: ["tar", "rar"],
  rar: ["zip", "tar"],
  tar: ["zip", "rar"],
  gzip: ["zip", "tar"],
  mp4: ["webm", "avi"],
  mov: ["mp4", "webm"],
  avi: ["mp4", "webm"],
  webm: ["mp4", "avi"],
};

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={_logoconverfajr} alt="Logo" className="h-8 w-auto" />
          <span className="font-bold text-xl"><span className="text-sm font-normal ml-1"></span></span>
        </div>
        <a href="#" className="text-blue-600 font-medium">Home</a>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <UploadBox fileTypes={fileTypes} />
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm border-t">
        © 2025 FajrConvert
      </footer>
    </div>
  );
};

export default App;
