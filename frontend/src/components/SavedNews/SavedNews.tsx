import { Fragment, useContext } from "react";
import { SavedNewsPage } from "../../types/news/news";
import "../../pages/SavedNews/SavedNews.css";
import { Button, Image, Grid, Title, Text } from "@mantine/core";
import { Trash, Clock } from "tabler-icons-react";
import { Link } from "react-router-dom";
import { AddViewModel } from "../../types/administration/administration";
import { addViews } from "../../api/administration/administration";
import { UserContext } from "../../contexts/UserContext";

export interface SavedNewsPageProps {
  savedNews: SavedNewsPage[];
  onDeleteSavedNews: (news: SavedNewsPage) => void;
}

export const SavedNewsC: React.FC<SavedNewsPageProps> = ({
  savedNews,
  onDeleteSavedNews,
}) => {
  const [userContext] = useContext(UserContext);
  const isAdmin = userContext.roles?.includes("admin");
  const userId = userContext.userId || "";

  const addView = (newsId: string) => {
    const model: AddViewModel = {
      user_id: userId,
      news_id: newsId,
      finger_print_id: "",
      watch_id: 2,
    };
    addViews(model);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <Title className="savedNews-header">Your Saved Articles</Title>
      <div className="savedNews-container">
        {savedNews?.map((news, index) => (
          <div key={index} className="savedNews">
            <div className="savedNewsBox">
              <div className="savedNewsImage">
                <Image
                  src={news.image}
                  alt={news.title}
                  height={200}
                  fit="cover"
                />
              </div>
              <h3 className="savedNewsTitle">{news.title}</h3>
              {news.created_at && (
                <div className="news-date">
                  <Text size="xs" color="dimmed" ml={5}>
                    {formatDate(news.created_at)}
                  </Text>
                </div>
              )}
            </div>
            <div className="savedNewsButtons">
              <Button
                component={Link}
                to={
                  !isAdmin
                    ? `/news/${news.news_id}`
                    : `/admin/news/details/${news.news_id}`
                }
                onClick={() => !isAdmin && addView(news.news_id)}
                variant="filled"
                radius="md"
                size="sm"
              >
                Read More
              </Button>
              <Button
                color="red"
                onClick={() => onDeleteSavedNews(news)}
                variant="outline"
                radius="md"
                size="sm"
              >
                <Trash size={16} strokeWidth={2} style={{ marginRight: 5 }} />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      {savedNews.length === 0 && (
        <div className="no-saved-news">
          <div className="empty-icon">📰</div>
          <h2>No saved articles found</h2>
          <p>Articles you save will appear here for later reading</p>
        </div>
      )}
    </div>
  );
};
