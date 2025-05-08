
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
}

const TestimonialCard = ({ quote, author }: TestimonialCardProps) => {
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-6">
        <div className="mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="inline-block h-4 w-4 text-primary fill-primary" />
          ))}
        </div>
        <p className="italic mb-4">"{quote}"</p>
        <p className="font-semibold">— {author}</p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
