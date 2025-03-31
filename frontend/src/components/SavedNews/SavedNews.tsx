import { Fragment } from "react";
import { SavedNewsPage } from "../../types/news/news";
import "../../pages/SavedNews/SavedNews.css";
import { Button, Image } from "@mantine/core";
import { Trash } from "tabler-icons-react";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { AddViewModel } from "../../types/administration/administration";
import { addViews } from "../../api/administration/administration";

export interface SavedNewsPageProps {
  savedNews: SavedNewsPage[];
  onDeleteSavedNews: (news: SavedNewsPage) => void;
}

export const SavedNewsC: React.FC<SavedNewsPageProps> = ({
  savedNews,
  onDeleteSavedNews,
}) => {
  var token: any =
    localStorage.getItem("jwt") != null
      ? jwtDecode(localStorage.getItem("jwt")!)
      : null;

  var role: string =
    token != null
      ? token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      : "";

  var id: string =
    token != null
      ? token[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]
      : "";

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
      {savedNews?.map((news, index) => (
        <Fragment key={index}>
          <div className="savedNews">
            <div className="savedNewsBox">
              <Image src={news.image} />
              <h1 className="savedNewsTitle">{news.title}</h1>
            </div>
            <div className="savedNewsButtons">
              {role == "Registered" && (
                <Button
                  component={Link}
                  to={`/news/${news.newsId}`}
                  onClick={() => addView(news.newsId)}
                >
                  Read more
                </Button>
              )}
              {role == "Admin" && (
                <Button component={Link} to={`/news/details/${news.newsId}`}>
                  Read more
                </Button>
              )}
              <Button
                color="red"
                onClick={() => {
                  onDeleteSavedNews(news);
                }}
              >
                <Trash size={20} strokeWidth={2} color={"white"} />
                Delete
              </Button>
            </div>
          </div>
        </Fragment>
      ))}
    </>
  );
};
