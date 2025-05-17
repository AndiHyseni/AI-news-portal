import { BasePage } from "../../components/BasePage/BasePage";
import { Container } from "@mantine/core";
import { useRapport } from "../../hooks/useRaport/useRaport";
import { Administration } from "../../components/Administration/Administration";
import { Sidebar } from "../../components/Administration/Sidebar";

export const AdminDashboard: React.FC = () => {
  const { data: raportData } = useRapport();

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
