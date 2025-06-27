import { BasePage } from "../../components/BasePage/BasePage";
import { Container } from "@mantine/core";
import { useRapport } from "../../hooks/useRaport/useRaport";
import { Administration } from "../../components/Administration/Administration";
import { Sidebar } from "../../components/Administration/Sidebar";
import { useState } from "react";

export const AdminDashboard: React.FC = () => {
  const { data: raportData } = useRapport();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar onToggle={(isOpen) => setIsSidebarOpen(isOpen)} />
        <div
          className={`admin-main-content ${
            !isSidebarOpen ? "admin-main-content-collapsed" : ""
          }`}
        >
          <Container size="xl" px="xs">
            <div className="homepageadmin">
              {raportData && <Administration raport={raportData} />}
            </div>
          </Container>
        </div>
      </div>
    </BasePage>
  );
};
