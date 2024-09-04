export interface Project {
  title: string;
  pubDate: Date;
  author: string;
  image: {
    src: any;
    alt: string;
  };
  description: string;
  technology: Array<{
    src: any;
    alt: string;
  }>;
  tags: string[];
}
