import { Paper, Title, Group, Badge } from "@mantine/core";
import "./TrendingTopics.css";

export const TrendingTopics: React.FC = () => {
  const trendingTopics = [
    "Breaking News",
    "Technology",
    "Health",
    "Politics",
    "Sports",
    "Science",
    "Entertainment",
    "Business",
    "World News",
    "AI & Tech",
  ];

  return (
    <Paper className="trending-topics" p="md">
      <Title order={3} className="trending-title" mb="md">
        Trending Topics
      </Title>
      <Group spacing="sm" className="trending-tags">
        {trendingTopics.map((topic, index) => (
          <Badge
            key={index}
            size="lg"
            radius="sm"
            className="trending-tag"
            variant="dot"
            color={index % 2 === 0 ? "blue" : "grape"}
          >
            {topic}
          </Badge>
        ))}
      </Group>
    </Paper>
  );
};
