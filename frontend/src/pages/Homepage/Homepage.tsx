import { BasePage } from "../../components/BasePage/BasePage";
import { Container } from "@mantine/core";
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
  const { data } = useNews();
  const { data: raportData } = useRapport();
  const { data: categori } = useCategories();

  const token: any =
    localStorage.getItem("jwt") != null
      ? jwtDecode(localStorage.getItem("jwt")!)
      : null;

  var simpleUser =
    token != null
      ? token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ==
        "Registered"
      : true;

  return (
    <>
      {simpleUser && (
        <BasePage>
          <Container>
            <div className="homepage">
              {data && <HomepageNews homenews={data} />}
            </div>
            <div>
              {data && categori && (
                <SiteNewsOnPage homenews={data} categories={categori} />
              )}
            </div>
            <div>{data && <MostWatchedNews mostwatched={data} />}</div>
          </Container>
        </BasePage>
      )}
      {!simpleUser && (
        <BasePage>
          <div style={{ display: "flex" }}>
            <Sidebar />
            <Container style={{ width: "100%" }}>
              <div className="homepageadmin">
                {raportData && <Administration raport={raportData} />}
              </div>
            </Container>
          </div>
        </BasePage>
      )}
    </>
  );
};
