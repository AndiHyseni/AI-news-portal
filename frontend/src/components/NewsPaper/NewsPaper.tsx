import React from "react";
import { News } from "../../types/news/news";
import "./NewsPaper.css";

interface NewsPaperProps {
  news: News[];
  categoryName: string;
}

export const NewsPaper = React.forwardRef<HTMLDivElement, NewsPaperProps>(
  ({ news, categoryName }, ref) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    return (
      <div ref={ref} className="newspaper-print">
        <div className="newspaper-header">
          <h1 className="newspaper-title">AI News Portal</h1>
          <div className="newspaper-meta">
            <p className="newspaper-date">
              {formatDate(new Date().toISOString())}
            </p>
            <p className="newspaper-category">{categoryName} Edition</p>
          </div>
        </div>

        <div className="newspaper-content">
          {news.map((article, index) => (
            <article key={index} className="newspaper-article">
              <div className="article-image-container">
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                />
              </div>
              <div className="article-content">
                <h2 className="article-title">{article.title}</h2>
                <p className="article-date">{formatDate(article.created_at)}</p>
                <p className="article-summary">{article.summary}</p>
                <div
                  className="article-text"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </article>
          ))}
        </div>

        <footer className="newspaper-footer">
          <p>
            © {new Date().getFullYear()} AI News Portal. All rights reserved.
          </p>
        </footer>
      </div>
    );
  }
);
