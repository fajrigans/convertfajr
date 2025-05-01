import React from "react";
import { Link } from "react-router-dom";
import articles from "../content/articles.json";

function ArticlesList() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2>Artikel Panduan & Tips Konversi</h2>
      <ul style={{ marginTop: "1.5rem" }}>
        {articles.map((article) => (
          <li key={article.slug} style={{ marginBottom: "1rem" }}>
            <Link to={`/articles/${article.slug}`} style={{ textDecoration: "none", color: "#0077cc" }}>
              <strong>{article.title}</strong>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArticlesList;
