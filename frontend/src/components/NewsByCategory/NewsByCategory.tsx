import {
  Image,
  SimpleGrid,
  Container,
  Paper,
  Title,
  Box,
  Group,
  Text,
} from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { News } from "../../types/news/news";
import { UserContext } from "../../contexts/UserContext";
import "../NewsByCategory/NewsByCategory.css";
import { Categories } from "../../types/categories/categories";
import { SearchBar } from "../SearchBar/SearchBar";

export interface NewsByCategoryProps {
  news: News[] | { news: News[] };
  categories: Categories[] | { categories: Categories[] };
}

export const NewsByCategoryC: React.FC<NewsByCategoryProps> = ({
  news,
  categories,
}) => {
  const { categoryId } = useParams();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [userContext] = useContext(UserContext);

  // Ensure news is an array
  const newsArray = Array.isArray(news)
    ? news
    : (news as { news: News[] }).news || [];

  // Ensure categories is an array
  const categoriesArray = Array.isArray(categories)
    ? categories
    : (categories as { categories: Categories[] }).categories || [];

  const addView = (newsId: string) => {
    const model: AddViewModel = {
      user_id: userContext.userId || "",
      news_id: newsId,
      finger_print_id: "",
      watch_id: 2,
    };
    addViews(model);
  };

  const handleNewsClick = (newsId: string) => {
    addView(newsId);
    navigate(`/news/${newsId}`);
  };

  const getCategoryName = (categoryId: string) => {
    if (!Array.isArray(categoriesArray)) {
      return "";
    }
    const category = categoriesArray.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter news by category, date range, and search query
  const filteredNews = newsArray.filter((x) => {
    const matchesCategory = x.category_id === String(categoryId);
    if (!matchesCategory) return false;

    const matchesSearch =
      !searchQuery.trim() ||
      x.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
    if (!matchesSearch) return false;

    if (dateRange[0] && dateRange[1]) {
      const newsDate = new Date(x.created_at);
      return newsDate >= dateRange[0] && newsDate <= dateRange[1];
    }

    return true;
  });

  const currentCategoryName = getCategoryName(categoryId || "");

  return (
    <>
      <Container size="xl" px="md" className="category-container">
        <Box mb={30}>
          <Title order={1} className="category-page-title">
            {currentCategoryName || "Category"}
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
                placeholder="Search in this category..."
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
          </Group>
        </Box>

        {filteredNews.length > 0 ? (
          <SimpleGrid
            cols={3}
            spacing="xl"
            breakpoints={[
              { maxWidth: 1200, cols: 3, spacing: "md" },
              { maxWidth: 980, cols: 2, spacing: "md" },
              { maxWidth: 755, cols: 1, spacing: "sm" },
            ]}
          >
            {filteredNews.map((news, index) => (
              <Paper
                key={index}
                className="newsByCategory"
                radius="md"
                shadow="md"
              >
                <div className="newsByCategoryBox">
                  <div className="image-container">
                    <div className="category-label">
                      {getCategoryName(news.category_id)}
                    </div>
                    <Image
                      className="newsByCategoryImage"
                      src={news.image}
                      onClick={() => handleNewsClick(news.id)}
                      alt={news.title}
                      height={200}
                      fit="cover"
                    />
                  </div>
                  <div
                    className="newsByCategoryTitle"
                    onClick={() => handleNewsClick(news.id)}
                  >
                    {news.title}
                  </div>
                  <div className="news-date">{formatDate(news.created_at)}</div>
                </div>
              </Paper>
            ))}
          </SimpleGrid>
        ) : (
          <div className="no-results">
            <Text size="lg" color="dimmed">
              No news articles found for this category with the selected filters
            </Text>
          </div>
        )}
      </Container>
    </>
  );
};
