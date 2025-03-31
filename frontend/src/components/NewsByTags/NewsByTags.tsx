import { Image } from "@mantine/core";
import jwtDecode from "jwt-decode";
import { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { useNewsByTags } from "../../hooks/useNews/useNewsByTags";
import { AddViewModel } from "../../types/administration/administration";
import { News } from "../../types/news/news";
import "../NewsByTags/NewsByTags.css";

export interface NewsByTagsProps {
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

export const NewsByTagsC: React.FC<NewsByTagsProps> = ({ news }) => {
  const { tags } = useParams();
  const { data: tagNews } = useNewsByTags(String(tags));
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
      {tagNews && tagNews.length > 0 ? (
        tagNews.map((news, index) => {
          return (
            <Fragment key={index}>
              <div className="newsByTags">
                <div className="newsByTagsBox">
                  <Image
                    className="newsByTagsImage"
                    src={news.image}
                    onClick={() => {
                      addView(news.newsId);
                      navigate(`/news/${news.newsId}`);
                    }}
                  />
                  <div
                    className="newsByTagsTitle"
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
        })
      ) : (
        <div>No news found for this tag.</div>
      )}
    </>
  );
};
