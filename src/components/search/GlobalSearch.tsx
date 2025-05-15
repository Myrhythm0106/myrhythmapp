
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
  Search as SearchIcon,
  User,
  MapPin,
  FileText,
  CheckSquare,
  Sparkles,
  GamepadIcon,
  BookOpen
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
  {
    id: "profile",
    title: "My Profile",
    category: "Navigation",
    description: "View and edit your profile information",
    route: "/profile",
    icon: <User className="h-4 w-4 mr-2" />
  },
  {
    id: "local-services",
    title: "Local Services",
    category: "Navigation",
    description: "Find support services in your area",
    route: "/local-services",
    icon: <MapPin className="h-4 w-4 mr-2" />
  },
  {
    id: "resources",
    title: "Resources",
    category: "Navigation",
    description: "Access helpful resources and information",
    route: "/resources",
    icon: <FileText className="h-4 w-4 mr-2" />
  },
  {
    id: "gratitude",
    title: "Gratitude Journal",
    category: "Navigation", 
    description: "Record and track gratitude entries",
    route: "/gratitude",
    icon: <Sparkles className="h-4 w-4 mr-2" />
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
    icon: <CheckSquare className="h-4 w-4 mr-2" />
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
  {
    id: "gratitude-journal",
    title: "Gratitude Journal",
    category: "Features",
    description: "Record daily gratitude entries",
    route: "/gratitude",
    icon: <Sparkles className="h-4 w-4 mr-2" />
  },
  {
    id: "memory-match-game",
    title: "Memory Match Game",
    category: "Features",
    description: "Play the memory matching card game",
    route: "/brain-games",
    icon: <GamepadIcon className="h-4 w-4 mr-2" />
  },
  {
    id: "storyboard-view",
    title: "Calendar Storyboard",
    category: "Features",
    description: "View your calendar as a visual storyboard",
    route: "/calendar?view=storyboard",
    icon: <Calendar className="h-4 w-4 mr-2" />
  },
  {
    id: "medication-reminders",
    title: "Medication Reminders",
    category: "Features",
    description: "Set and manage medication reminders",
    route: "/calendar",
    icon: <HeartPulse className="h-4 w-4 mr-2" />
  },
  {
    id: "support-circle",
    title: "My Support Circle",
    category: "Features",
    description: "Connect with your personal support network",
    route: "/personal-community",
    icon: <Heart className="h-4 w-4 mr-2" />
  },
];

// Resources and information
const resourcesItems: SearchResult[] = [
  {
    id: "user-guides",
    title: "User Guides",
    category: "Resources",
    description: "Helpful guides for using MyRhythm",
    route: "/useful-info?tab=guides",
    icon: <BookOpen className="h-4 w-4 mr-2" />
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    category: "Resources",
    description: "Answers to common questions",
    route: "/useful-info?tab=faq",
    icon: <Info className="h-4 w-4 mr-2" />
  },
  {
    id: "tutorial-videos",
    title: "Tutorial Videos",
    category: "Resources",
    description: "Watch tutorial videos for MyRhythm features",
    route: "/useful-info?tab=videos",
    icon: <BookOpen className="h-4 w-4 mr-2" />
  },
  {
    id: "terms-policies",
    title: "Terms & Privacy",
    category: "Resources",
    description: "View terms of service and privacy policies",
    route: "/useful-info?tab=terms",
    icon: <FileText className="h-4 w-4 mr-2" />
  },
  {
    id: "local-support-services",
    title: "Local Support Services",
    category: "Resources",
    description: "Find local support services in the Dallas area",
    route: "/local-services",
    icon: <MapPin className="h-4 w-4 mr-2" />
  },
  {
    id: "emergency-resources",
    title: "Emergency Resources",
    category: "Resources",
    description: "Access emergency contact information and resources",
    route: "/dashboard",
    icon: <HeartPulse className="h-4 w-4 mr-2" />
  },
];

// Sample search data - in a real app, this would be dynamic
const allSearchResults: SearchResult[] = [
  ...navigationItems,
  ...featuresItems,
  ...resourcesItems,
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

          {/* Resources Group */}
          <CommandGroup heading="Resources">
            {searchResults
              .filter(item => item.category === "Resources")
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
