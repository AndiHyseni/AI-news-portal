import { StatusCodeEnums } from "../../interfaces/enums";
import { failure, ok } from "../../utils";
import NewsDbModel from "../../models/News.model";
import SavedNewsDbModel from "../../models/SavedNews.model";
import ReactionDbModel from "../../models/Reaction.model";
import WatchedDbModel from "../../models/Watched.model";
import { OpenAIService } from "../openai/OpenAI.service";
import { NLPService } from "../nlp/NLP.service";

export const NewsService = {
  getAllNews: async () => {
    try {
      // First, get count of watches for each news item
      const watchCounts = await WatchedDbModel.query()
        .select("news_id")
        .count("* as view_count")
        .groupBy("news_id");

      // Convert to a map for easier lookup
      const watchCountMap: Record<string, number> = {};
      watchCounts.forEach((item: any) => {
        watchCountMap[item.news_id] = Number(item.view_count);
      });

      // Get all news with their categories
      const news = await NewsDbModel.query()
        .where({ is_deleted: false })
        .orderBy("created_at", "DESC")
        .withGraphFetched("category");

      // Add the view counts to each news item
      news.forEach((item) => {
        item.number_of_clicks = watchCountMap[item.id] || 0;
      });

      return ok({ news });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getNewsById: async (id: string) => {
    try {
      const news = await NewsDbModel.query()
        .findById(id)
        .where({ is_deleted: false });
      if (!news) {
        return failure({ error: "News not found" }, StatusCodeEnums.UNEXPECTED);
      }
      return ok(news);
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  addOrEditNews: async (news: any) => {
    try {
      let result;
      if (news.id) {
        result = await NewsDbModel.query().patchAndFetchById(news.id, news);
      } else {
        result = await NewsDbModel.query().insert(news);
      }
      return ok({ news: result });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  deleteNews: async (id: string) => {
    try {
      const news = await NewsDbModel.query().findById(id);
      if (!news) {
        return failure({ error: "News not found" }, StatusCodeEnums.UNEXPECTED);
      }
      await NewsDbModel.query().patchAndFetchById(id, { is_deleted: true });
      return ok({ message: "News deleted successfully" });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  addView: async (newsId: string, userId: string, fingerPrintId: string) => {
    try {
      await WatchedDbModel.query().insert({
        news_id: newsId,
        user_id: userId,
        fingerprint_id: fingerPrintId,
      });
      return ok({ message: "View added successfully" });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  addSaved: async (NewsId: string, UserId: string) => {
    try {
      // Check if the article is already saved by this user
      const existingSavedNews = await SavedNewsDbModel.query()
        .where({
          news_id: NewsId,
          user_id: UserId,
        })
        .first();

      // If it already exists, return an error
      if (existingSavedNews) {
        return failure(
          { error: "Article already saved by this user" },
          StatusCodeEnums.UNEXPECTED
        );
      }

      // If it doesn't exist, save it
      await SavedNewsDbModel.query().insert({
        news_id: NewsId,
        user_id: UserId,
      });
      return ok({ message: "News saved successfully" });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getWatchedNews: async (id: string) => {
    try {
      const watched = await WatchedDbModel.query().where("news_id", id);
      return ok({ watched });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getViews: async () => {
    try {
      const watchedRecords = await WatchedDbModel.query().withGraphFetched(
        "news"
      );
      const grouped = watchedRecords.reduce((acc, record) => {
        const key = record.news_id;
        if (!acc[key]) {
          acc[key] = {
            id: key,
            NewsTitle: record.news?.title || "",
            nrOfClicks: 0,
          };
        }
        acc[key].nrOfClicks += 1;
        return acc;
      }, {} as Record<string, { id: string; NewsTitle: string; nrOfClicks: number }>);
      const views = Object.values(grouped);
      return ok({ views });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getSavedNews: async (UserId: string) => {
    try {
      const savedNews = await SavedNewsDbModel.query()
        .where("user_id", UserId)
        .withGraphFetched("news");

      const formattedSavedNews = savedNews
        .map((item) => {
          if (!item.news) {
            return null;
          }

          return {
            saved_id: item.id,
            news_id: item.news_id,
            user_id: item.user_id,
            title: item.news.title,
            subtitle: item.news.subtitle,
            content: item.news.content,
            summary: item.news.summary,
            image: item.news.image,
            video: item.news.video,
            category_id: item.news.category_id,
            tags: item.news.tags,
            number_of_clicks: item.news.number_of_clicks,
            created_at: item.news.created_at,
            id: item.news.id,
          };
        })
        .filter(Boolean);

      return ok({ news: formattedSavedNews });
    } catch (error) {
      console.error("Error fetching saved news:", error);
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  deleteSaved: async (NewsId: string, UserId: string) => {
    try {
      await SavedNewsDbModel.query()
        .delete()
        .where({ news_id: NewsId, user_id: UserId });
      return ok({ message: "Saved news deleted successfully" });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  addReaction: async (reaction: any) => {
    try {
      const result = await ReactionDbModel.query().insert(reaction);
      return ok({ reaction: result });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getReactionsByNews: async (newsId: string) => {
    try {
      const reactions = await ReactionDbModel.query()
        .where("news_id", newsId)
        .withGraphFetched("[user(selectUser), news(selectNews)]")
        .modifiers({
          selectUser: (builder) => {
            builder.select("id", "name", "email");
          },
          selectNews: (builder) => {
            builder.select("id", "title");
          },
        });
      return ok({ reactions });
    } catch (error) {
      console.error("Error fetching reactions:", error);
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getAllReactions: async () => {
    try {
      const reactions = await ReactionDbModel.query()
        .withGraphFetched("news(selectNews)")
        .modifiers({
          selectNews: (builder) => {
            builder.select("id", "title");
          },
        });
      return ok({ reactions });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getByTag: async (tag: string) => {
    try {
      const news = await NewsDbModel.query()
        .where("tags", "like", `%${tag}%`)
        .where({ is_deleted: false });
      return ok({ news: news || [] });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getMostViewed: async () => {
    try {
      const news = await NewsDbModel.query().orderBy("views", "DESC");
      return ok({ news });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  // Add a method to generate summaries for existing articles that don't have them
  generateSummariesForExistingArticles: async () => {
    try {
      // Get all articles without summaries
      const articlesWithoutSummaries = await NewsDbModel.query()
        .whereNull("summary")
        .where({ is_deleted: false });

      let updatedCount = 0;

      // Process each article with NLP
      for (const article of articlesWithoutSummaries) {
        try {
          if (article.title && article.content) {
            // Try to generate a summary using NLP
            const summary = await NLPService.generateSummary(
              article.title,
              article.content
            );

            if (summary) {
              // Update the article with the generated summary
              await NewsDbModel.query().findById(article.id).patch({ summary });
              updatedCount++;
            }
            // Fallback to OpenAI API key is available
            else if (process.env.OPENAI_API_KEY) {
              const openAISummary = await OpenAIService.generateSummary(
                article.title,
                article.content
              );
              if (openAISummary) {
                await NewsDbModel.query()
                  .findById(article.id)
                  .patch({ summary: openAISummary });
                updatedCount++;
              }
            }
          }
        } catch (error) {
          console.error(`Error processing article ${article.id}:`, error);
          // Continue with the next article
        }
      }

      return ok({
        message: `Generated summaries for ${updatedCount} articles`,
      });
    } catch (error) {
      console.error("Error in batch summary generation:", error);
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  // Add a method to generate tags for existing articles that don't have them
  generateTagsForExistingArticles: async () => {
    try {
      // Get all articles without tags
      const articlesWithoutTags = await NewsDbModel.query()
        .where({ is_deleted: false })
        .whereRaw("tags IS NULL OR tags = ''");

      let updatedCount = 0;

      // Process each article
      for (const article of articlesWithoutTags) {
        try {
          if (article.title && article.content) {
            // Generate tags using NLP
            const tags = NLPService.extractTags(article.title, article.content);

            if (tags) {
              // Update the article with the generated tags
              await NewsDbModel.query().findById(article.id).patch({ tags });
              updatedCount++;
            }
          }
        } catch (error) {
          console.error(
            `Error generating tags for article ${article.id}:`,
            error
          );
          // Continue with the next article
        }
      }

      return ok({
        message: `Generated tags for ${updatedCount} articles`,
      });
    } catch (error) {
      console.error("Error in batch tag generation:", error);
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  // Generate summary for a specific article
  generateSummaryForArticle: async (id: string) => {
    try {
      // Get the article
      const newsResult = await NewsDbModel.query()
        .findById(id)
        .where({ is_deleted: false });

      if (!newsResult) {
        return failure({ error: "News not found" }, StatusCodeEnums.UNEXPECTED);
      }

      // Only proceed if the article has content
      if (newsResult.title && newsResult.content) {
        try {
          // Generate a summary using NLP
          const summary = await NLPService.generateSummary(
            newsResult.title,
            newsResult.content
          );

          if (summary) {
            // Update the article with the generated summary
            await NewsDbModel.query().findById(id).patch({ summary });
            return ok({ message: "Summary generated successfully with NLP" });
          }
          // Fallback to OpenAI if NLP fails and OpenAI API key is available
          else if (process.env.OPENAI_API_KEY) {
            const openAISummary = await OpenAIService.generateSummary(
              newsResult.title,
              newsResult.content
            );

            if (openAISummary) {
              await NewsDbModel.query()
                .findById(id)
                .patch({ summary: openAISummary });
              return ok({
                message: "Summary generated successfully using OpenAI",
              });
            }
          }
        } catch (error) {
          console.error("Error generating summary:", error);
        }
      }

      return failure(
        { error: "Could not generate summary" },
        StatusCodeEnums.UNEXPECTED
      );
    } catch (error) {
      console.error("Error in summary generation:", error);
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  // Generate tags for a specific article
  generateTagsForArticle: async (id: string) => {
    try {
      // Get the article
      const newsResult = await NewsDbModel.query()
        .findById(id)
        .where({ is_deleted: false });

      if (!newsResult) {
        return failure({ error: "News not found" }, StatusCodeEnums.UNEXPECTED);
      }

      // Only proceed if the article has content
      if (newsResult.title && newsResult.content) {
        try {
          // Generate tags using NLP
          const tags = NLPService.extractTags(
            newsResult.title,
            newsResult.content
          );

          if (tags) {
            // Update the article with the generated tags
            await NewsDbModel.query().findById(id).patch({ tags });
            return ok({ message: "Tags generated successfully with NLP" });
          }
        } catch (error) {
          console.error("Error generating tags:", error);
        }
      }

      return failure(
        { error: "Could not generate tags" },
        StatusCodeEnums.UNEXPECTED
      );
    } catch (error) {
      console.error("Error in tag generation:", error);
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
};
