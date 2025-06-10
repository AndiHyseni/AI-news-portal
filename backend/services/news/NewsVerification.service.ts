import OpenAI from "openai";
import { StatusCodeEnums } from "../../interfaces/enums";
import { failure, ok } from "../../utils";
import NewsDbModel from "../../models/News.model";

interface VerificationResult {
  isVerified: boolean;
  confidence: number;
  factChecks: FactCheck[];
  suggestedCorrections?: string[];
  verificationSources?: string[];
}

interface FactCheck {
  claim: string;
  isFactual: boolean;
  confidence: number;
  explanation: string;
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

      // Extract main claims from the article
      const claimsResponse = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content:
              "You are a fact-checking expert. Extract the main factual claims from this news article that need verification. Focus on specific facts, statistics, quotes, and events.",
          },
          {
            role: "user",
            content: `Title: ${article.title}\n\nContent: ${article.content}`,
          },
        ],
        temperature: 0.3,
      });

      const claims =
        claimsResponse.choices[0]?.message?.content
          ?.split("\n")
          .filter(Boolean) || [];

      // Verify each claim
      const factChecks: FactCheck[] = [];
      for (const claim of claims) {
        const verificationResponse = await openai.chat.completions.create({
          model: "gpt-4.1-nano",
          messages: [
            {
              role: "system",
              content: `You are a fact-checking expert. Verify the following claim from a news article:
              1. Assess if the claim is factual
              2. Provide a confidence score (0-1)
              3. Explain your reasoning
              4. If possible, suggest reliable sources for verification
              
              Respond in JSON format with properties: isFactual, confidence, explanation, sources`,
            },
            {
              role: "user",
              content: claim,
            },
          ],
          temperature: 0.2,
        });

        try {
          const verification = JSON.parse(
            verificationResponse.choices[0]?.message?.content || "{}"
          );
          factChecks.push({
            claim,
            isFactual: verification.isFactual,
            confidence: verification.confidence,
            explanation: verification.explanation,
            sources: verification.sources,
          });
        } catch (error) {
          console.error("Error parsing verification response:", error);
        }
      }

      // Calculate overall verification metrics
      const verificationResult: VerificationResult = {
        isVerified: factChecks.every((check) => check.isFactual),
        confidence:
          factChecks.reduce((acc, check) => acc + check.confidence, 0) /
          factChecks.length,
        factChecks,
        suggestedCorrections: factChecks
          .filter((check) => !check.isFactual)
          .map(
            (check) =>
              `Correction needed for: ${check.claim}\nReason: ${check.explanation}`
          ),
        verificationSources: Array.from(
          new Set(factChecks.flatMap((check) => check.sources || []))
        ),
      };

      // Update article with verification status
      await NewsDbModel.query()
        .findById(newsId)
        .patch({
          is_verified: verificationResult.isVerified,
          verification_data: JSON.stringify(verificationResult),
          verified_at: new Date(),
        });

      return ok({
        message: "Article verification completed",
        data: verificationResult,
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
