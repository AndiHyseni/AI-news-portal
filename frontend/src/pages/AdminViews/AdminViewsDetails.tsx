import { Container } from "@mantine/core";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { ViewsDetailsTable } from "../../components/Tables/ViewsDetailsTable";
import { useViewsDetails } from "../../hooks/useViews/useViewsDetails";
import "../AdminViews/AdminViews.css";

export const AdminViewsDetails: React.FC = () => {
  const { newsId } = useParams();
  const { data } = useViewsDetails(Number(newsId));

  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <div className="adminViewsdiv">
            {data && <ViewsDetailsTable viewsDetails={data} />}
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
