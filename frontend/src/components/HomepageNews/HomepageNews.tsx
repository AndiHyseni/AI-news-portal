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
  const sortedHomepageNews = [...homenews].sort((a, b) => b.newsId - a.newsId);
  const { data } = useConfiguration();
  const navigate = useNavigate();
  const autoplay = useRef(Autoplay({ delay: 5000 }));

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
    <div>
      <>
        {data?.showFeatured && (
          <Carousel
            sx={{ maxWidth: 1500 }}
            mx="auto"
            loop
            withIndicators
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
          >
            {sortedHomepageNews.map((news, index) => (
              <Fragment key={index}>
                <Carousel.Slide>
                  <Image src={news.image} />
                  <div
                    onClick={() => {
                      addView(news.newsId);
                      navigate(`/news/${news.newsId}`);
                    }}
                    className="shadow"
                  >
                    <h1 className="title">{news.title}</h1>
                    <p className="subtitle">{news.subTitle}</p>
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
