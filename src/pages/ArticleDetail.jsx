import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";  // Hook untuk ambil parameter URL

const ArticleDetail = () => {
  const { id } = useParams();  // Ambil ID artikel dari URL
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Pengambilan artikel berdasarkan ID (dari API atau database)
    fetch(`/api/articles/${id}`)  // Ganti dengan endpoint yang sesuai
      .then((response) => response.json())
      .then((data) => setArticle(data))
      .catch((error) => console.error("Error fetching article:", error));
  }, [id]);  // Ketika `id` berubah, effect ini akan dipanggil lagi

  if (!article) {
    return <div>Loading...</div>;  // Menunggu data artikel
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
};

export default ArticleDetail;
