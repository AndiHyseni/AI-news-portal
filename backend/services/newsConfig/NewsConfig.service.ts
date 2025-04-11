import { StatusCodeEnums } from "../../interfaces/enums";
import { ok, failure } from "../../utils";
import NewsConfigDbModel from "../../models/NewsConfig.model";

export const NewsConfigService = {
  getConfigRow: async () => {
    try {
      const config = await NewsConfigDbModel.query().first();
      if (!config) {
        return failure(
          { error: "No configuration found" },
          StatusCodeEnums.UNEXPECTED
        );
      }
      return ok({ newsConfig: config });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  editConfigRow: async (newsConfig: any) => {
    try {
      if (newsConfig.NewsConfigId === 0) {
        newsConfig.NewsConfigId = 1;
      }
      const updated = await NewsConfigDbModel.query().patchAndFetchById(
        newsConfig.NewsConfigId,
        newsConfig
      );
      return ok({ newsConfig: updated });
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
};
