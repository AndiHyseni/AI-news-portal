import { Container, Title } from "@mantine/core";
import { useState, useContext, useEffect, useCallback } from "react";
import { BasePage } from "../../components/BasePage/BasePage";
import { DeleteSavedNewsModal } from "../../components/Modals/DeleteSavedNewsModal";
import { SavedNewsC } from "../../components/SavedNews/SavedNews";
import { useDeleteSavedNews } from "../../hooks/useNews/useDeleteSavedNews";
import { useSavedNewsPage } from "../../hooks/useSavedNewsPage/useSavedNewsPage";
import { UserContext } from "../../contexts/UserContext";
import { SavedNewsPage } from "../../types/news/news";
import "../SavedNews/SavedNews.css";

export const SavedNews: React.FC = () => {
  const [userContext] = useContext(UserContext);
  const userId = userContext.userId || "";

  const { data: savedNewsData } = useSavedNewsPage(userId);
  const [savedNews, setSavedNews] = useState<SavedNewsPage[]>([]);
  const [isDeleteSavedNewsModalOpen, setIsDeleteSavedNewsModalOpen] =
    useState(false);
  const deleteSavedNewsMutation = useDeleteSavedNews();
  const [selectedSavedNews, setSelectedSavedNews] = useState<SavedNewsPage>();

  useEffect(() => {
    if (savedNewsData) {
      // Handle both array and object response formats
      if (Array.isArray(savedNewsData)) {
        setSavedNews(savedNewsData);
      } else if (typeof savedNewsData === "object") {
        // If it has a property that is an array of saved news
        const possibleArrays = Object.values(savedNewsData).filter(
          Array.isArray
        );
        if (possibleArrays.length > 0) {
          setSavedNews(possibleArrays[0] as SavedNewsPage[]);
        } else {
          // If it's a single object that should be treated as one saved news item
          setSavedNews([savedNewsData as SavedNewsPage]);
        }
      } else {
        setSavedNews([]);
      }
    } else {
      setSavedNews([]);
    }
  }, [savedNewsData]);

  const handleDeleteSavedNews = (news: SavedNewsPage) => {
    setSelectedSavedNews(news);
    setIsDeleteSavedNewsModalOpen(true);
  };

  // Callback to remove article from local state after deletion
  const handleNewsDeleted = useCallback((newsId: string) => {
    setSavedNews((prevNews) =>
      prevNews.filter((item) => item.news_id !== newsId)
    );
    setIsDeleteSavedNewsModalOpen(false);
  }, []);

  return (
    <BasePage>
      <div className="savedNewsPage">
        {savedNews && savedNews.length > 0 ? (
          <SavedNewsC
            savedNews={savedNews}
            onDeleteSavedNews={handleDeleteSavedNews}
          />
        ) : (
          <div className="no-saved-news">
            <div className="empty-icon">📰</div>
            <h2>You don't have any saved news yet</h2>
            <p>Save news articles to read them later</p>
          </div>
        )}
        {selectedSavedNews && (
          <DeleteSavedNewsModal
            savedNews={selectedSavedNews}
            title="Delete Saved News"
            text="Are you sure you want to remove this article from your saved list? This action cannot be undone."
            onClose={() => setIsDeleteSavedNewsModalOpen(false)}
            opened={isDeleteSavedNewsModalOpen}
            mutation={deleteSavedNewsMutation}
            onDeleteSuccess={handleNewsDeleted}
          />
        )}
      </div>
    </BasePage>
  );
};
