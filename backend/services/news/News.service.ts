import { StatusCodeEnums } from "../../interfaces/enums";
import { failure, ok } from "../../utils";
import NewsDbModel from "../../models/News.model";
import SavedNewsDbModel from "../../models/SavedNews.model";
import ReactionDbModel from "../../models/Reaction.model";
import WatchedDbModel from "../../models/Watched.model";

export const NewsService = {
  getAllNews: async () => {
    try {
      const news = await NewsDbModel.query()
        .where({ is_deleted: false })
        .orderBy("created_at", "DESC")
        .withGraphFetched("category");
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
      const savedNews = await SavedNewsDbModel.query().where("user_id", UserId);
      return ok({ news: savedNews });
    } catch (error) {
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
      const reactions = await ReactionDbModel.query().where("news_id", newsId);
      return ok({ reactions });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getAllReactions: async () => {
    try {
      const reactions = await ReactionDbModel.query();
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
};
