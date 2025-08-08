import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MemoryCapture } from './MemoryCapture';
import { MemoryCard } from './MemoryCard';
import { useMemoryBank, MemoryEntry } from '@/hooks/useMemoryBank';
import { Plus, Search, Filter, Heart, Calendar, Camera, Mic, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MemoryBank() {
  const [showCapture, setShowCapture] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { memories, loading, updateMemory, refetch } = useMemoryBank();

  const categories = [
    { id: 'general', label: 'General', count: 0 },
    { id: 'family', label: 'Family', count: 0 },
    { id: 'achievement', label: 'Achievement', count: 0 },
    { id: 'medical', label: 'Medical', count: 0 },
    { id: 'milestone', label: 'Milestone', count: 0 },
  ];

  const types = [
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'photo', label: 'Photos', icon: Camera },
    { id: 'voice', label: 'Voice', icon: Mic },
  ];

  // Update category counts
  categories.forEach(category => {
    category.count = memories.filter(memory => memory.category === category.id).length;
  });

  // Filter memories
  const filteredMemories = memories.filter(memory => {
    const matchesSearch = !searchQuery || 
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || memory.category === selectedCategory;
    const matchesType = !selectedType || memory.memory_type === selectedType;
    const matchesFavorites = !showFavoritesOnly || memory.is_favorite;

    return matchesSearch && matchesCategory && matchesType && matchesFavorites;
  });

  const handleToggleFavorite = async (memory: MemoryEntry) => {
    await updateMemory(memory.id, { is_favorite: !memory.is_favorite });
  };

  const handleShare = (memory: MemoryEntry) => {
    // TODO: Implement sharing functionality
    console.log('Share memory:', memory);
  };

  const handleView = (memory: MemoryEntry) => {
    // TODO: Implement memory detail view
    console.log('View memory:', memory);
  };

  if (showCapture) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Memory Bank</h1>
          <Button
            variant="outline"
            onClick={() => setShowCapture(false)}
          >
            Back to Memories
          </Button>
        </div>
        <MemoryCapture onMemoryCreated={() => {
          setShowCapture(false);
          refetch();
        }} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Memory Bank</h1>
          <p className="text-muted-foreground">
            Capture and preserve your precious moments
          </p>
        </div>
        <Button
          onClick={() => setShowCapture(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Capture Memory
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{memories.length}</div>
            <div className="text-sm text-muted-foreground">Total Memories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">
              {memories.filter(m => m.is_favorite).length}
            </div>
            <div className="text-sm text-muted-foreground">Favorites</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {memories.filter(m => m.memory_type === 'photo').length}
            </div>
            <div className="text-sm text-muted-foreground">Photos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {memories.filter(m => m.memory_type === 'voice').length}
            </div>
            <div className="text-sm text-muted-foreground">Voice Notes</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="h-8"
            >
              <Heart className="w-3 h-3 mr-1" />
              Favorites
            </Button>

            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="cursor-pointer px-3 py-1.5 text-xs capitalize hover:bg-muted"
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              >
                {category.label} ({category.count})
              </Badge>
            ))}

            {types.map((type) => {
              const Icon = type.icon;
              const count = memories.filter(m => m.memory_type === type.id).length;
              return (
                <Badge
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 text-xs hover:bg-muted"
                  onClick={() => setSelectedType(
                    selectedType === type.id ? null : type.id
                  )}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {type.label} ({count})
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Memories Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading memories...</p>
        </div>
      ) : filteredMemories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {memories.length === 0 ? 'No memories yet' : 'No matching memories'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {memories.length === 0 
                ? 'Start building your memory collection with your first capture'
                : 'Try adjusting your search or filters'
              }
            </p>
            {memories.length === 0 && (
              <Button
                onClick={() => setShowCapture(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Capture Your First Memory
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onView={handleView}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />
          ))}
        </div>
      )}
    </div>
  );
}