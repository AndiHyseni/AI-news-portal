import { Container } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../components/Administration/Sidebar";
import { AdminNewsDetailsC } from "../../components/AdminNewsDetails/AdminNewsDetails";
import { BasePage } from "../../components/BasePage/BasePage";
import { DeleteNewsModal } from "../../components/Modals/DeleteNewsModal";
import { useDeleteNews } from "../../hooks/useNews/useDeleteNews";
import { useNewsId } from "../../hooks/useNews/useNewsId";
import { News } from "../../types/news/news";

export const AdminNewsDetails: React.FC = () => {
  const { newsId } = useParams();
  const { data } = useNewsId(Number(newsId));

  const [selectedNews, setSelectedNews] = useState<News>();
  const [isDeleteNewsModalOpen, setIsDeleteNewsModalOpen] = useState(false);
  const deleteNewsMutation = useDeleteNews();
  const handleDeleteNews = (news: News) => {
    setSelectedNews(news);
    setIsDeleteNewsModalOpen(true);
  };
  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          {data && (
            <AdminNewsDetailsC news={data} onDeleteNews={handleDeleteNews} />
          )}
          {selectedNews && (
            <DeleteNewsModal
              news={selectedNews}
              title="Delete News Modal"
              text="Are you sure you want to delete this news?"
              onClose={() => setIsDeleteNewsModalOpen(false)}
              opened={isDeleteNewsModalOpen}
              mutation={deleteNewsMutation}
            />
          )}
        </Container>
      </div>
    </BasePage>
  );
};
