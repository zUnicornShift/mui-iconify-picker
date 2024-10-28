import axios from "axios";

export interface SearchResult {
  icons: string[];
  total: number;
}

export const search = async (
  baseUrl: string | URL,
  query: string,
  limit: number,
  start: number,
  prefixes?: string,
  category?: string,
  prefix?: string,
): Promise<SearchResult> => {
  const url = new URL("/search", baseUrl);
  const response = await axios.get(url.toString(), {
    params: {
      query,
      limit,
      start,
      prefixes,
      category,
      prefix,
    },
  });

  const data = response.data;

  return {
    icons: data?.icons || [],
    total: data?.total || 0,
  };
};
