import { Loader, Center } from "@mantine/core";
import { BasePage } from "../../components/BasePage/BasePage";
import { useNewsByTags } from "../../hooks/useNews/useNewsByTags";
import { NewsByTagsC } from "../../components/NewsByTags/NewsByTags";
import { useParams } from "react-router-dom";

export const NewsByTags: React.FC = () => {
  const { tags } = useParams();
  const { data, isLoading, isError } = useNewsByTags(String(tags));

  return (
    <BasePage>
      {isLoading ? (
        <Center style={{ padding: "40px 0" }}>
          <Loader size="lg" color="indigo" />
        </Center>
      ) : isError ? (
        <Center style={{ padding: "40px 0" }}>
          <div className="error-message">Error loading news by tag</div>
        </Center>
      ) : (
        <NewsByTagsC news={data || []} />
      )}
    </BasePage>
  );
};
