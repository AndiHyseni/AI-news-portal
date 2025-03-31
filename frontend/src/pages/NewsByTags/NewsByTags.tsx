import { Container } from "@mantine/core";
import { BasePage } from "../../components/BasePage/BasePage";
import { useNewsByTags } from "../../hooks/useNews/useNewsByTags";
import { NewsByTagsC } from "../../components/NewsByTags/NewsByTags";
import { useParams } from "react-router-dom";

export const NewsByTags: React.FC = () => {
  const { tags } = useParams();
  const { data } = useNewsByTags(String(tags));

  return (
    <BasePage>
      <Container className="newsByTagsPage">
        {data && <NewsByTagsC news={data} />}
      </Container>
    </BasePage>
  );
};
