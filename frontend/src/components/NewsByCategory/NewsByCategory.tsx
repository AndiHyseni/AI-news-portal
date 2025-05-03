import { Image } from "@mantine/core";
import jwtDecode from "jwt-decode";
import { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { News } from "../../types/news/news";
import "../NewsByCategory/NewsByCategory.css";
import { Categories } from "../../types/categories/categories";

export interface NewsByCategoryProps {
  news: News[] | { news: News[] };
  categories: Categories[];
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

export const NewsByCategoryC: React.FC<NewsByCategoryProps> = ({
  news,
  categories,
}) => {
  const { categoryId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [open, setOpen] = useState<boolean>(false);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const navigate = useNavigate();

  // Ensure news is an array
  const newsArray = Array.isArray(news)
    ? news
    : (news as { news: News[] }).news || [];

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredNews(newsArray);
    } else {
      // Filter news by categoryId matching the selectedCategory
      setFilteredNews(
        newsArray.filter((item) => {
          const category = categories.find(
            (cat) => cat.id === item.category_id
          );
          return category?.name === selectedCategory;
        })
      );
    }
  }, [selectedCategory, newsArray, categories]);

  const addView = (newsId: string) => {
    const model: AddViewModel = {
      user_id: id,
      news_id: newsId,
      finger_print_id: "",
      watch_id: 2,
    };
    addViews(model);
  };

  return (
    <>
      {filteredNews
        .filter((x) => x.category_id == String(categoryId))
        .map((news, index) => {
          return (
            <Fragment key={index}>
              <div className="newsByCategory">
                <div className="newsByCategoryBox">
                  <Image
                    className="newsByCategoryImage"
                    src={news.image}
                    onClick={() => {
                      addView(news.id);
                      navigate(`/news/${news.id}`);
                    }}
                  />
                  <div
                    className="newsByCategoryTitle"
                    onClick={() => {
                      addView(news.id);
                      navigate(`/news/${news.id}`);
                    }}
                  >
                    {news.title}
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}
    </>
  );
};
