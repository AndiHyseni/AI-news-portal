import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addViews } from "../../api/administration/administration";
import { AddViewModel } from "../../types/administration/administration";
import { News } from "../../types/news/news";
import { UserContext } from "../../contexts/UserContext";
import "./HomepageNews.css";
import Autoplay from "embla-carousel-autoplay";

type NewsResponse = News[] | { news: News[] };

export interface NewsProps {
  homenews: NewsResponse;
}

export const HomepageNews: React.FC<NewsProps> = ({ homenews }) => {
  // Ensure homenews is an array and handle the data structure
  const newsArray: News[] = Array.isArray(homenews)
    ? homenews
    : (homenews as { news: News[] }).news || [];

  // Filter to only include featured news
  const featuredNews = newsArray.filter((news) => news.is_featured);

  const sortedHomepageNews = [...featuredNews].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const navigate = useNavigate();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const [userContext] = useContext(UserContext);

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

  // Show a message if no featured news is available
  if (sortedHomepageNews.length === 0) {
    return (
      <div className="homepage-carousel-container">
        <div className="no-featured-news">
          No featured news available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="homepage-carousel-container">
        <Carousel
          sx={{ maxWidth: 1600 }}
          mx="auto"
          loop
          withIndicators
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
        >
          {sortedHomepageNews.map((news: News, index: number) => (
            <Carousel.Slide key={index} className="carousel-slide">
              <Image
                src={news.image}
                height={600}
                className="carousel-image"
                alt={news.title}
              />
              <div onClick={() => handleNewsClick(news.id)} className="shadow">
                <h1 className="title">{news.title}</h1>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </div>
  );
};
