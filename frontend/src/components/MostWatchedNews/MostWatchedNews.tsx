import { useNavigate } from "react-router-dom";
import { Button, Image } from "@mantine/core";
import { News } from "../../types/news/news";
import "../MostWatchedNews/MostWatchedNews.css";
import { Carousel } from "@mantine/carousel";
import { AddViewModel } from "../../types/administration/administration";
import jwtDecode from "jwt-decode";
import { addViews } from "../../api/administration/administration";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";

type NewsResponse = News[] | { news: News[] };

export interface NewsProps {
  mostwatched: NewsResponse;
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

export const MostWatchedNews: React.FC<NewsProps> = ({ mostwatched = [] }) => {
  const navigate = useNavigate();
  const { data } = useConfiguration();

  // Ensure mostwatched is an array and handle the data structure
  const newsArray: News[] = Array.isArray(mostwatched)
    ? mostwatched
    : (mostwatched as { news: News[] }).news || [];

  const sortedMostWatched = [...newsArray].sort(
    (a, b) => b.number_of_clicks - a.number_of_clicks
  );

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
      {data?.show_most_watched && (
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
              {sortedMostWatched.map((news: News, index: number) => (
                <Carousel.Slide key={index}>
                  <div className="mostwatcheddiv">
                    <Image
                      src={news.image}
                      className="mostwatchedimage"
                      height={300}
                    />
                    <div className="mostwatchedsite">
                      <h2 className="mostwatchedtitle">{news.title}</h2>
                      <Button
                        className="readMoreOnMostWatched"
                        onClick={() => {
                          addView(news.id);
                          navigate(`/news/${news.id}`);
                        }}
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </>
        </div>
      )}
    </>
  );
};
