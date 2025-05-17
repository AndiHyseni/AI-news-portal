import { StatusCodeEnums } from "../../interfaces/enums";
import { ok, failure } from "../../utils";
import NewsConfigDbModel from "../../models/NewsConfig.model";

interface NewsConfigInput {
  header_logo: string;
  footer_logo: string;
  show_featured: boolean;
  show_most_watched: boolean;
}

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
      return ok(config);
    } catch (error) {
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  editConfigRow: async (newsConfig: NewsConfigInput) => {
    try {
      // Get the existing config or use ID 1 if not found
      const existingConfig = await NewsConfigDbModel.query().first();
      const configId = existingConfig?.id || "1"; // Use string for UUID

      // Update the configuration
      await NewsConfigDbModel.query().findById(configId).patch({
        header_logo: newsConfig.header_logo,
        footer_logo: newsConfig.footer_logo,
        show_featured: newsConfig.show_featured,
        show_most_watched: newsConfig.show_most_watched,
      });

      // Fetch the updated record
      const updated = await NewsConfigDbModel.query().findById(configId);
      if (!updated) {
        return failure(
          { error: "Failed to update configuration" },
          StatusCodeEnums.UNEXPECTED
        );
      }

      return ok(updated);
    } catch (error) {
      console.error("Config update error:", error);
      return failure({ error }, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
};
