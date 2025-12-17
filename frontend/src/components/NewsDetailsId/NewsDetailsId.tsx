import { Button, Image, Paper, Loader, Group } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSavedNews } from "../../hooks/useNews/useSavedNews";
import { useAddReaction } from "../../hooks/useReactions/useAddReactions";
import { useReactions } from "../../hooks/useReactions/useReactions";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import { News } from "../../types/news/news";
import { Reaction } from "../../types/administration/administration";
import { AddSavedNewsButton } from "../common/AddSavedNewsButton";
import { UserContext } from "../../contexts/UserContext";
import { toast } from "react-toastify";
import { RelatedNews } from "../RelatedNews/RelatedNews";
import "../NewsDetailsId/NewsDetailsId.css";
import { VerificationStatus } from "../common/VerificationStatus";
import { useVerifyNews } from "../../hooks/useNews/useVerifyNews";
import { IconShieldCheck } from "@tabler/icons-react";

// Define interface for the API response
interface ReactionsResponse {
  reactions: Reaction[];
}

export interface NewsDetailsProps {
  news: News;
}

export const NewsDetailsId: React.FC<NewsDetailsProps> = ({ news }) => {
  const videoDetails: string = news?.video!;
  const addReactionMutation = useAddReaction();
  const { newsId } = useParams();
  const savedNewsMutation = useSavedNews();
  const {
    data: reactionsData,
    isLoading: reactionsLoading,
    refetch: refetchReactions,
  } = useReactions();
  const { data } = useConfiguration();
  const navigate = useNavigate();
  const [userContext] = useContext(UserContext);
  const [reactionCounts, setReactionCounts] = useState({
    happy: 0,
    sad: 0,
    angry: 0,
  });
  const verifyNewsMutation = useVerifyNews();

  const safeParseVerificationData = (value: unknown) => {
    if (!value) return null;
    if (typeof value === "object") return value as any;
    if (typeof value !== "string") return null;

    try {
      return JSON.parse(value);
    } catch (e) {
      // Some legacy rows may contain "[object Object]" or other non-JSON strings.
      console.warn("Invalid verification_data JSON:", value, e);
      return null;
    }
  };

  // Parse verification data if it exists
  const verificationData = safeParseVerificationData(news.verification_data);

  // Get user ID from context instead of directly decoding the JWT
  const userId = userContext.userId || "";
  const isAuthenticated = userContext.isAuthenticated;

  // Process reactions data when it's available
  useEffect(() => {
    if (reactionsData) {
      // Access reactions array safely
      const reactionsArray = Array.isArray(reactionsData)
        ? reactionsData
        : (reactionsData as ReactionsResponse)?.reactions || [];

      // Initialize counters
      let happyCount = 0;
      let sadCount = 0;
      let angryCount = 0;

      // Count reactions by type for current news
      reactionsArray.forEach((reactionItem: any) => {
        if (reactionItem.news_id === news.id) {
          if (reactionItem.reaction === 1) {
            happyCount++;
          } else if (reactionItem.reaction === 2) {
            sadCount++;
          } else if (reactionItem.reaction === 3) {
            angryCount++;
          }
        }
      });

      // Update state with counted reactions
      setReactionCounts({
        happy: happyCount,
        sad: sadCount,
        angry: angryCount,
      });
    }
  }, [reactionsData, news.id]);

  const handleSubmit = (reaction: number) => {
    // Show loading toast
    const toastId = toast.loading("Adding your reaction...");

    addReactionMutation.mutate(
      {
        news_id: news.id,
        user_id: userId,
        reaction: reaction,
      },
      {
        onSuccess: () => {
          // Update loading toast to success
          toast.update(toastId, {
            render: getReactionMessage(reaction),
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          // Refetch reactions to update counts
          refetchReactions();
        },
        onError: (error) => {
          // Update loading toast to error
          toast.update(toastId, {
            render: "Failed to add reaction. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          console.error("Error adding reaction:", error);
        },
      }
    );
  };

  // Helper function to get reaction message
  const getReactionMessage = (reactionType: number): string => {
    switch (reactionType) {
      case 1:
        return "Thanks for your happy reaction! 😊";
      case 2:
        return "Thanks for your sad reaction! 😔";
      case 3:
        return "Thanks for your angry reaction! 😠";
      default:
        return "Thanks for your reaction!";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="details">
      <div className="news-image-container">
        <Image src={news?.image} className="news-image" alt={news?.title} />
      </div>

      <h1 className="titleDetails">{news?.title}</h1>
      <h2 className="subtitleDetails">{news?.subtitle}</h2>

      <div className="news-meta">
        <span>Published: {formatDate(news?.created_at)}</span>
        <Group spacing={12} ml="auto" align="center">
          <VerificationStatus
            isVerified={news.is_verified || false}
            confidence={verificationData?.confidence}
            reason={verificationData?.reason}
            verifiedAt={news.verified_at}
          />
          {!news.verified_at && (
            <Button
              size="xs"
              variant="outline"
              color="teal"
              leftIcon={<IconShieldCheck size={16} />}
              loading={verifyNewsMutation.isLoading}
              onClick={() => verifyNewsMutation.mutate(news.id)}
              disabled={verifyNewsMutation.isLoading}
            >
              {verifyNewsMutation.isLoading ? "Verifying..." : "Verify"}
            </Button>
          )}
          <AddSavedNewsButton
            newsId={String(newsId)}
            mutation={savedNewsMutation}
          />
        </Group>
      </div>

      {news?.summary && (
        <div className="summaryDetails">
          <h3>Summary</h3>
          <p>{news.summary}</p>
        </div>
      )}

      <div
        className="contentDetails"
        dangerouslySetInnerHTML={{ __html: news?.content }}
      />

      {videoDetails && (
        <div
          className="videoDetails"
          dangerouslySetInnerHTML={{ __html: videoDetails }}
        ></div>
      )}

      {news.tags && news.tags !== "" && (
        <div className="tagsDetails">
          {news?.tags
            .split(",")
            .filter((x) => x !== "")
            .map((tag, index) => (
              <NavLink key={index} to={`/tag/${tag}`}>
                <Button className="tagsButton" key={tag}>
                  {tag}
                </Button>
              </NavLink>
            ))}
        </div>
      )}

      <Paper shadow="sm" radius="lg" p="xl" className="reactions">
        <h2 className="reactionTitle">Cili është vlerësimi juaj për këtë?</h2>
        <div className="reactionEmoji">
          {reactionsLoading ? (
            <Loader color="#26145c" size="lg" />
          ) : (
            <>
              <div className="reaction-container">
                <span className="counter">{reactionCounts.happy}</span>
                {!isAuthenticated ? (
                  <div
                    className="reactionImage happy-emoji"
                    onClick={() => navigate("/login")}
                  >
                    <span role="img" aria-label="happy">
                      😊
                    </span>
                  </div>
                ) : (
                  <div
                    className="reactionImage happy-emoji"
                    onClick={() => handleSubmit(1)}
                  >
                    <span role="img" aria-label="happy">
                      😊
                    </span>
                  </div>
                )}
              </div>

              <div className="reaction-container">
                <span className="counter">{reactionCounts.sad}</span>
                {!isAuthenticated ? (
                  <div
                    className="reactionImage sad-emoji"
                    onClick={() => navigate("/login")}
                  >
                    <span role="img" aria-label="sad">
                      😔
                    </span>
                  </div>
                ) : (
                  <div
                    className="reactionImage sad-emoji"
                    onClick={() => handleSubmit(2)}
                  >
                    <span role="img" aria-label="sad">
                      😔
                    </span>
                  </div>
                )}
              </div>

              <div className="reaction-container">
                <span className="counter">{reactionCounts.angry}</span>
                {!isAuthenticated ? (
                  <div
                    className="reactionImage angry-emoji"
                    onClick={() => navigate("/login")}
                  >
                    <span role="img" aria-label="angry">
                      😠
                    </span>
                  </div>
                ) : (
                  <div
                    className="reactionImage angry-emoji"
                    onClick={() => handleSubmit(3)}
                  >
                    <span role="img" aria-label="angry">
                      😠
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Paper>

      {data?.show_related_news == true && news && news.id && (
        <RelatedNews newsId={news.id} />
      )}
    </div>
  );
};
