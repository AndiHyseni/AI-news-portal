import { Image, SimpleGrid, Container, Paper, Title, Box } from "@mantine/core";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { News } from "../../types/news/news";
import { UserContext } from "../../contexts/UserContext";
import "../NewsByCategory/NewsByCategory.css";
import { Categories } from "../../types/categories/categories";

export interface NewsByCategoryProps {
  news: News[] | { news: News[] };
  categories: Categories[] | { categories: Categories[] };
}

export const NewsByCategoryC: React.FC<NewsByCategoryProps> = ({
  news,
  categories,
}) => {
  const { categoryId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
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

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredNews(newsArray);
    } else {
      // Filter news by categoryId matching the selectedCategory
      setFilteredNews(
        newsArray.filter((item) => {
          const category = categoriesArray.find(
            (cat) => cat.id === item.category_id
          );
          return category?.name === selectedCategory;
        })
      );
    }
  }, [selectedCategory, newsArray, categoriesArray]);

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

  const currentCategoryName = getCategoryName(categoryId || "");

  return (
    <>
      <Container size="xl" px="md" className="category-container">
        <Box mb={30}>
          <Title order={1} className="category-page-title">
            {currentCategoryName || "Category"}
          </Title>
        </Box>

        <SimpleGrid
          cols={3}
          spacing="xl"
          breakpoints={[
            { maxWidth: 1200, cols: 3, spacing: "md" },
            { maxWidth: 980, cols: 2, spacing: "md" },
            { maxWidth: 755, cols: 1, spacing: "sm" },
          ]}
        >
          {filteredNews
            .filter((x) => x.category_id == String(categoryId))
            .map((news, index) => (
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
      </Container>
    </>
  );
};
