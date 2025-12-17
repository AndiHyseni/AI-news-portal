import OpenAI from "openai";
import { StatusCodeEnums } from "../../interfaces/enums";
import { failure, ok } from "../../utils";
import NewsDbModel from "../../models/News.model";
import { NewsAPIService } from "../newsapi/NewsAPI.service";

interface VerificationResult {
  isVerified: boolean;
  confidence: number;
  reason: string;
  sources?: string[];
}

export const NewsVerificationService = {
  /**
   * Verifies the factual accuracy and authenticity of a news article
   */
  verifyArticle: async (newsId: string) => {
    try {
      const article = await NewsDbModel.query()
        .findById(newsId)
        .where({ is_deleted: false });

      if (!article) {
        return failure(
          { error: "Article not found" },
          StatusCodeEnums.NOT_FOUND
        );
      }

      // Initialize OpenAI
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Fetch latest related coverage (evidence) using NewsAPI
      const relatedArticles = await NewsAPIService.fetchNews(article.title);
      const topEvidence = relatedArticles.slice(0, 5).map((a) => ({
        title: a.title,
        source: a.source?.name,
        publishedAt: a.publishedAt,
        url: a.url,
        description: a.description,
      }));

      // Ask the model for a simple verdict + confidence + short reason
      const verificationResponse = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content:
              "You are a strict news verification assistant. Use the provided evidence (recent related coverage) to judge whether the article is likely accurate.",
          },
          {
            role: "user",
            content: `Return ONLY valid JSON with keys: isVerified (boolean), confidence (number 0..1), reason (short string), sources (array of urls).\n\nArticle title: ${
              article.title
            }\n\nArticle content:\n${
              article.content
            }\n\nRecent related coverage (evidence):\n${JSON.stringify(
              topEvidence,
              null,
              2
            )}`,
          },
        ],
        temperature: 0.2,
      });

      let parsed: any = {};
      try {
        parsed = JSON.parse(
          verificationResponse.choices[0]?.message?.content || "{}"
        );
      } catch (e) {
        console.error("Error parsing verification response:", e);
      }

      const verificationResult: VerificationResult = {
        isVerified: Boolean(parsed.isVerified),
        confidence:
          typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
        reason:
          typeof parsed.reason === "string" && parsed.reason.trim().length > 0
            ? parsed.reason.trim()
            : "No detailed reason provided.",
        sources: Array.isArray(parsed.sources)
          ? parsed.sources.filter((x: any) => typeof x === "string")
          : (topEvidence.map((e) => e.url).filter(Boolean) as string[]),
      };

      const verifiedAt = new Date();
      // Update article with verification status
      await NewsDbModel.query()
        .findById(newsId)
        .patch({
          is_verified: verificationResult.isVerified,
          verification_data: JSON.stringify(verificationResult),
          verified_at: verifiedAt,
        });

      return ok({
        message: "Article verification completed",
        data: { ...verificationResult, verifiedAt },
      });
    } catch (error) {
      console.error("Error in article verification:", error);
      return failure(
        { error: "Failed to verify article" },
        StatusCodeEnums.UNPROCESSABLE_ENTITY
      );
    }
  },
};
