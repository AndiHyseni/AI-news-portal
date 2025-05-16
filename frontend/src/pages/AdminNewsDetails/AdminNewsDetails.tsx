import { Container, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../components/Administration/Sidebar";
import { AdminNewsDetailsC } from "../../components/AdminNewsDetails/AdminNewsDetails";
import { BasePage } from "../../components/BasePage/BasePage";
import { DeleteNewsModal } from "../../components/Modals/DeleteNewsModal";
import { useDeleteNews } from "../../hooks/useNews/useDeleteNews";
import { useNewsId } from "../../hooks/useNews/useNewsId";
import { News } from "../../types/news/news";
import "./AdminNewsDetails.css";

export const AdminNewsDetails: React.FC = () => {
  const { newsId } = useParams();
  const { data, isLoading } = useNewsId(String(newsId));

  const [selectedNews, setSelectedNews] = useState<News>();
  const [isDeleteNewsModalOpen, setIsDeleteNewsModalOpen] = useState(false);
  const deleteNewsMutation = useDeleteNews();

  const handleDeleteNews = (news: News) => {
    setSelectedNews(news);
    setIsDeleteNewsModalOpen(true);
  };

  return (
    <BasePage>
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <Container size="xl" p={0} className="news-details-container">
            {isLoading && (
              <div className="loading-container">
                <LoadingOverlay visible={true} />
              </div>
            )}

            {data && !isLoading && (
              <AdminNewsDetailsC news={data} onDeleteNews={handleDeleteNews} />
            )}

            {selectedNews && (
              <DeleteNewsModal
                news={selectedNews}
                title="Delete News Article"
                text="Are you sure you want to delete this news article?"
                onClose={() => setIsDeleteNewsModalOpen(false)}
                opened={isDeleteNewsModalOpen}
                mutation={deleteNewsMutation}
              />
            )}
          </Container>
        </div>
      </div>
    </BasePage>
  );
};
