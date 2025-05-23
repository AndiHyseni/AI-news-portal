import { Image, Title, Text, Grid } from "@mantine/core";
import { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { News } from "../../types/news/news";
import { UserContext } from "../../contexts/UserContext";
import "../NewsByTags/NewsByTags.css";

export interface NewsByTagsProps {
  news: News[];
}

export const NewsByTagsC: React.FC<NewsByTagsProps> = ({ news }) => {
  const { tags } = useParams();
  const navigate = useNavigate();
  const [userContext] = useContext(UserContext);

  const addView = (newsId: string) => {
    const model: AddViewModel = {
      user_id: userContext.userId || "",
      news_id: newsId,
      finger_print_id: "",
      watch_id: 2,
    };
    addViews(model);
  };

  // Ensure news is an array
  const newsArray = Array.isArray(news) ? news : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="newsByTags-container">
      <Title className="newsByTags-header">News tagged with "{tags}"</Title>

      {newsArray.length > 0 ? (
        <Grid gutter={25}>
          {newsArray.map((newsItem, index) => (
            <Grid.Col xs={12} sm={6} md={4} key={index}>
              <div className="newsByTagsBox">
                <div className="image-container">
                  <Image
                    className="newsByTagsImage"
                    src={newsItem.image}
                    alt={newsItem.title}
                    onClick={() => {
                      addView(newsItem.id);
                      navigate(`/news/${newsItem.id}`);
                    }}
                    fit="cover"
                  />
                  {/* <div className="category-label">{tags}</div> */}
                </div>
                <div
                  className="newsByTagsTitle"
                  onClick={() => {
                    addView(newsItem.id);
                    navigate(`/news/${newsItem.id}`);
                  }}
                >
                  {newsItem.title}
                </div>
                <div className="news-date">
                  {formatDate(newsItem.created_at)}
                </div>
              </div>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <div className="newsByTags-empty">
          <Text size="lg">No news found for tag "{tags}"</Text>
        </div>
      )}
    </div>
  );
};
