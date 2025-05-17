import {
  Button,
  Card,
  Divider,
  Group,
  Image,
  Text,
  Title,
} from "@mantine/core";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Edit, Trash } from "tabler-icons-react";
import { useSavedNews } from "../../hooks/useNews/useSavedNews";
import { useUsers } from "../../hooks/useUsers/useUsers";
import { News } from "../../types/news/news";
import { AddSavedNewsButton } from "../common/AddSavedNewsButton";
import "./AdminNewsDetails.css";

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
  const savedNewsMutation = useSavedNews();
  const navigate = useNavigate();

  return (
    <Card className="admin-news-details" radius="md" p="xl" shadow="md">
      <div className="news-image-container">
        <Image
          src={news?.image}
          alt={news?.title}
          radius="md"
          height={500}
          className="news-image"
        />
      </div>

      <div className="news-content">
        <Title order={1} className="news-title">
          {news?.title}
        </Title>

        <Text size="xl" className="news-subtitle">
          {news?.subtitle}
        </Text>

        <Divider my="lg" />

        <Text className="news-body">{news?.content}</Text>

        {videoDetails && (
          <div
            className="news-video"
            dangerouslySetInnerHTML={{ __html: videoDetails }}
          />
        )}

        {news.tags && news.tags !== "" && (
          <div className="news-tags">
            <Text weight={600} color="dimmed" mb="sm">
              Tags:
            </Text>
            <Group spacing="xs">
              {news?.tags
                .split(",")
                .filter((tag) => tag !== "")
                .map((tag, index) => (
                  <NavLink key={index} to={`/tag/${tag}`}>
                    <Button
                      variant="filled"
                      radius="xl"
                      size="sm"
                      className="tag-button"
                    >
                      {tag}
                    </Button>
                  </NavLink>
                ))}
            </Group>
          </div>
        )}

        <div className="action-buttons">
          {news && data && (
            <AddSavedNewsButton
              newsId={String(newsId)}
              mutation={savedNewsMutation}
            />
          )}

          <Group spacing="md">
            <Button
              variant="filled"
              className="edit-button"
              onClick={() => navigate(`/admin/news/edit/${news.id}`)}
              leftIcon={<Edit size={18} />}
            >
              Edit
            </Button>

            <Button
              variant="filled"
              className="delete-button"
              color="red"
              onClick={() => onDeleteNews(news)}
              leftIcon={<Trash size={18} />}
            >
              Delete
            </Button>
          </Group>
        </div>
      </div>
    </Card>
  );
};
