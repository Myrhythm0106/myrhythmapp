
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localServicesData } from "@/data/localServicesData";
import { MapPin, Phone, Globe, Search } from "lucide-react";

const LocalServices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Categories derived from service data
  const categories = Array.from(
    new Set(localServicesData.flatMap((service) => service.categories))
  ).sort();

  // Filter services based on search term and category
  const filteredServices = localServicesData.filter((service) => {
    const matchesSearch =
      searchTerm === "" ||
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === null || service.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Local Services"
        subtitle="Find support services in the Dallas area"
      />

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search local services..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredServices.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{service.name}</CardTitle>
                <CardDescription className="flex flex-wrap gap-1">
                  {service.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{service.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {service.address}, {service.city}, {service.state} {service.zip}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{service.phone}</span>
                </div>
                {service.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={service.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:no-underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${service.phone.replace(/\D/g, "")}`)}
                >
                  <Phone className="mr-1 h-4 w-4" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => 
                    window.open(
                      `https://maps.google.com/?q=${encodeURIComponent(
                        `${service.address}, ${service.city}, ${service.state} ${service.zip}`
                      )}`,
                      '_blank'
                    )
                  }
                >
                  <MapPin className="mr-1 h-4 w-4" />
                  Directions
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-dashed p-8 text-center">
          <p className="text-lg font-medium">No services found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory(null);
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default LocalServices;
