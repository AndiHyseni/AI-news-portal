import { Button, Container } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { CirclePlus } from "tabler-icons-react";
import { Sidebar } from "../../components/Administration/Sidebar";
import { BasePage } from "../../components/BasePage/BasePage";
import { NewsTable } from "../../components/Tables/NewsTable";
import { useNews } from "../../hooks/useNews/useNews";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { useState, useMemo } from "react";
import { News } from "../../types/news/news";
import "../AdminNews/AdminNews.css";

export const AdminNews: React.FC = () => {
  const { data } = useNews();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter news based on search query
  const filteredNews = useMemo(() => {
    if (!data || !searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();
    const newsArray = Array.isArray(data)
      ? data
      : (data as { news: News[] }).news || [];

    return {
      news: newsArray.filter((news) =>
        news.title.toLowerCase().includes(query)
      ),
    };
  }, [data, searchQuery]);

  return (
    <BasePage>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container style={{ width: "100%" }}>
          <div className="admin-news-header">
            <Button
              leftIcon={<CirclePlus size={20} />}
              onClick={() => navigate("/admin/news/add")}
              className="add-news-button"
            >
              Add News
            </Button>
            <div className="admin-search">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search news by title..."
              />
            </div>
          </div>
          <div className="adminNewsdiv">
            {filteredNews && <NewsTable newses={filteredNews} />}
          </div>
        </Container>
      </div>
    </BasePage>
  );
};
