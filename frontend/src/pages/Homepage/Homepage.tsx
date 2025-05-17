import { BasePage } from "../../components/BasePage/BasePage";
import { Container, Title } from "@mantine/core";
import { HomepageNews } from "../../components/HomepageNews/HomepageNews";
import { useNews } from "../../hooks/useNews/useNews";
import "./Homepage.css";
import { SiteNewsOnPage } from "../../components/SiteNewsOnPage/SiteNewsOnPage";
import { MostWatchedNews } from "../../components/MostWatchedNews/MostWatchedNews";
import { useCategories } from "../../hooks/useCategories/useCategories";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";

export const Homepage: React.FC = () => {
  const { data: newsData } = useNews();
  const { data: categories } = useCategories();
  const { data } = useConfiguration();

  return (
    <BasePage>
      <Container size="xl" px="xs">
        <div className="homepage">
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
        </div>
      </Container>
    </BasePage>
  );
};
