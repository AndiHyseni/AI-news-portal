import {
  Grid,
  Image,
  Container,
  Title,
  Box,
  Group,
  Text,
  Button,
} from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import { useState, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { News } from "../../types/news/news";
import { UserContext } from "../../contexts/UserContext";
import { SearchBar } from "../SearchBar/SearchBar";
import { NewsPaper } from "../NewsPaper/NewsPaper";
import { FileText } from "tabler-icons-react";
import { PrintStyles } from "../NewsPaper/PrintStyles";
import "../NewsByTags/NewsByTags.css";

export interface NewsByTagsProps {
  news: News[];
}

export const NewsByTagsC: React.FC<NewsByTagsProps> = ({ news }) => {
  const { tags } = useParams();
  const navigate = useNavigate();
  const [userContext] = useContext(UserContext);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const newspaperRef = useRef<HTMLDivElement>(null);

  // Ensure news is an array
  const newsArray = Array.isArray(news) ? news : [];

  const addView = (newsId: string) => {
    const model: AddViewModel = {
      user_id: userContext.userId || "",
      news_id: newsId,
      finger_print_id: "",
      watch_id: 2,
    };
    addViews(model);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter news by date range and search query
  const filteredNews = newsArray.filter((newsItem) => {
    const matchesSearch =
      !searchQuery.trim() ||
      newsItem.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
    if (!matchesSearch) return false;

    if (dateRange[0] && dateRange[1]) {
      const newsDate = new Date(newsItem.created_at);
      return newsDate >= dateRange[0] && newsDate <= dateRange[1];
    }
    return true;
  });

  const handleExport = () => {
    setTimeout(() => {
      if (newspaperRef.current) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>News Tagged with "${tags}"</title>
                <style>${PrintStyles}</style>
              </head>
              <body>
                ${newspaperRef.current.outerHTML}
                <script>
                  window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                      window.close();
                    };
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    }, 100);
  };

  return (
    <div className="newsByTags-container">
      <Container size="xl">
        <Box mb={30}>
          <Title order={1} className="newsByTags-header">
            News tagged with "{tags}"
          </Title>
        </Box>

        <Box mb={30} className="filters-container">
          <Group position="left" align="flex-end" spacing="lg">
            <div className="filter-group">
              <Text size="sm" weight={500}>
                Search:
              </Text>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search in tagged news..."
              />
            </div>
            <div className="filter-group">
              <Text size="sm" weight={500}>
                Filter by Date:
              </Text>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                clearable
                placeholder="Pick date range"
                style={{ minWidth: 300 }}
              />
            </div>
            <div className="filter-group">
              <Button
                leftIcon={<FileText size={16} />}
                onClick={handleExport}
                variant="filled"
                color="indigo"
                disabled={filteredNews.length === 0}
              >
                Export as Newspaper
              </Button>
            </div>
          </Group>
        </Box>

        {filteredNews.length > 0 ? (
          <Grid gutter={25}>
            {filteredNews.map((newsItem, index) => (
              <Grid.Col xs={12} sm={6} md={4} key={index}>
                <div className="newsByTagsBox">
                  <div className="image-container">
                    <Image
                      className="newsByTagsImage"
                      src={newsItem.image}
                      alt={newsItem.title}
                      onClick={() => {
                        addView(newsItem.id);
                        navigate(`/news/${newsItem.id}`);
                      }}
                      fit="cover"
                    />
                  </div>
                  <div
                    className="newsByTagsTitle"
                    onClick={() => {
                      addView(newsItem.id);
                      navigate(`/news/${newsItem.id}`);
                    }}
                  >
                    {newsItem.title}
                  </div>
                  <div className="news-date">
                    {formatDate(newsItem.created_at)}
                  </div>
                </div>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <div className="no-results">
            <Text size="lg" color="dimmed">
              No news found for tag "{tags}" with the selected filters
            </Text>
          </div>
        )}
      </Container>

      <div style={{ display: "none" }}>
        <NewsPaper
          ref={newspaperRef}
          news={filteredNews}
          categoryName={`News Tagged with "${tags}"`}
        />
      </div>
    </div>
  );
};
