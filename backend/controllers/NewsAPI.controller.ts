import { NextFunction, Request, Response, Router } from "express";
import {
  NewsAPIService,
  NewsAPIArticle,
} from "../services/newsapi/NewsAPI.service";
import { failure, ok } from "../utils";
import { StatusCodeEnums } from "../interfaces/enums";
import NewsDbModel from "../models/News.model";
import authorize from "../utils/authorize";

export const NewsAPIController: Router = Router();

// GET news from NewsAPI based on query
NewsAPIController.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.query;

      if (!query || typeof query !== "string") {
        res.status(400).send({ error: "Query parameter is required" });
        return;
      }

      const articles = await NewsAPIService.fetchNews(query);
      res.status(200).send({ articles });
    } catch (err) {
      next(err);
    }
  }
);

// GET top headlines from NewsAPI
NewsAPIController.get(
  "/top-headlines",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, country } = req.query;

      const articles = await NewsAPIService.fetchTopHeadlines(
        category as string | undefined,
        (country as string) || "us"
      );

      res.status(200).send({ articles });
    } catch (err) {
      next(err);
    }
  }
);

// POST import news from NewsAPI to the database
NewsAPIController.post(
  "/import",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, category } = req.body;

      if (!query && !category) {
        res.status(400).send({ error: "Either query or category is required" });
        return;
      }

      let articles: NewsAPIArticle[] = [];

      if (query) {
        articles = await NewsAPIService.fetchNews(query);
      } else if (category) {
        articles = await NewsAPIService.fetchTopHeadlines(category);
      }

      if (articles.length === 0) {
        res.status(404).send({ error: "No articles found" });
        return;
      }

      const importedArticles: any[] = [];

      // Import articles to the database
      for (const article of articles) {
        try {
          // Check if article already exists by title
          const existingArticle = await NewsDbModel.query()
            .where("title", article.title)
            .first();

          if (existingArticle) {
            continue; // Skip this article
          }

          // Generate a summary
          const summary = NewsAPIService.generateSummary(article);

          // Create a new article in the database
          const newArticle = await NewsDbModel.query().insert({
            title: article.title,
            content: article.content || "",
            subtitle: article.author || "",
            summary,
            image: article.urlToImage || "",
            // You would need to map this to a real category ID from your database
            category_id: req.body.category_id || "1",
            is_featured: false,
            is_deleted: false,
            number_of_clicks: 0,
            // Add additional properties as needed
          });

          importedArticles.push(newArticle);
        } catch (error) {
          console.error(`Error importing article: ${article.title}`, error);
          // Continue with next article
        }
      }

      res.status(200).send({
        message: `Imported ${importedArticles.length} articles`,
        articles: importedArticles,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST generate summaries for all existing articles without summaries using NewsAPI descriptions
NewsAPIController.post(
  "/generate-summaries",
  authorize(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get all articles without summaries
      const articlesWithoutSummaries = await NewsDbModel.query()
        .whereNull("summary")
        .where({ is_deleted: false });

      if (articlesWithoutSummaries.length === 0) {
        const result = ok({ message: "No articles found without summaries" });
        res.status(result.httpCode).send(result.data);
        return;
      }

      let updatedCount = 0;

      // Process each article
      for (const article of articlesWithoutSummaries) {
        try {
          if (article.title) {
            // Fetch articles related to this title to get relevant descriptions
            const relatedArticles = await NewsAPIService.fetchNews(
              article.title
            );

            let summary = null;

            if (relatedArticles.length > 0) {
              // Use the most relevant article's description as a summary
              summary = NewsAPIService.generateSummary(relatedArticles[0]);
            }

            if (summary) {
              // Update the article with the generated summary
              await NewsDbModel.query().findById(article.id).patch({ summary });
              updatedCount++;
            }
          }
        } catch (error) {
          console.error(`Error processing article ${article.id}:`, error);
          // Continue with the next article
        }
      }

      const result = ok({
        message: `Generated summaries for ${updatedCount} articles using NewsAPI`,
      });

      res.status(result.httpCode).send(result.data);
    } catch (error) {
      console.error("Error in batch summary generation:", error);
      const result = failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
      res.status(result.httpCode).send(result.data);
    }
  }
);
