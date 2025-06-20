export interface Story {
  id: number;
  title: string;
  points: number;
  user: string;
  time: number;
  time_ago: string;
  comments_count: number;
  type: "link";
  url: string;
  domain: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  level: number;
  user: string;
  time: number;
  time_ago: string;
  content: string;
  comments: Comment[];
}

export interface EchoscrapeResponse {
  title?: string;
  description?: string;
  themeColor?: string;
  og: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    imageWidth?: string;
    imageHeight?: string;
    url?: string;
    type?: string;
    siteName?: string;
  };
  twitter: {
    title?: string;
    description?: string;
    image?: string;
    site?: string;
    card?: string;
  };
  oembed: {
    version?: "1.0";
    type?: "photo" | "video" | "link" | "rich";
    title?: string;
    author_name?: string;
    author_url?: string;
    provider_name?: string;
    provider_url?: string;
    cache_age?: number;
    thumbnail_url?: string;
    thumbnail_width?: number;
    thumbnail_height?: number;
    html?: string;
    width?: number;
    height?: number;
    url?: string;
  };
}
