import { BasePage } from "../../components/BasePage/BasePage";
import {
  Container,
  Title,
  Grid,
  Paper,
  Text,
  Group,
  ThemeIcon,
  Loader,
  Center,
} from "@mantine/core";
import { HomepageNews } from "../../components/HomepageNews/HomepageNews";
import { useNews } from "../../hooks/useNews/useNews";
import "./Homepage.css";
import { SiteNewsOnPage } from "../../components/SiteNewsOnPage/SiteNewsOnPage";
import { MostWatchedNews } from "../../components/MostWatchedNews/MostWatchedNews";
import { NewsByCategories } from "../../components/NewsByCategories/NewsByCategories";
import { TrendingTopics } from "../../components/TrendingTopics/TrendingTopics";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import {
  IconBriefcase,
  IconNews,
  IconRobot,
  IconClock,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export const Homepage: React.FC = () => {
  const { data: newsData, isLoading: newsLoading } = useNews();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data, isLoading: configLoading } = useConfiguration();
  const navigate = useNavigate();

  const isLoading = newsLoading || categoriesLoading || configLoading;

  if (isLoading) {
    return (
      <BasePage>
        <Center style={{ height: "70vh" }}>
          <Loader size="xl" variant="dots" />
        </Center>
      </BasePage>
    );
  }

  return (
    <BasePage>
      <Container size="xl" px="xs">
        <div className="homepage">
          {/* Quick Info Section */}
          <Grid mb={0}>
            <Grid.Col span={3}>
              <Paper className="stat-card">
                <Group>
                  <ThemeIcon size="lg" radius="md" color="blue">
                    <IconNews size={20} />
                  </ThemeIcon>
                  <Text size="sm">Real-time News Updates</Text>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={3}>
              <Paper
                className="stat-card"
                onClick={() => navigate("/careers")}
                style={{ cursor: "pointer" }}
              >
                <Group>
                  <ThemeIcon size="lg" radius="md" color="grape">
                    <IconBriefcase size={20} />
                  </ThemeIcon>
                  <Text size="sm">Join Our Team</Text>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={3}>
              <Paper className="stat-card">
                <Group>
                  <ThemeIcon size="lg" radius="md" color="teal">
                    <IconClock size={20} />
                  </ThemeIcon>
                  <Text size="sm">24/7 Coverage</Text>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={3}>
              <Paper className="stat-card">
                <Group>
                  <ThemeIcon size="lg" radius="md" color="orange">
                    <IconRobot size={20} />
                  </ThemeIcon>
                  <Text size="sm">AI-Powered Analysis</Text>
                </Group>
              </Paper>
            </Grid.Col>
          </Grid>

          {data?.show_featured == true && (
            <div className="homepage-section">
              <Title order={2} className="homepage-title">
                Featured News
              </Title>
              <div className="homepage-featured">
                {newsData && <HomepageNews homenews={newsData} />}
              </div>
            </div>
          )}

          {/* Trending Topics */}
          <TrendingTopics />

          <div className="homepage-section">
            <Title order={2} className="homepage-title">
              Latest News
            </Title>
            {newsData && categories && (
              <SiteNewsOnPage homenews={newsData} categories={categories} />
            )}
          </div>

          {data?.show_most_watched == true && (
            <div className="homepage-section">
              <Title order={2} className="homepage-title">
                Most Watched
              </Title>
              {newsData && <MostWatchedNews mostwatched={newsData} />}
            </div>
          )}

          {categories && newsData && (
            <div className="homepage-section">
              <Title order={2} className="homepage-title">
                News by Categories
              </Title>
              <NewsByCategories news={newsData} categories={categories} />
            </div>
          )}
        </div>
      </Container>
    </BasePage>
  );
};
