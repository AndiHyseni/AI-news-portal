import { Button, Image, Select, Container, Title, Text } from "@mantine/core";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "tabler-icons-react";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { Categories } from "../../types/categories/categories";
import { News } from "../../types/news/news";
import { UserContext } from "../../contexts/UserContext";
import "../SiteNewsOnPage/SiteNewsOnPage.css";

type NewsResponse = News[] | { news: News[] };
type CategoriesResponse = Categories[] | { categories: Categories[] };

export interface NewsProps {
  homenews: NewsResponse;
  categories: CategoriesResponse;
}

enum SortOption {
  NewestFirst = "Newest",
  OldestFirst = "Oldest",
  MostWatched = "Most Watched",
}

export const SiteNewsOnPage: React.FC<NewsProps> = ({
  homenews = [],
  categories = [],
}) => {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.NewestFirst
  );
  const [showAllNews, setShowAllNews] = useState<boolean>(false);
  const [userContext] = useContext(UserContext);

  // Ensure homenews is an array and handle the data structure
  const newsArray: News[] = Array.isArray(homenews)
    ? homenews
    : (homenews as { news: News[] }).news || [];

  // Ensure categories is an array and handle the data structure
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

  const sortedNews = [...newsArray].sort((a, b) => {
    if (sortOption === SortOption.NewestFirst) {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOption === SortOption.OldestFirst) {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortOption === SortOption.MostWatched) {
      return b.number_of_clicks - a.number_of_clicks;
    }
    return 0;
  });

  const visibleNews = showAllNews ? sortedNews : sortedNews.slice(0, 10);

  const toggleShowAllNews = () => {
    setShowAllNews(!showAllNews);
  };

  return (
    <Container size="xl" px="xs" className="sitepage">
      <div className="sort-container">
        <div className="selectLabel">
          <Text className="Shiko">Sort by:</Text>
          <Select
            className="selectList"
            value={sortOption}
            onChange={(value) => setSortOption(value as SortOption)}
            data={[
              { label: "Newest", value: SortOption.NewestFirst },
              { label: "Oldest", value: SortOption.OldestFirst },
              { label: "Most Watched", value: SortOption.MostWatched },
            ]}
          />
        </div>
      </div>

      <div className="divRead">
        <div className="divReklama">
          {visibleNews.map((news: News, index: number) => (
            <div key={index} className="sitediv">
              <div className="siteimage-container">
                <Image
                  src={news.image}
                  className="siteimage"
                  onClick={() => handleNewsClick(news.id)}
                  alt={news.title}
                  fit="cover"
                />
              </div>
              <div className="site">
                <h2
                  className="sitetitle"
                  onClick={() => handleNewsClick(news.id)}
                >
                  {news.title}
                </h2>
                <div className="sitep">
                  {categoriesArray
                    .filter((x: Categories) => x.id === news.category_id)
                    .map((category: Categories, index: number) => (
                      <span
                        key={index}
                        className="sitec"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/category/${category.id}`);
                        }}
                      >
                        {category.name}
                      </span>
                    ))}
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "13px",
                      color: "#666",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Clock size={14} strokeWidth={1.5} />
                    {formatDate(news.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="button-container">
            <Button onClick={toggleShowAllNews} className="show-more-button">
              {showAllNews ? "Show Less" : "Show More"}
            </Button>
          </div>
        </div>

        <div className="ads-container">
          <div className="ad-image">
            <Image
              src="../../images/reklama1.jpg"
              radius="md"
              alt="Advertisement 1"
            />
          </div>
          <div className="ad-image">
            <Image
              src="../../images/reklama.jpg"
              radius="md"
              alt="Advertisement 2"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
