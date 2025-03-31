import { Container } from "@mantine/core";
import { BasePage } from "../../components/BasePage/BasePage";
import { NewsByCategoryC } from "../../components/NewsByCategory/NewsByCategory";
import { useNews } from "../../hooks/useNews/useNews";
import "../../components/NewsByCategory/NewsByCategory.css";

export const NewsByCategory: React.FC = () => {
  const { data } = useNews();

  return (
    <BasePage>
      <Container className="newsByCategoryPage">
        {data && <NewsByCategoryC news={data} />}
      </Container>
    </BasePage>
  );
};
