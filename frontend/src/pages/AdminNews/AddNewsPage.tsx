import { Container } from "@mantine/core";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { NewsForms } from "../../components/Forms/NewsForms";

export const AddNewsPage: React.FC = () => {
  const { newsId } = useParams();
  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <NewsForms newsId={Number(newsId)} />
        </Container>
      </div>
    </BasePage>
  );
};
