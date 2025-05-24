declare module "natural" {
  export class WordTokenizer {
    tokenize(text: string): string[];
  }

  export class SentenceTokenizer {
    constructor(language?: string, options?: object);
    tokenize(text: string): string[];
  }

  export class TfIdf {
    addDocument(text: string): void;
    listTerms(documentIndex: number): Array<{ term: string; tfidf: number }>;
  }
}

declare module "stopword" {
  export function removeStopwords(tokens: string[]): string[];
}
