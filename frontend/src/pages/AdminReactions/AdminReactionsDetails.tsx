import { Container } from "@mantine/core";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { ReactionsDetailsTable } from "../../components/Tables/ReactionsDetailsTable";
import { useReactionsDetails } from "../../hooks/useReactions/useReactionsDetails";
import "../AdminReactions/AdminReactions.css";

export const AdminReactionsDetails: React.FC = () => {
  const { newsId } = useParams();
  const { data } = useReactionsDetails(Number(newsId));

  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <div className="adminReactionsdiv">
            {data && <ReactionsDetailsTable reactionsDetails={data} />}
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
