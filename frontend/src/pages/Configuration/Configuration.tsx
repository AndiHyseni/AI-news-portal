import { Container } from "@mantine/core";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { ConfigurationC } from "../../components/Configuration/Configuration";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import "../Configuration/Configuration.css";

export const Configuration: React.FC = () => {
  const { data } = useConfiguration();

  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <div className="configurationDiv">
            {data && <ConfigurationC configuration={data} />}
            <ToastContainer />
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
