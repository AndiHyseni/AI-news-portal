import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
import jwtDecode from "jwt-decode";
import { Fragment, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import { AddViewModel } from "../../types/administration/administration";
import { News } from "../../types/news/news";
import "./HomepageNews.css";
import Autoplay from "embla-carousel-autoplay";

export interface NewsProps {
  homenews: News[];
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

export const HomepageNews: React.FC<NewsProps> = ({ homenews }) => {
  // Ensure homenews is an array and handle the data structure
  const newsArray: News[] = Array.isArray(homenews)
    ? homenews
    : (homenews as { news: News[] }).news || [];

  const sortedHomepageNews = [...newsArray].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const { data } = useConfiguration();
  const navigate = useNavigate();
  const autoplay = useRef(Autoplay({ delay: 5000 }));

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
    <div>
      <>
        {data?.show_featured && (
          <Carousel
            sx={{ maxWidth: 1500 }}
            mx="auto"
            loop
            withIndicators
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
          >
            {sortedHomepageNews.map((news: News, index: number) => (
              <Fragment key={index}>
                <Carousel.Slide>
                  <Image src={news.image} />
                  <div
                    onClick={() => {
                      addView(news.id);
                      navigate(`/news/${news.id}`);
                    }}
                    className="shadow"
                  >
                    <h1 className="title">{news.title}</h1>
                    <p className="subtitle">{news.sub_title}</p>
                  </div>
                </Carousel.Slide>
              </Fragment>
            ))}
          </Carousel>
        )}
      </>
    </div>
  );
};
