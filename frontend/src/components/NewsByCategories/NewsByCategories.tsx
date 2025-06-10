import { Carousel } from "@mantine/carousel";
import { Image, Paper, Text, Title, Group } from "@mantine/core";
import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { News } from "../../types/news/news";
import { Categories } from "../../types/categories/categories";
import { UserContext } from "../../contexts/UserContext";
import Autoplay from "embla-carousel-autoplay";
import "./NewsByCategories.css";

interface NewsByCategoriesProps {
  news: News[] | { news: News[] };
  categories: Categories[] | { categories: Categories[] };
}

export const NewsByCategories: React.FC<NewsByCategoriesProps> = ({
  news,
  categories,
}) => {
  const navigate = useNavigate();
  const [userContext] = useContext(UserContext);
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  // Ensure news is an array
  const newsArray: News[] = Array.isArray(news)
    ? news
    : (news as { news: News[] }).news || [];

  // Ensure categories is an array
  const categoriesArray: Categories[] = Array.isArray(categories)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Group news by category
  const newsByCategory = categoriesArray
    .map((category) => {
      const categoryNews = newsArray
        .filter((news) => news.category_id === category.id)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5); // Get latest 5 news for each category

      return {
        category,
        news: categoryNews,
      };
    })
    .filter((item) => item.news.length > 0); // Only show categories with news

  if (newsByCategory.length === 0) {
    return null;
  }

  return (
    <div className="news-by-categories">
      {newsByCategory.map((categoryGroup, groupIndex) => (
        <div key={groupIndex} className="category-section">
          <Group position="apart" mb="md">
            <Title order={3} className="category-title">
              {categoryGroup.category.name}
            </Title>
            <Text
              className="view-all"
              onClick={() => navigate(`/category/${categoryGroup.category.id}`)}
            >
              View All
            </Text>
          </Group>

          <Carousel
            slideSize="33.333333%"
            slideGap="md"
            align="start"
            slidesToScroll={1}
            withControls
            loop
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
            breakpoints={[
              { maxWidth: "md", slideSize: "50%" },
              { maxWidth: "sm", slideSize: "100%", slideGap: "sm" },
            ]}
          >
            {categoryGroup.news.map((newsItem, index) => (
              <Carousel.Slide key={index}>
                <Paper className="news-card" radius="md">
                  <div className="news-image-container">
                    <Image
                      src={newsItem.image}
                      height={200}
                      fit="cover"
                      className="news-image"
                      onClick={() => handleNewsClick(newsItem.id)}
                    />
                  </div>
                  <div className="news-content">
                    <Text
                      className="news-title"
                      onClick={() => handleNewsClick(newsItem.id)}
                    >
                      {newsItem.title}
                    </Text>
                    <Text size="sm" color="dimmed" className="news-date">
                      {formatDate(newsItem.created_at)}
                    </Text>
                  </div>
                </Paper>
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>
      ))}
    </div>
  );
};
