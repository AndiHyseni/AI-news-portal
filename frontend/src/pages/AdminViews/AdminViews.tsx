import { Container } from "@mantine/core";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { ViewsTable } from "../../components/Tables/ViewsTable";
import { useViews } from "../../hooks/useViews/useViews";
import "../AdminViews/AdminViews.css";

export const AdminViews: React.FC = () => {
  const { data } = useViews();

  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <div className="adminViewsdiv">
            {data && <ViewsTable views={data} />}
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
