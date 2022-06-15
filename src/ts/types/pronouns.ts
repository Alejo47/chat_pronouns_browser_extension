export interface GetPronounsResponse {
  [key: string]: PronounGroup;
}

export interface PronounGroup {
  name: string;
  subject: string;
  object: string;
  singular: boolean;
}
