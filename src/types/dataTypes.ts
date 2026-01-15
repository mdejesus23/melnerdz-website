export interface Project {
  title: string;
  pubDate: Date;
  author: string;
  image: {
    src: any;
    alt: string;
  };
  description: string;
  technology: string[];
  tags: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Blog {
  title: string;
  pubDate: Date;
  author: string;
  image: {
    src: any;
    alt: string;
  };
  description: string;
  technology?: string[];
  tags: string[];
  faqs?: FAQ[];
}

export interface Prayer {
  type: string;
  date: Date;
}

export interface Page<T = any> {
  /** result */
  data: T[];
  /** metadata */
  /** the count of the first item on the page, starting from 0 */
  start: number;
  /** the count of the last item on the page, starting from 0 */
  end: number;
  /** total number of results */
  total: number;
  /** the current page number, starting from 1 */
  currentPage: number;
  /** number of items per page (default: 10) */
  size: number;
  /** number of last page */
  lastPage: number;
  url: {
    /** url of the current page */
    current: string;
    /** url of the previous page (if there is one) */
    prev: string | undefined;
    /** url of the next page (if there is one) */
    next: string | undefined;
    /** url of the first page (if the current page is not the first page) */
    first: string | undefined;
    /** url of the last page (if the current page in not the last page) */
    last: string | undefined;
  };
}

export interface NavLink {
  title: string;
  url: string;
}

export interface SearchData {
  slug: string;
  title: string;
  description: string;
  date: string;
}
