import React from "react";
import { Card, Image, Text, Group, Skeleton, Grid, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { useRelatedNews } from "../../hooks/useNews/useRelatedNews";
import "./RelatedNews.css";

interface RelatedNewsProps {
  newsId: string;
  limit?: number;
}

export const RelatedNews: React.FC<RelatedNewsProps> = ({
  newsId,
  limit = 4,
}) => {
  const { data: relatedNews, isLoading, error } = useRelatedNews(newsId, limit);

  if (error) {
    console.error("Error loading related news:", error);
    return null; // Hide component on error
  }

  // Create placeholder loading cards
  const LoadingCards = () => (
    <>
      {Array(limit)
        .fill(0)
        .map((_, index) => (
          <Grid.Col xs={12} sm={6} md={6} lg={3} key={`loading-${index}`}>
            <Card
              shadow="sm"
              p="lg"
              radius="md"
              withBorder
              className="related-news-card"
            >
              <Card.Section>
                <Skeleton height={160} />
              </Card.Section>
              <Skeleton height={30} mt="md" width="80%" />
              <Skeleton height={15} mt="xs" />
              <Skeleton height={15} mt={5} width="70%" />
            </Card>
          </Grid.Col>
        ))}
    </>
  );

  // No related news after loading
  if (!isLoading && (!relatedNews || relatedNews.length === 0)) {
    return null; // Hide component when no related news
  }

  return (
    <div className="related-news-container">
      <Title order={2} className="related-news-title">
        Related News
      </Title>

      <Grid gutter="md">
        {isLoading ? (
          <LoadingCards />
        ) : (
          relatedNews.map((news) => (
            <Grid.Col xs={12} sm={6} md={6} lg={3} key={news.id}>
              <Link to={`/news/${news.id}`} className="related-news-link">
                <Card
                  shadow="sm"
                  p="lg"
                  radius="md"
                  withBorder
                  className="related-news-card"
                >
                  <Card.Section>
                    <Image src={news.image} height={160} alt={news.title} />
                  </Card.Section>

                  <Text
                    weight={500}
                    className="related-news-card-title"
                    mt="md"
                    lineClamp={2}
                  >
                    {news.title}
                  </Text>

                  {news.category && (
                    <Group position="apart" mt="md">
                      <Text size="sm" color="dimmed">
                        {news.category.name}
                      </Text>
                    </Group>
                  )}
                </Card>
              </Link>
            </Grid.Col>
          ))
        )}
      </Grid>
    </div>
  );
};
