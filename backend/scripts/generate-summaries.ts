import { NewsService } from "../services/news/News.service";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define the response type
interface ServiceResponse {
  httpCode: number;
  data: {
    message?: string;
    [key: string]: any;
  } | null;
}

/**
 * This script will generate summaries for all existing articles that don't have one.
 * It uses the OpenAI API to create concise 2-3 sentence summaries.
 *
 * To run this script:
 * 1. First run the migration: npm run migrate:latest
 * 2. Then run: npx ts-node scripts/generate-summaries.ts
 */
async function generateSummaries() {
  console.log("Starting to generate summaries for articles without them...");

  try {
    const result =
      (await NewsService.generateSummariesForExistingArticles()) as ServiceResponse;

    if (result.httpCode === 200 && result.data) {
      console.log(
        "Success:",
        result.data.message || "Summaries generated successfully"
      );
    } else {
      console.error(
        "Error generating summaries:",
        result.data || "Unknown error"
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }

  console.log("Summary generation process completed.");
}

// Run the function
generateSummaries().catch(console.error);
