import React from "react";
import { useParams } from "react-router-dom";
import articles from "../content/articles.json";

function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return <div><h2>Artikel tidak ditemukan</h2></div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>{article.title}</h1>
      <p style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>{article.content}</p>
    </div>
  );
}

export default ArticlePage;
