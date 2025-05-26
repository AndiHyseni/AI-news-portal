export interface Rapport {
  admins: number;
  angry: number;
  categories: number;
  happy: number;
  news: number;
  sad: number;
  saved: number;
  users: number;
  views: number;
}

export interface Users {
  email: string;
  role: string;
  id: string;
  name: string;
}

export interface Views {
  id: string;
  newsTitle: string;
  nrOfClicks: number;
}

export interface ViewsDetails {
  finger_print_id: string;
  news: string;
  news_id: number;
  user: string;
  user_id: string;
  watch_id: number;
  watched_on: string;
}

export interface AddViewModel {
  finger_print_id: string;
  news_id: string;
  user_id: string;
  watch_id: number;
}

export interface Reaction {
  angry: number;
  happy: number;
  news_id: string;
  sad: number;
  reaction: number;
  id: string;
  user_id: string;
}

export interface AddReaction {
  news_id: string;
  reaction: number;
  user_id: string;
}

export interface ReactionsDetails {
  id: string;
  news_id: string;
  user_id: string;
  reaction: number;
  news?: {
    id: string;
    title: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AddAdmin {
  role: string;
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface EditAdmin {
  email: string;
  role: string;
  userId: string;
  userName: string;
}

export interface Configuration {
  news_config_id: string;
  footer_logo: string;
  header_logo: string;
  show_featured: boolean;
  show_most_watched: boolean;
  show_related_news: boolean;
  show_chatbot: boolean;
}
