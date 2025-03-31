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
  userId: string;
  userName: string;
}

export interface Views {
  id: number;
  newsTitle: string;
  nrOfClicks: number;
}

export interface ViewsDetails {
  fingerPrintId: string;
  news: string;
  newsId: number;
  user: string;
  userId: string;
  watchId: number;
  watchedOn: string;
}

export interface AddViewModel {
  fingerPrintId: string;
  newsId: number;
  userId: string;
  watchId: number;
}

export interface Reaction {
  angry: number;
  happy: number;
  newsId: number;
  sad: number;
}

export interface AddReaction {
  newsId: number;
  reaction: number;
  userId: string;
}

export interface ReactionsDetails {
  news: string;
  newsId: number;
  reaction: number;
  reactionId: number;
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
    userName: string;
  };
  userId: string;
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
  newsConfigId: number;
  footerLogo: string;
  headerLogo: string;
  showFeatured: boolean;
  showMostWached: boolean;
}
