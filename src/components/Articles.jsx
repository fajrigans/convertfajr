import React from "react";
import { Link } from "react-router-dom";

const ArticleCard = ({ title, content, date, articleId }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-700 text-lg mb-4">{content.slice(0, 300)}...</p>
      <p className="text-gray-500 text-sm">Published on {date}</p>
      <Link to={`/article/${articleId}`}>
        <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700">
          Read More
        </button>
      </Link>
    </div>
  );
};

const Articles = () => {
  const articles = [
    {
      id: "1",
      title: "Panduan Lengkap Konversi File untuk Pemula",
      content: "Konversi file adalah proses mengubah format file ke format lain agar dapat dibuka atau digunakan sesuai kebutuhan...",
      date: "2025-05-02",
    },
    {
      id: "2",
      title: "Cara Mengonversi Gambar Tanpa Kehilangan Kualitas",
      content: "Mengonversi gambar dengan kualitas terbaik bisa dilakukan dengan menggunakan beberapa tools dan teknik yang tepat...",
      date: "2025-05-01",
    },
    {
      id: "3",
      title: "Mengubah Format Video: Panduan Lengkap untuk Semua Orang",
      content: "Video adalah salah satu format file yang paling umum digunakan. Namun, terkadang Anda perlu mengubah format video untuk kompatibilitas...",
      date: "2025-04-30",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Artikel Terbaru</h1>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          title={article.title}
          content={article.content}
          date={article.date}
          articleId={article.id}
        />
      ))}
    </div>
  );
};

export default Articles;
