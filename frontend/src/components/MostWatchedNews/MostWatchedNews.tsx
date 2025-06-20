import { useNavigate } from "react-router-dom";
import { Button, Image } from "@mantine/core";
import { News } from "../../types/news/news";
import "../MostWatchedNews/MostWatchedNews.css";
import { Carousel } from "@mantine/carousel";
import { AddViewModel } from "../../types/administration/administration";
import { addViews } from "../../api/administration/administration";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

type NewsResponse = News[] | { news: News[] };

export interface NewsProps {
  mostwatched: NewsResponse;
}

export const MostWatchedNews: React.FC<NewsProps> = ({ mostwatched = [] }) => {
  const navigate = useNavigate();
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }));
  const [userContext] = useContext(UserContext);

  // Ensure mostwatched is an array and handle the data structure
  const newsArray: News[] = Array.isArray(mostwatched)
    ? mostwatched
    : (mostwatched as { news: News[] }).news || [];

  // Sort by most watched and limit to 10 items
  const sortedMostWatched = [...newsArray]
    .sort((a, b) => b.number_of_clicks - a.number_of_clicks)
    .slice(0, 10);

  const addView = (newsId: string) => {
    const model: AddViewModel = {
      user_id: userContext.userId || "",
      news_id: newsId,
      finger_print_id: "",
      watch_id: 2,
    };
    addViews(model);
  };

  const handleNewsClick = (newsId: string) => {
    addView(newsId);
    navigate(`/news/${newsId}`);
  };

  return (
    <div className="mostwatched-carousel">
      <Carousel
        height={400}
        slideSize="33.333333%"
        slideGap="md"
        loop
        align="start"
        slidesToScroll={1}
        withControls
        controlsOffset="xs"
        controlSize={30}
        dragFree
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        styles={{
          control: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "#26145c",
            border: "none",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          },
        }}
        breakpoints={[
          { maxWidth: 1200, slideSize: "50%" },
          { maxWidth: 768, slideSize: "100%", slideGap: "md" },
        ]}
      >
        {sortedMostWatched.map((news: News, index: number) => (
          <Carousel.Slide key={index}>
            <div className="mostwatcheddiv">
              <div className="mostwatched-image-container">
                <Image
                  src={news.image}
                  className="mostwatchedimage"
                  height={180}
                  alt={news.title}
                />
              </div>
              <div className="mostwatchedsite">
                <h2 className="mostwatchedtitle" title={news.title}>
                  {news.title}
                </h2>
                <Button
                  className="readMoreOnMostWatched"
                  onClick={() => handleNewsClick(news.id)}
                >
                  Read More
                </Button>
              </div>
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
};
