import { useNavigate } from "react-router-dom";
import { Button, Image } from "@mantine/core";
import { News } from "../../types/news/news";
import "../MostWatchedNews/MostWatchedNews.css";
import { Carousel } from "@mantine/carousel";
import { AddViewModel } from "../../types/administration/administration";
import jwtDecode from "jwt-decode";
import { addViews } from "../../api/administration/administration";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";

export interface NewsProps {
  mostwatched: News[];
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

export const MostWatchedNews: React.FC<NewsProps> = ({ mostwatched }) => {
  const navigate = useNavigate();
  const { data } = useConfiguration();

  const sortedMostWatched = [...mostwatched].sort(
    (a, b) => b.numberOfClicks - a.numberOfClicks
  );

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
      {data?.showMostWached && (
        <div className="mostwatchedpage">
          <h1 className="mostwatched">Më të shikuarat</h1>
          <>
            <Carousel
              height={200}
              slideSize="33.333333%"
              slideGap="md"
              loop
              align="start"
              slidesToScroll={1}
            >
              {sortedMostWatched.map((news, index) => (
                <>
                  <Carousel.Slide>
                    <div key={index} className="mostwatcheddiv">
                      <Image src={news.image} className="mostwatchedimage" />
                      <div className="mostwatchedsite">
                        <h2 className="mostwatchedtitle">{news.title}</h2>
                        <Button
                          className="readMoreOnMostWatched"
                          onClick={() => {
                            addView(news.newsId);
                            navigate(`/news/${news.newsId}`);
                          }}
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  </Carousel.Slide>
                </>
              ))}
            </Carousel>
          </>
        </div>
      )}
    </>
  );
};
