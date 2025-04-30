
import React from "react";
import { CommunityPost } from "./CommunityPost";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  // In a real app, we would fetch results based on the query
  // For now, let's simulate results with sample data
  
  // Sample search results
  const results = [
    {
      id: "search-1",
      user: {
        name: "Taylor Williams",
        avatar: undefined,
        initials: "TW"
      },
      topic: "TBI Support",
      title: "Resources for memory exercises",
      content: "I've been struggling with memory issues since my TBI last year. Has anyone tried any specific memory exercises or apps that have helped? Looking for recommendations.",
      comments: 7,
      time: "1 week ago"
    }
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Search Results for "{query}"</h3>
      
      {results.length > 0 ? (
        results.map(result => (
          <CommunityPost 
            key={result.id}
            id={result.id}
            user={result.user}
            topic={result.topic}
            title={result.title}
            content={result.content}
            comments={result.comments}
            time={result.time}
          />
        ))
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <p>No results found for "{query}"</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try different keywords or check your spelling
          </p>
        </div>
      )}
    </div>
  );
}
