import { Button, Image, Text } from "@mantine/core";
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

  return (
    <div className="details">
      <Image src={news?.image} height={600} />
      <h1 className="titleDetails">{news?.title}</h1>
      <h2 className="subtitleDetails">{news?.sub_title}</h2>
      <p className="contentDetails">{news?.content}</p>
      {
        <div
          className="videoDetails"
          dangerouslySetInnerHTML={{ __html: videoDetails }}
        ></div>
      }
      {news.tags != "" && (
        <div className="tagsDetails">
          {news?.tags != null &&
            news?.tags
              .split(",")
              .filter((x) => x != "")
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
            newsId={Number(newsId)}
            savedNews={savedNews}
            mutation={savedNewsMutation}
          />
        )}
      </div>
      {id == null && (
        <div className="reactions">
          <h1 className="reactionTitle">Cili është vlerësimi juaj për këtë?</h1>
          <div className="reactionEmoji">
            <Text className="counter">{currentNewsReaction.happy}</Text>
            <Image
              onClick={() => navigate("/login")}
              src="../../images/happy.png"
              className="reactionImage"
              height={150}
              width={150}
            />
            <Text className="counter">{currentNewsReaction.sad}</Text>
            <Image
              onClick={() => navigate("/login")}
              src="../../images/sad.png"
              className="reactionImage"
              height={150}
              width={150}
            />
            <Text className="counter">{currentNewsReaction.angry}</Text>
            <Image
              onClick={() => navigate("/login")}
              src="../../images/angry.jpg"
              className="reactionImage"
              height={150}
              width={150}
            />
          </div>
        </div>
      )}
      {id != null && (
        <div className="reactions">
          <h1 className="reactionTitle">Cili është vlerësimi juaj për këtë?</h1>
          <div className="reactionEmoji">
            <Text className="counter">{currentNewsReaction.happy}</Text>
            <Image
              onClick={() => {
                handleSubmit(1);
                window.location.reload();
              }}
              src="../../images/happy.png"
              className="reactionImage"
              height={150}
              width={150}
            />
            <Text className="counter">{currentNewsReaction.sad}</Text>
            <Image
              onClick={() => {
                handleSubmit(2);
                window.location.reload();
              }}
              src="../../images/sad.png"
              className="reactionImage"
              height={150}
              width={150}
            />
            <Text className="counter">{currentNewsReaction.angry}</Text>
            <Image
              onClick={() => {
                handleSubmit(3);
                window.location.reload();
              }}
              src="../../images/angry.jpg"
              className="reactionImage"
              height={150}
              width={150}
            />
          </div>
        </div>
      )}
    </div>
  );
};
