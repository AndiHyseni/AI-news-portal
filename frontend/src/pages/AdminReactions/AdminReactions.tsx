import { Container } from "@mantine/core";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { ReactionsTable } from "../../components/Tables/ReactionsTable";
import { useReactions } from "../../hooks/useReactions/useReactions";
import "../AdminReactions/AdminReactions.css";

export const AdminReactions: React.FC = () => {
  const { data } = useReactions();

  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <div className="adminReactionsdiv">
            {data && <ReactionsTable reactions={data} />}
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
