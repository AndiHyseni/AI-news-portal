import { Button, Image, Select } from "@mantine/core";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { Categories } from "../../types/categories/categories";
import { News } from "../../types/news/news";
import "../SiteNewsOnPage/SiteNewsOnPage.css";

export interface NewsProps {
  homenews: News[];
  categories: Categories[];
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
  homenews,
  categories,
}) => {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.NewestFirst
  );
  const [showAllNews, setShowAllNews] = useState<boolean>(false);

  const addView = (newsId: number) => {
    const model: AddViewModel = {
      userId: id,
      newsId: newsId,
      fingerPrintId: "",
      watchId: 2,
    };
    addViews(model);
  };

  const sortedNews = [...homenews].sort((a, b) => {
    console.log(homenews);
    if (sortOption === SortOption.NewestFirst) {
      return new Date(b.newsId).getTime() - new Date(a.newsId).getTime();
    } else if (sortOption === SortOption.OldestFirst) {
      return new Date(a.newsId).getTime() - new Date(b.newsId).getTime();
    } else if (sortOption === SortOption.MostWatched) {
      return b.numberOfClicks - a.numberOfClicks;
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
              {visibleNews.map((news, index) => (
                <div key={index} className="sitediv">
                  <Image
                    src={news.image}
                    className="siteimage"
                    onClick={() => {
                      addView(news.newsId);
                      navigate(`/news/${news.newsId}`);
                    }}
                  />
                  <div className="site">
                    <h2
                      className="sitetitle"
                      onClick={() => {
                        addView(news.newsId);
                        navigate(`/news/${news.newsId}`);
                      }}
                    >
                      {news.title}
                    </h2>
                    <p className="sitep">
                      <>
                        {categories
                          .filter((x) => x.categoryId == news.categoryId)
                          .map((news) => {
                            return (
                              <div
                                className="sitec"
                                onClick={() => {
                                  navigate(`/category/${news.categoryId}`);
                                }}
                              >
                                {news.name}
                              </div>
                            );
                          })}
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
