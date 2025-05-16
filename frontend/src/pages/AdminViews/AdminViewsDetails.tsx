import { Container } from "@mantine/core";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { ViewsDetailsTable } from "../../components/Tables/ViewsDetailsTable";
import { useViewsDetails } from "../../hooks/useViews/useViewsDetails";
import { ViewsDetails } from "../../types/administration/administration";
import "../AdminViews/AdminViews.css";

interface ApiResponse {
  watched: ViewsDetails[];
  statusIsOk: boolean;
  statusCode: string;
  statusMessage: string;
  statusPath: string;
  statusDate: string;
}

export const AdminViewsDetails: React.FC = () => {
  const { newsId } = useParams();
  const { data, isLoading, error } = useViewsDetails(String(newsId));

  // Extract the watched array from the response
  const viewsDetailsArray: ViewsDetails[] = Array.isArray(data)
    ? data
    : (data as unknown as ApiResponse)?.watched || [];

  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <div className="adminViewsdiv">
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error loading views details</p>
            ) : (
              <ViewsDetailsTable viewsDetails={viewsDetailsArray} />
            )}
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
