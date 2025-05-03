import { StatusCodeEnums } from "../../interfaces/enums";
import { ok, failure } from "../../utils";
import CategoryDbModel from "../../models/Category.model";
import NewsDbModel from "../../models/News.model";
import SavedNewsDbModel from "../../models/SavedNews.model";
import WatchedDbModel from "../../models/Watched.model";
import ReactionDbModel from "../../models/Reaction.model";
import UserDbModel from "../../models/Users.model";

interface CountResult {
  count: string;
}

export const RapportService = {
  getDashboardViewModel: async () => {
    try {
      // Count Categories
      const catCountRes = (await CategoryDbModel.query().count(
        "* as count"
      )) as unknown as CountResult[];
      const categoriesCount = parseInt(catCountRes[0].count, 10);

      // Count News items
      const newsCountRes = (await NewsDbModel.query().count(
        "* as count"
      )) as unknown as CountResult[];
      const newsCount = parseInt(newsCountRes[0].count, 10);

      // Count Users (assumes a User model with all users)
      const usersCountRes = (await UserDbModel.query().count(
        "* as count"
      )) as unknown as CountResult[];
      const usersCount = parseInt(usersCountRes[0].count, 10);

      // Count Saved news records
      const savedCountRes = (await SavedNewsDbModel.query().count(
        "* as count"
      )) as unknown as CountResult[];
      const savedCount = parseInt(savedCountRes[0].count, 10);

      // Count Watched records (views)
      const viewsCountRes = (await WatchedDbModel.query().count(
        "* as count"
      )) as unknown as CountResult[];
      const viewsCount = parseInt(viewsCountRes[0].count, 10);

      // Count reactions by type
      const angryRes = (await ReactionDbModel.query()
        .where("reaction", 3)
        .count("* as count")) as unknown as CountResult[];
      const angryCount = parseInt(angryRes[0].count, 10);

      const sadRes = (await ReactionDbModel.query()
        .where("reaction", 2)
        .count("* as count")) as unknown as CountResult[];
      const sadCount = parseInt(sadRes[0].count, 10);

      const happyRes = (await ReactionDbModel.query()
        .where("reaction", 1)
        .count("* as count")) as unknown as CountResult[];
      const happyCount = parseInt(happyRes[0].count, 10);

      // Count Admins (assumes a 'role' field in your User model)
      const adminsRes = (await UserDbModel.query()
        // .where("role", "Admin")
        .count("* as count")) as unknown as CountResult[];
      const adminsCount = parseInt(adminsRes[0].count, 10);

      const dashboardViewModel = {
        Categories: categoriesCount,
        News: newsCount,
        Users: usersCount,
        Saved: savedCount,
        Views: viewsCount,
        Angry: angryCount,
        Sad: sadCount,
        Happy: happyCount,
        Admins: adminsCount,
      };

      return ok({ dashboard: dashboardViewModel });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  getFirstRaportViewModel: async (model: any) => {
    try {
      const { mainElement, whatToShow, from, to } = model;
      let result: any[] = [];

      // Convert date parameters to Date objects if provided.
      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;

      if (mainElement === "users") {
        if (whatToShow === "views") {
          const watchedRecords = await WatchedDbModel.query()
            .whereNotNull("user_id")
            .modify((qb) => {
              if (fromDate) qb.where("watched_on", ">=", fromDate);
              if (toDate) qb.where("watched_on", "<=", toDate);
            })
            .withGraphFetched("user");
          const grouped = watchedRecords.reduce((acc, record) => {
            const key = record.user_id;
            if (!acc[key]) {
              acc[key] = {
                Id: record.user_id,
                name: record.user?.name || "",
                number: 0,
              };
            }
            acc[key].number++;
            return acc;
          }, {} as Record<string, any>);
          result = Object.values(grouped);
        } else if (whatToShow === "saved") {
          const savedRecords = await SavedNewsDbModel.query().withGraphFetched(
            "user"
          );
          const grouped = savedRecords.reduce((acc, record) => {
            const key = record.user_id;
            if (!acc[key]) {
              acc[key] = {
                Id: record.user_id,
                name: record.user?.name || "",
                number: 0,
              };
            }
            acc[key].number++;
            return acc;
          }, {} as Record<string, any>);
          result = Object.values(grouped);
        } else if (whatToShow === "reactions") {
          const reactions = await ReactionDbModel.query().withGraphFetched(
            "user"
          );
          const grouped = reactions.reduce((acc, record) => {
            const key = record.user_id;
            if (!acc[key]) {
              acc[key] = {
                Id: record.user_id,
                name: record.user?.name || "",
                number: 0,
              };
            }
            acc[key].number++;
            return acc;
          }, {} as Record<string, any>);
          result = Object.values(grouped);
        }
      } else if (mainElement === "news") {
        if (whatToShow === "views") {
          const watchedRecords = await WatchedDbModel.query()
            .modify((qb) => {
              if (fromDate) qb.where("watched_on", ">=", fromDate);
              if (toDate) qb.where("watched_on", "<=", toDate);
            })
            .withGraphFetched("news");
          const grouped = watchedRecords.reduce((acc, record) => {
            const key = record.news_id;
            if (!acc[key]) {
              acc[key] = {
                Id: record.news_id.toString(),
                name: record.news?.title || "",
                number: 0,
              };
            }
            acc[key].number++;
            return acc;
          }, {} as Record<string, any>);
          result = Object.values(grouped);
        } else if (whatToShow === "saved") {
          const savedRecords = await SavedNewsDbModel.query().withGraphFetched(
            "news"
          );
          const grouped = savedRecords.reduce((acc, record) => {
            const key = record.news_id;
            if (!acc[key]) {
              acc[key] = {
                Id: record.news_id.toString(),
                name: record.news?.title || "",
                number: 0,
              };
            }
            acc[key].number++;
            return acc;
          }, {} as Record<string, any>);
          result = Object.values(grouped);
        } else if (whatToShow === "reactions") {
          const reactions = await ReactionDbModel.query().withGraphFetched(
            "news"
          );
          const grouped = reactions.reduce((acc, record) => {
            const key = record.news_id;
            if (!acc[key]) {
              acc[key] = {
                Id: record.news_id.toString(),
                name: record.news?.title || "",
                number: 0,
              };
            }
            acc[key].number++;
            return acc;
          }, {} as Record<string, any>);
          result = Object.values(grouped);
        }
      }
      model.result = result;
      return ok({ firstRaport: model });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
};
