import { Button, Image, Text, Paper } from "@mantine/core";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSavedNews } from "../../hooks/useNews/useSavedNews";
import { useAddReaction } from "../../hooks/useReactions/useAddReactions";
import { useReactions } from "../../hooks/useReactions/useReactions";
import { News, SavedNewsPayload } from "../../types/news/news";
import { Reaction } from "../../types/administration/administration";
import { AddSavedNewsButton } from "../common/AddSavedNewsButton";
import "../NewsDetailsId/NewsDetailsId.css";

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
  const [savedNews, setSavedNews] = useState<SavedNewsPayload>();
  const savedNewsMutation = useSavedNews();
  const { data: reactionsData } = useReactions();
  const navigate = useNavigate();

  var token: any =
    localStorage.getItem("jwt") != null
      ? jwtDecode(localStorage.getItem("jwt")!)
      : "";

  var id: string =
    token != null
      ? token[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]
      : "";

  const handleSubmit = (reaction: number) => {
    addReactionMutation.mutate({
      news_id: news.id,
      user_id: id,
      reaction: reaction,
    });
  };

  // Access reactions array safely
  const reactionsArray = Array.isArray(reactionsData)
    ? reactionsData
    : (reactionsData as ReactionsResponse | undefined)?.reactions || [];

  // Find the reaction for current news
  const currentNewsReaction = reactionsArray.find(
    (reaction: Reaction) => reaction.news_id === news.id
  ) || { happy: 0, sad: 0, angry: 0 };

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
      </div>

      <p className="contentDetails">{news?.content}</p>

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

      <div className="savedButton">
        {news && reactionsData && (
          <AddSavedNewsButton
            newsId={String(newsId)}
            savedNews={savedNews}
            mutation={savedNewsMutation}
          />
        )}
      </div>

      <Paper shadow="sm" radius="lg" p="xl" className="reactions">
        <h2 className="reactionTitle">Cili është vlerësimi juaj për këtë?</h2>
        <div className="reactionEmoji">
          <div className="reaction-container">
            <span className="counter">{currentNewsReaction.happy}</span>
            {!id ? (
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
                onClick={() => {
                  handleSubmit(1);
                  window.location.reload();
                }}
              >
                <span role="img" aria-label="happy">
                  😊
                </span>
              </div>
            )}
          </div>

          <div className="reaction-container">
            <span className="counter">{currentNewsReaction.sad}</span>
            {!id ? (
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
                onClick={() => {
                  handleSubmit(2);
                  window.location.reload();
                }}
              >
                <span role="img" aria-label="sad">
                  😔
                </span>
              </div>
            )}
          </div>

          <div className="reaction-container">
            <span className="counter">{currentNewsReaction.angry}</span>
            {!id ? (
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
                onClick={() => {
                  handleSubmit(3);
                  window.location.reload();
                }}
              >
                <span role="img" aria-label="angry">
                  😠
                </span>
              </div>
            )}
          </div>
        </div>
      </Paper>
    </div>
  );
};
