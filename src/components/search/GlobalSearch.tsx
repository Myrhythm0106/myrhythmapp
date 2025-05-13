import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  Calendar, 
  Home, 
  Users, 
  Heart, 
  Brain, 
  HeartPulse, 
  Info, 
  Search as SearchIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

// Define search result types
interface SearchResult {
  id: string;
  title: string;
  category: string;
  description?: string;
  route: string;
  icon?: React.ReactNode;
}

// Main navigation items
const navigationItems: SearchResult[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    category: "Navigation",
    description: "Go to your dashboard",
    route: "/dashboard",
    icon: <Home className="h-4 w-4 mr-2" />
  },
  {
    id: "calendar",
    title: "Calendar",
    category: "Navigation",
    description: "View your calendar and events",
    route: "/calendar",
    icon: <Calendar className="h-4 w-4 mr-2" />
  },
  {
    id: "tracking",
    title: "Health Tracking",
    category: "Navigation",
    description: "Track your health and symptoms",
    route: "/tracking",
    icon: <HeartPulse className="h-4 w-4 mr-2" />
  },
  {
    id: "community",
    title: "Community",
    category: "Navigation",
    description: "Connect with your community",
    route: "/community",
    icon: <Users className="h-4 w-4 mr-2" />
  },
  {
    id: "personal-community",
    title: "Family Support Circle",
    category: "Navigation",
    description: "Connect with family and caregivers",
    route: "/personal-community",
    icon: <Heart className="h-4 w-4 mr-2" />
  },
  {
    id: "useful-info",
    title: "Useful Information",
    category: "Navigation",
    description: "Find useful resources and guides",
    route: "/useful-info",
    icon: <Info className="h-4 w-4 mr-2" />
  },
];

// Features and functionalities
const featuresItems: SearchResult[] = [
  {
    id: "brain-games",
    title: "Brain Games",
    category: "Features",
    description: "Cognitive exercises and games",
    route: "/brain-games",
    icon: <Brain className="h-4 w-4 mr-2" />
  },
  {
    id: "goals-view",
    title: "Goals & Tasks",
    category: "Features",
    description: "Manage your goals and tasks",
    route: "/calendar?view=goals",
    icon: <Calendar className="h-4 w-4 mr-2" />
  },
  {
    id: "symptom-tracking",
    title: "Symptom Tracking",
    category: "Features",
    description: "Track your symptoms and progress",
    route: "/tracking",
    icon: <HeartPulse className="h-4 w-4 mr-2" />
  },
  {
    id: "community-posts",
    title: "Community Posts",
    category: "Features",
    description: "View and create community posts",
    route: "/community?tab=discussions",
    icon: <Users className="h-4 w-4 mr-2" />
  },
];

// Sample search data - in a real app, this would be dynamic
const allSearchResults: SearchResult[] = [
  ...navigationItems,
  ...featuresItems,
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>(allSearchResults);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    
    if (!value) {
      setSearchResults(allSearchResults);
      return;
    }
    
    // Filter results based on search query
    const filtered = allSearchResults.filter(item => 
      item.title.toLowerCase().includes(value.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(value.toLowerCase())) ||
      item.category.toLowerCase().includes(value.toLowerCase())
    );
    
    setSearchResults(filtered);
  }, []);

  // Navigate to selected item
  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    navigate(result.route);
    toast({
      title: `Navigating to ${result.title}`,
      description: result.description
    });
  };

  // Toggle search dialog
  const toggleSearch = useCallback(() => {
    setOpen(prev => !prev);
    setSearchQuery("");
    setSearchResults(allSearchResults);
  }, []);

  // Keyboard shortcut: CTRL + K or Command + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleSearch}
              className="h-9 w-9 md:h-10 md:w-10"
              aria-label="Search"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search (Ctrl+K)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search anything..." 
          value={searchQuery}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {/* Navigation Group */}
          <CommandGroup heading="Navigation">
            {searchResults
              .filter(item => item.category === "Navigation")
              .map(item => (
                <CommandItem 
                  key={item.id} 
                  onSelect={() => handleSelect(item)}
                  className="flex items-center cursor-pointer"
                >
                  {item.icon}
                  <div>
                    <div>{item.title}</div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </CommandItem>
              ))
            }
          </CommandGroup>
          
          {/* Features Group */}
          <CommandGroup heading="Features">
            {searchResults
              .filter(item => item.category === "Features")
              .map(item => (
                <CommandItem 
                  key={item.id} 
                  onSelect={() => handleSelect(item)}
                  className="flex items-center cursor-pointer"
                >
                  {item.icon}
                  <div>
                    <div>{item.title}</div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </CommandItem>
              ))
            }
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
