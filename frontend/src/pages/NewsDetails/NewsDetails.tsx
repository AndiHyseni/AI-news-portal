import { Container } from "@mantine/core";
import { useParams } from "react-router-dom";
import { BasePage } from "../../components/BasePage/BasePage";
import { NewsDetailsId } from "../../components/NewsDetailsId/NewsDetailsId";
import { useNewsId } from "../../hooks/useNews/useNewsId";

export const NewsDetails: React.FC = () => {
  const { newsId } = useParams();
  const { data } = useNewsId(Number(newsId));

  return (
    <BasePage>
      <Container>{data && <NewsDetailsId news={data} />}</Container>
    </BasePage>
  );
};
