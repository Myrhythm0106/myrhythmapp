
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, ExternalLink } from "lucide-react";

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  fileUrl?: string;
  categories: string[];
  source: string;
  relevantFor: string[];
}

interface ResourceCardProps {
  resource: ResourceItem;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">{resource.title}</CardTitle>
          <div className="rounded-md bg-muted p-2 text-beacon-600">
            <Book className="h-5 w-5" />
          </div>
        </div>
        <CardDescription className="text-xs">{resource.source}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-sm">{resource.description}</p>
        <div className="mt-4 flex flex-wrap gap-1">
          {resource.categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3">
        <Button variant="outline" className="w-full" asChild>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Resource
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
