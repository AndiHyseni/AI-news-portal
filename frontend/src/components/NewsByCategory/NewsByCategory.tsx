import { Image } from "@mantine/core";
import jwtDecode from "jwt-decode";
import { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { News } from "../../types/news/news";
import "../NewsByCategory/NewsByCategory.css";

export interface NewsByCategoryProps {
  news: News[];
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

export const NewsByCategoryC: React.FC<NewsByCategoryProps> = ({ news }) => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const addView = (newsId: number) => {
    const model: AddViewModel = {
      userId: id,
      newsId: newsId,
      fingerPrintId: "",
      watchId: 2,
    };
    addViews(model);
  };

  return (
    <>
      {news
        .filter((x) => x.categoryId == Number(categoryId))
        .map((news, index) => {
          return (
            <Fragment key={index}>
              <div className="newsByCategory">
                <div className="newsByCategoryBox">
                  <Image
                    className="newsByCategoryImage"
                    src={news.image}
                    onClick={() => {
                      addView(news.newsId);
                      navigate(`/news/${news.newsId}`);
                    }}
                  />
                  <div
                    className="newsByCategoryTitle"
                    onClick={() => {
                      addView(news.newsId);
                      navigate(`/news/${news.newsId}`);
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
