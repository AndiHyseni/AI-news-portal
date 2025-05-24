export enum NEWS {
  GET_NEWS = "News",
  GET_NEWSID = "news",
}

export enum CREATE_NEWS {
  CREATE_NEWS = "addnews",
}

export enum SAVED_NEWS {
  SAVED_NEWS = "addSavedNews",
  GET_SAVED = "getSaved",
  DELETE_SAVED = "deleteSaved",
}

export enum TAGS {
  TAGS = "tags",
}

export enum GENERATE_SUMMARIES {
  GENERATE = "generate-summaries",
}

export enum GENERATE_TAGS {
  GENERATE = "generate-tags",
}

export enum NEWS_API {
  SEARCH = "newsapi/search",
  TOP_HEADLINES = "newsapi/top-headlines",
  IMPORT = "newsapi/import",
  GENERATE_SUMMARIES = "newsapi/generate-summaries",
}
