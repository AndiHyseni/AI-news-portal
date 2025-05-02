export interface Rapport {
  admins: number;
  angry: number;
  categories: number;
  happy: number;
  news: number;
  sad: number;
  saved: number;
  users: number;
  vIews: number;
}

export interface Users {
  email: string;
  role: string;
  user_id: string;
  username: string;
}

export interface Views {
  id: number;
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
}

export interface AddReaction {
  news_id: string;
  reaction: number;
  user_id: string;
}

export interface ReactionsDetails {
  news: string;
  news_id: number;
  reaction: number;
  reaction_id: number;
  user: {
    accessFailedCount: number;
    concurrencyStamp: string;
    email: string;
    emailConfirmed: Boolean;
    id: string;
    lockoutEnabled: Boolean;
    lockoutEnd: string;
    normalizedEmail: string;
    normalizedUserName: string;
    passwordHash: string;
    phoneNumber: string;
    phoneNumberConfirmed: Boolean;
    securityStamp: string;
    twoFactorEnabled: Boolean;
    username: string;
  };
  user_id: string;
}

export interface AddAdmin {
  role: string;
  userId: string;
  userName: string;
  confirmPassword: string;
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
}
