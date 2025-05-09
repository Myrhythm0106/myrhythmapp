
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-all overflow-hidden">
      <CardHeader className="pb-2">
        <div className="mb-3">{icon}</div>
        <CardTitle className="text-2xl font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Feature;
