import {
  Button,
  Card,
  Divider,
  Group,
  Image,
  Text,
  Title,
  Box,
  Tooltip,
} from "@mantine/core";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Edit, Trash, BrandAirtable, Tags } from "tabler-icons-react";
import { useSavedNews } from "../../hooks/useNews/useSavedNews";
import { useUsers } from "../../hooks/useUsers/useUsers";
import {
  useGenerateSummaryForArticle,
  useGenerateTagsForArticle,
} from "../../hooks/useNews/useNLP";
import { News } from "../../types/news/news";
import { AddSavedNewsButton } from "../common/AddSavedNewsButton";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../api/config";
import { BaseUrl } from "../../enums/baseUrl";
import { NEWS } from "../../enums/news/url";
import { toast } from "react-toastify";
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

  // Local state to store and immediately display updated summary and tags
  const [currentSummary, setCurrentSummary] = useState<string>(
    news?.summary || ""
  );
  const [currentTags, setCurrentTags] = useState<string>(news?.tags || "");

  // Update local state when news prop changes
  useEffect(() => {
    setCurrentSummary(news?.summary || "");
    setCurrentTags(news?.tags || "");
  }, [news?.summary, news?.tags]);

  const generateSummaryMutation = useGenerateSummaryForArticle({
    onSuccess: async () => {
      try {
        // Get the updated news with the new summary
        const response = await axiosInstance.get(
          `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWSID}/${newsId}`
        );

        if (response.data && response.data.summary) {
          setCurrentSummary(response.data.summary);

          // Show a toast notification
          toast.success(
            currentSummary
              ? "Summary has been regenerated successfully"
              : "Summary has been generated successfully",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }
      } catch (error) {
        console.error("Error fetching updated news:", error);
      }
    },
    onError: () => {
      toast.error("Failed to generate summary. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  const generateTagsMutation = useGenerateTagsForArticle({
    onSuccess: async () => {
      try {
        // Get the updated news with the new tags
        const response = await axiosInstance.get(
          `${BaseUrl.DEVELOPMENT}/${NEWS.GET_NEWSID}/${newsId}`
        );

        if (response.data && response.data.tags) {
          setCurrentTags(response.data.tags);

          // Show a toast notification
          toast.success(
            currentTags
              ? "Tags have been regenerated successfully"
              : "Tags have been generated successfully",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }
      } catch (error) {
        console.error("Error fetching updated news:", error);
      }
    },
    onError: () => {
      toast.error("Failed to generate tags. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  const handleGenerateSummary = () => {
    if (newsId) {
      generateSummaryMutation.mutate(newsId);
    }
  };

  const handleGenerateTags = () => {
    if (newsId) {
      generateTagsMutation.mutate(newsId);
    }
  };

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

        {currentSummary ? (
          <Box mb="xl">
            <Group position="apart" mb="xs">
              <Text weight={700} size="lg">
                Summary:
              </Text>
              <Tooltip label="Regenerate summary using NLP">
                <Button
                  variant="subtle"
                  compact
                  color="blue"
                  onClick={handleGenerateSummary}
                  loading={generateSummaryMutation.isLoading}
                >
                  <BrandAirtable size={16} />
                </Button>
              </Tooltip>
            </Group>
            <Text italic className="news-summary" color="dimmed">
              {currentSummary}
            </Text>
          </Box>
        ) : (
          <Box mb="xl">
            <Button
              variant="outline"
              color="blue"
              onClick={handleGenerateSummary}
              loading={generateSummaryMutation.isLoading}
              leftIcon={<BrandAirtable size={16} />}
            >
              Generate Summary with NLP
            </Button>
          </Box>
        )}

        <div
          className="news-body"
          dangerouslySetInnerHTML={{ __html: news?.content }}
        />

        {videoDetails && (
          <div
            className="news-video"
            dangerouslySetInnerHTML={{ __html: videoDetails }}
          />
        )}

        {currentTags && currentTags !== "" ? (
          <div className="news-tags">
            <Group position="apart" mb="xs">
              <Text weight={600} color="dimmed">
                Tags:
              </Text>
              <Tooltip label="Regenerate tags using NLP">
                <Button
                  variant="subtle"
                  compact
                  color="grape"
                  onClick={handleGenerateTags}
                  loading={generateTagsMutation.isLoading}
                >
                  <Tags size={16} />
                </Button>
              </Tooltip>
            </Group>
            <Group spacing="xs">
              {currentTags
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
        ) : (
          <Box mt="xl" mb="xl">
            <Button
              variant="outline"
              color="grape"
              onClick={handleGenerateTags}
              loading={generateTagsMutation.isLoading}
              leftIcon={<Tags size={16} />}
            >
              Generate Tags with NLP
            </Button>
          </Box>
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
