import { Container } from "@mantine/core";
import { BasePage } from "../../components/BasePage/BasePage";
import { NewsByCategoryC } from "../../components/NewsByCategory/NewsByCategory";
import { useNews } from "../../hooks/useNews/useNews";
import { useCategories } from "../../hooks/useCategories/useCategories";
import "../../components/NewsByCategory/NewsByCategory.css";

export const NewsByCategory: React.FC = () => {
  const { data } = useNews();
  const { data: categories } = useCategories();

  return (
    <BasePage>
      <Container className="newsByCategoryPage">
        {data && categories && (
          <NewsByCategoryC news={data} categories={categories} />
        )}
      </Container>
    </BasePage>
  );
};
