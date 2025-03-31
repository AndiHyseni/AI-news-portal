import { Button, Image, Text } from "@mantine/core";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSavedNews } from "../../hooks/useNews/useSavedNews";
import { useAddReaction } from "../../hooks/useReactions/useAddReactions";
import { useReactions } from "../../hooks/useReactions/useReactions";
import { News, SavedNewsPayload } from "../../types/news/news";
import { AddSavedNewsButton } from "../common/AddSavedNewsButton";
import "../NewsDetailsId/NewsDetailsId.css";

export interface NewsDetailsProps {
  news: News;
}

export const NewsDetailsId: React.FC<NewsDetailsProps> = ({ news }) => {
  const videoDetails: string = news?.video!;
  const addReactionMutation = useAddReaction();
  const { newsId } = useParams();
  const [savedNews, setSavedNews] = useState<SavedNewsPayload>();
  const savedNewsMutation = useSavedNews();
  const { data } = useReactions();
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
      newsId: news.newsId,
      userId: id,
      reaction: reaction,
    });
  };

  return (
    <div className="details">
      <Image src={news?.image} />
      <h1 className="titleDetails">{news?.title}</h1>
      <h2 className="subtitleDetails">{news?.subTitle}</h2>
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
        {news && data && (
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
            <Text className="counter">
              {data?.filter((n) => n.newsId == news.newsId).map((x) => x.happy)}
            </Text>
            <Image
              onClick={() => navigate("/login")}
              src="../../images/happy.png"
              className="reactionImage"
              height={150}
              width={150}
            />
            <Text className="counter">
              {data?.filter((n) => n.newsId == news.newsId).map((x) => x.sad)}
            </Text>
            <Image
              onClick={() => navigate("/login")}
              src="../../images/sad.png"
              className="reactionImage"
              height={150}
              width={150}
            />
            <Text className="counter">
              {data?.filter((n) => n.newsId == news.newsId).map((x) => x.angry)}
            </Text>
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
            <Text className="counter">
              {data?.filter((n) => n.newsId == news.newsId).map((x) => x.happy)}
            </Text>
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
            <Text className="counter">
              {data?.filter((n) => n.newsId == news.newsId).map((x) => x.sad)}
            </Text>
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
            <Text className="counter">
              {data?.filter((n) => n.newsId == news.newsId).map((x) => x.angry)}
            </Text>
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
