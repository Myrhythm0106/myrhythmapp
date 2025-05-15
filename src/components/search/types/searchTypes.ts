
// Define search result types
export interface SearchResult {
  id: string;
  title: string;
  category: string;
  description?: string;
  route: string;
  icon?: React.ReactNode;
}
