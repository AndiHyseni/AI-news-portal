import { Container } from "@mantine/core";
import { useState } from "react";
import { BasePage } from "../../components/BasePage/BasePage";
import { DeleteSavedNewsModal } from "../../components/Modals/DeleteSavedNewsModal";
import { SavedNewsC } from "../../components/SavedNews/SavedNews";
import { useDeleteSavedNews } from "../../hooks/useNews/useDeleteSavedNews";
import { useSavedNewsPage } from "../../hooks/useSavedNewsPage/useSavedNewsPage";
import { useUsers } from "../../hooks/useUsers/useUsers";
import { SavedNewsPage } from "../../types/news/news";
import "../SavedNews/SavedNews.css";

export const SavedNews: React.FC = () => {
  const { data: userIdData } = useUsers();
  const userId = userIdData?.[0]; // Get the first user

  const { data } = useSavedNewsPage(userId ? String(userId.id) : "");
  const [isDeleteSavedNewsModalOpen, setIsDeleteSavedNewsModalOpen] =
    useState(false);
  const deleteSavedNewsMutation = useDeleteSavedNews();
  const [selectedSavedNews, setSelectedSavedNews] = useState<SavedNewsPage>();
  const handleDeleteSavedNews = (savedNews: SavedNewsPage) => {
    setSelectedSavedNews(savedNews);
    setIsDeleteSavedNewsModalOpen(true);
  };

  return (
    <BasePage>
      <Container className="savedNewsPage">
        {data && (
          <SavedNewsC
            savedNews={data}
            onDeleteSavedNews={handleDeleteSavedNews}
          />
        )}
        {selectedSavedNews && userId && (
          <DeleteSavedNewsModal
            savedNews={selectedSavedNews}
            userId={userId}
            title="Delete Saved News Modal"
            text="Are you sure you want to delete this saved news?"
            onClose={() => setIsDeleteSavedNewsModalOpen(false)}
            opened={isDeleteSavedNewsModalOpen}
            mutation={deleteSavedNewsMutation}
          />
        )}
      </Container>
    </BasePage>
  );
};
