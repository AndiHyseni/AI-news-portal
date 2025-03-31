import { Container } from "@mantine/core";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { EditNewsForm } from "../../components/EditNews/EditNewsForm";
import { useCreateNews } from "../../hooks/useCreateNews/useCreateNews";
import { useNewsId } from "../../hooks/useNews/useNewsId";

export const EditNewsPage: React.FC = () => {
  const { newsId } = useParams();
  const { data } = useNewsId(Number(newsId));
  const createNewsMutation = useCreateNews();

  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          {data && (
            <EditNewsForm
              newsId={Number(newsId)}
              news={data}
              mutation={createNewsMutation}
            />
          )}
        </Container>
      </div>
    </BasePage>
  );
};
