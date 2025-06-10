import { Button, Image, Select, Container, Text, Group } from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "tabler-icons-react";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { Categories } from "../../types/categories/categories";
import { News } from "../../types/news/news";
import { UserContext } from "../../contexts/UserContext";
import { SearchBar } from "../SearchBar/SearchBar";
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "all"
  );
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filter news based on selected category, date range, and search query
  const filteredNews = newsArray.filter((news) => {
    const matchesCategory =
      selectedCategory === "all" || news.category_id === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      news.title.toLowerCase().includes(searchQuery.toLowerCase().trim());

    const newsDate = new Date(news.created_at);
    const matchesDateRange =
      !dateRange[0] ||
      !dateRange[1] ||
      (newsDate >= dateRange[0] && newsDate <= dateRange[1]);

    return matchesCategory && matchesDateRange && matchesSearch;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
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

  // Prepare categories for select dropdown
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categoriesArray.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  return (
    <Container size="xl" px="xs" className="sitepage">
      <div className="filters-container">
        <Group spacing="md" align="flex-end">
          <div className="filter-group">
            <Text size="sm" weight={500}>
              Search:
            </Text>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search in latest news..."
            />
          </div>

          <div className="filter-group">
            <Text size="sm" weight={500}>
              Category:
            </Text>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              data={categoryOptions}
              clearable={false}
              style={{ minWidth: 200 }}
            />
          </div>

          <div className="filter-group">
            <Text size="sm" weight={500}>
              Date Range:
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
            <Text size="sm" weight={500}>
              Sort by:
            </Text>
            <Select
              value={sortOption}
              onChange={(value) => setSortOption(value as SortOption)}
              data={[
                { label: "Newest", value: SortOption.NewestFirst },
                { label: "Oldest", value: SortOption.OldestFirst },
                { label: "Most Watched", value: SortOption.MostWatched },
              ]}
              style={{ minWidth: 150 }}
            />
          </div>
        </Group>
      </div>

      <div className="divRead">
        <div className="divReklama">
          {visibleNews.length > 0 ? (
            visibleNews.map((news, index) => (
              <div key={index} className="sitediv">
                <div className="siteimage-container">
                  <Image
                    src={news.image}
                    className="siteimage"
                    onClick={() => handleNewsClick(news.id)}
                    alt={news.title}
                    fit="cover"
                    height={268}
                  />
                </div>
                <div className="site">
                  <h2
                    className="sitetitle"
                    onClick={() => handleNewsClick(news.id)}
                  >
                    {news.title}
                  </h2>
                  {news.summary && (
                    <p className="site-summary">
                      {news.summary.length > 150
                        ? `${news.summary.substring(0, 150)}...`
                        : news.summary}
                    </p>
                  )}
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
            ))
          ) : (
            <div className="no-results">
              <Text size="lg" color="dimmed">
                No news articles found matching the selected filters
              </Text>
            </div>
          )}

          {sortedNews.length > 10 && (
            <div className="button-container">
              <Button onClick={toggleShowAllNews} className="show-more-button">
                {showAllNews ? "Show Less" : "Show More"}
              </Button>
            </div>
          )}
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
