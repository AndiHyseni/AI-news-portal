import { BasePage } from "../../components/BasePage/BasePage";
import { Container, Title } from "@mantine/core";
import { HomepageNews } from "../../components/HomepageNews/HomepageNews";
import { useNews } from "../../hooks/useNews/useNews";
import "./Homepage.css";
import { SiteNewsOnPage } from "../../components/SiteNewsOnPage/SiteNewsOnPage";
import { useRapport } from "../../hooks/useRaport/useRaport";
import { Administration } from "../../components/Administration/Administration";
import { Sidebar } from "../../components/Administration/Sidebar";
import { MostWatchedNews } from "../../components/MostWatchedNews/MostWatchedNews";
import { useCategories } from "../../hooks/useCategories/useCategories";
import jwtDecode from "jwt-decode";

export const Homepage: React.FC = () => {
  const { data: newsData, isLoading: newsLoading } = useNews();
  const { data: raportData } = useRapport();
  const { data: categories } = useCategories();

  const token: any =
    localStorage.getItem("jwt") != null
      ? jwtDecode(localStorage.getItem("jwt")!)
      : null;

  const isRegisteredUser =
    token != null
      ? token[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] === "Registered"
      : true;

  if (isRegisteredUser) {
    return (
      <BasePage>
        <Container size="xl" px="xs">
          <div className="homepage">
            <div className="homepage-section">
              <Title order={2} className="homepage-title">
                Featured News
              </Title>
              <div className="homepage-featured">
                {newsData && <HomepageNews homenews={newsData} />}
              </div>
            </div>

            <div className="homepage-section">
              <Title order={2} className="homepage-title">
                Latest News
              </Title>
              {newsData && categories && (
                <SiteNewsOnPage homenews={newsData} categories={categories} />
              )}
            </div>

            <div className="homepage-section">
              <Title order={2} className="homepage-title">
                Most Watched
              </Title>
              {newsData && <MostWatchedNews mostwatched={newsData} />}
            </div>
          </div>
        </Container>
      </BasePage>
    );
  }

  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container size="xl" px="xs" style={{ width: "100%" }}>
          <div className="homepageadmin">
            {raportData && <Administration raport={raportData} />}
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
