// src/pages/PrivacyPolicy.jsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800 dark:text-gray-200">
      <h1 className="text-2xl font-bold mb-4">Kebijakan Privasi</h1>
      <p className="mb-2">
        Kami di FajrConvert menghargai privasi Anda. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
      </p>
      <p className="mb-2">
        Kami menggunakan layanan pihak ketiga seperti Ezoic dan Google AdSense untuk menayangkan iklan. Layanan ini dapat menggunakan cookie atau pelacak lainnya.
      </p>
      <p className="mb-2">
        Anda dapat membaca lebih lanjut kebijakan Ezoic di: <a href="https://g.ezoic.net/privacy/fajrconvert.my.id" className="text-blue-600 underline">Kebijakan Privasi Ezoic</a>.
      </p>
      {/* Tambahkan info lainnya sesuai kebutuhan */}
    </div>
  );
};

export default PrivacyPolicy;
