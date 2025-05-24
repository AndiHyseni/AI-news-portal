declare module "node-summarizer" {
  export interface SummaryResult {
    summary?: string;
    sentence_list?: string[];
    nouns_and_adjactive_map?: Map<string, string[]>;
    [key: string]: any;
  }

  export class SummarizerManager {
    constructor(text: string, numSentences: number);
    getSummaryByRank(): Promise<string | SummaryResult>;
  }
}
