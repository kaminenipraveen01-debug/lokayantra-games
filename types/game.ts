export interface Game {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  gameUrl?: string;
  slug?: string;
  embedUrl?: string;
  youtubeEmbedUrl?: string;
  playCount?: number;
  likes?: number;
  dislikes?: number;
  rating?: number;
  createdAt?: { seconds: number; nanoseconds: number };
  updatedAt?: { seconds: number; nanoseconds: number };

  howToPlay?: string;
  tips?: string[];
  faqs?: { question: string; answer: string }[];
  platforms?: string[];
  controls?: string;
  developer?: string;
  releaseDate?: string;
  isTrending?: boolean;
  isNew?: boolean;
}