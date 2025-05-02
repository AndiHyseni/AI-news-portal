import { Button, Image, Select } from "@mantine/core";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { Categories } from "../../types/categories/categories";
import { News } from "../../types/news/news";
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

var token: any =
  localStorage.getItem("jwt") != null
    ? jwtDecode(localStorage.getItem("jwt")!)
    : "";

var id: string =
  token != null
    ? token[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ]
    : "";

export const SiteNewsOnPage: React.FC<NewsProps> = ({
  homenews = [],
  categories = [],
}) => {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.NewestFirst
  );
  const [showAllNews, setShowAllNews] = useState<boolean>(false);

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
      user_id: id,
      news_id: newsId,
      finger_print_id: "",
      watch_id: 2,
    };
    addViews(model);
  };

  const sortedNews = [...newsArray].sort((a, b) => {
    if (sortOption === SortOption.NewestFirst) {
      return new Date(b.id).getTime() - new Date(a.id).getTime();
    } else if (sortOption === SortOption.OldestFirst) {
      return new Date(a.id).getTime() - new Date(b.id).getTime();
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
    <div className="sitepage">
      <div>
        <h1 className="fokus">Në Fokus</h1>
        <div className="selectLabel">
          <p className="Shiko">Shiko:</p>
          <Select
            className="selectList"
            value={sortOption}
            onChange={(value) => setSortOption(value as SortOption)}
            data={[
              { label: "Më të rejat", value: SortOption.NewestFirst },
              { label: "Më të vjetrat", value: SortOption.OldestFirst },
              { label: "Më të shikuarat", value: SortOption.MostWatched },
            ]}
          />
        </div>
      </div>
      <div className="divRead">
        <div className="divReklama">
          <div>
            <>
              {visibleNews.map((news: News, index: number) => (
                <div key={index} className="sitediv">
                  <Image
                    src={news.image}
                    className="siteimage"
                    onClick={() => {
                      addView(news.id);
                      navigate(`/news/${news.id}`);
                    }}
                  />
                  <div className="site">
                    <h2
                      className="sitetitle"
                      onClick={() => {
                        addView(news.id);
                        navigate(`/news/${news.id}`);
                      }}
                    >
                      {news.title}
                    </h2>
                    <p className="sitep">
                      <>
                        {categoriesArray
                          .filter((x: Categories) => x.id === news.category_id)
                          .map((category: Categories, index: number) => (
                            <div
                              key={index}
                              className="sitec"
                              onClick={() => {
                                navigate(`/category/${category.id}`);
                              }}
                            >
                              {category.name}
                            </div>
                          ))}
                      </>
                    </p>
                  </div>
                </div>
              ))}
            </>
          </div>
          <div className="button-container">
            <Button onClick={toggleShowAllNews} color={"indigo"}>
              {showAllNews ? "Show Less" : "Show More"}
            </Button>
          </div>
        </div>
        <div>
          <Image src="../../images/reklama1.jpg" width={500} />
          <Image src="../../images/reklama.jpg" width={500} height={1000} />
        </div>
      </div>
    </div>
  );
};
