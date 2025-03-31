import { Button, Image } from "@mantine/core";
import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Edit, Heart, Trash } from "tabler-icons-react";
import { useSavedNews } from "../../hooks/useNews/useSavedNews";
import { useUsers } from "../../hooks/useUsers/useUsers";
import { News, SavedNewsPayload } from "../../types/news/news";
import { AddSavedNewsButton } from "../common/AddSavedNewsButton";
import "../NewsDetailsId/NewsDetailsId.css";

export interface NewsDetailsProps {
  news: News;
  onDeleteNews: (news: News) => void;
}

export const AdminNewsDetailsC: React.FC<NewsDetailsProps> = ({
  news,
  onDeleteNews,
}) => {
  const videoDetails: string = news?.video!;
  const { newsId } = useParams();
  const { data } = useUsers();
  const [savedNews, setSavedNews] = useState<SavedNewsPayload>();
  const savedNewsMutation = useSavedNews();
  const navigate = useNavigate();

  return (
    <div className="detailsAdmin">
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
      <div className="detailsButton">
        {news && data && (
          <AddSavedNewsButton
            newsId={Number(newsId)}
            savedNews={savedNews}
            mutation={savedNewsMutation}
          />
        )}
        <Button
          className="detailsButtonList"
          onClick={() => navigate(`/news/edit/${news.newsId}`)}
        >
          <Edit size={20} strokeWidth={2} color={"white"} /> Edit
        </Button>
        <Button
          className="detailsButtonList deleteButton"
          onClick={() => onDeleteNews(news)}
        >
          <Trash size={20} strokeWidth={2} color={"white"} />
          Delete
        </Button>
      </div>
    </div>
  );
};
