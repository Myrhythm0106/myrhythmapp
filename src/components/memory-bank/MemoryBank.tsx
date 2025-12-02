import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedMemoryCapture } from './EnhancedMemoryCapture';
import { MemoryCard } from './MemoryCard';
import { useMemoryBank, MemoryEntry } from '@/hooks/useMemoryBank';
import { 
  Plus, 
  Search, 
  Heart, 
  Camera, 
  Mic, 
  FileText, 
  Sparkles,
  ExternalLink,
  Trophy,
  Stethoscope,
  Target,
  Lightbulb,
  MessageSquare,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MemoryBank() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';
  
  const [showCapture, setShowCapture] = useState(false);
  const [captureCategory, setCaptureCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  const navigate = useNavigate();
  const { memories, loading, updateMemory, refetch } = useMemoryBank();

  const categories = [
    { id: 'general', label: 'General', icon: FileText, color: 'text-gray-500' },
    { id: 'achievement', label: 'Achievement', icon: Trophy, color: 'text-amber-500' },
    { id: 'medical', label: 'Medical', icon: Stethoscope, color: 'text-rose-500' },
    { id: 'milestone', label: 'Milestone', icon: Target, color: 'text-emerald-500' },
    { id: 'idea', label: 'Idea', icon: Lightbulb, color: 'text-yellow-500' },
    { id: 'thought', label: 'Thought', icon: MessageSquare, color: 'text-blue-500' },
    { id: 'gratitude', label: 'Gratitude', icon: Heart, color: 'text-pink-500' },
  ];

  const types = [
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'photo', label: 'Photos', icon: Camera },
    { id: 'voice', label: 'Voice', icon: Mic },
  ];

  // Filter memories based on active tab and filters
  const getFilteredMemories = () => {
    let filtered = memories;
    
    // Tab-based filtering
    if (activeTab === 'gratitude') {
      filtered = filtered.filter(m => m.category === 'gratitude' || m.tags.includes('gratitude'));
    }
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(memory => 
        memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }
    
    // Type filter
    if (selectedType) {
      filtered = filtered.filter(m => m.memory_type === selectedType);
    }
    
    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(m => m.is_favorite);
    }
    
    return filtered;
  };

  const filteredMemories = getFilteredMemories();
  const gratitudeCount = memories.filter(m => m.category === 'gratitude' || m.tags.includes('gratitude')).length;

  const handleToggleFavorite = async (memory: MemoryEntry) => {
    await updateMemory(memory.id, { is_favorite: !memory.is_favorite });
  };

  const handleShare = (memory: MemoryEntry) => {
    console.log('Share memory:', memory);
  };

  const handleView = (memory: MemoryEntry) => {
    console.log('View memory:', memory);
  };

  const startCapture = (category?: string) => {
    setCaptureCategory(category);
    setShowCapture(true);
  };

  if (showCapture) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Capture Memory</h1>
          <Button variant="outline" onClick={() => setShowCapture(false)}>
            Back to Memories
          </Button>
        </div>
        <EnhancedMemoryCapture 
          onMemoryCreated={() => {
            setShowCapture(false);
            refetch();
          }}
          initialCategory={captureCategory as any}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Memory & Gratitude Vault
          </h1>
          <p className="text-muted-foreground">
            Capture moments, strengthen neural pathways through gratitude
          </p>
        </div>
        <Button onClick={() => startCapture()} className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Capture Memory
        </Button>
      </div>

      {/* Quick Access: Memory Bridge Recordings */}
      <Card className="bg-gradient-to-r from-memory-emerald-50 to-brain-health-50 border-memory-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-memory-emerald-500 to-brain-health-500 flex items-center justify-center">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Memory Bridge Recordings</h3>
                <p className="text-sm text-muted-foreground">Access your recorded conversations & extracted actions</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/memory-bridge')}
              className="gap-2"
            >
              View Recordings
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for All / Gratitude */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all" className="gap-2">
            <Camera className="h-4 w-4" />
            All Memories ({memories.length})
          </TabsTrigger>
          <TabsTrigger value="gratitude" className="gap-2">
            <Heart className="h-4 w-4" />
            Gratitude ({gratitudeCount})
          </TabsTrigger>
        </TabsList>

        {/* Gratitude Tab Header */}
        {activeTab === 'gratitude' && (
          <Card className="mt-4 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-pink-800">Strengthen Neural Pathways</h3>
                  <p className="text-sm text-pink-700 mt-1">
                    Evidence-based gratitude practice with deep 'why' reflection helps build lasting positive neural connections.
                  </p>
                  <Button 
                    onClick={() => startCapture('gratitude')}
                    className="mt-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    size="sm"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Add Gratitude Entry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <TabsContent value="all" className="mt-4 space-y-4">
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
                <div className="text-2xl font-bold text-rose-500">
                  {memories.filter(m => m.is_favorite).length}
                </div>
                <div className="text-sm text-muted-foreground">Favorites</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-pink-500">{gratitudeCount}</div>
                <div className="text-sm text-muted-foreground">Gratitude</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-500">
                  {memories.filter(m => m.category === 'achievement').length}
                </div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Capture Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.slice(1, 5).map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant="outline"
                  onClick={() => startCapture(category.id)}
                  className="h-auto py-3 flex-col gap-1"
                >
                  <Icon className={cn("h-5 w-5", category.color)} />
                  <span className="text-xs">{category.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

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

                {categories.map((category) => {
                  const count = memories.filter(m => m.category === category.id).length;
                  const Icon = category.icon;
                  return (
                    <Badge
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1.5 text-xs capitalize hover:bg-muted gap-1"
                      onClick={() => setSelectedCategory(
                        selectedCategory === category.id ? null : category.id
                      )}
                    >
                      <Icon className={cn("w-3 h-3", category.color)} />
                      {category.label} ({count})
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gratitude" className="mt-4">
          {/* Gratitude content is filtered automatically */}
        </TabsContent>
      </Tabs>

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
              {activeTab === 'gratitude' ? (
                <Heart className="w-8 h-8 text-pink-400" />
              ) : (
                <Camera className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {activeTab === 'gratitude' 
                ? 'No gratitude entries yet' 
                : memories.length === 0 
                  ? 'No memories yet' 
                  : 'No matching memories'
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === 'gratitude'
                ? 'Start your gratitude practice to strengthen neural pathways'
                : memories.length === 0 
                  ? 'Start building your memory collection with your first capture'
                  : 'Try adjusting your search or filters'
              }
            </p>
            <Button
              onClick={() => startCapture(activeTab === 'gratitude' ? 'gratitude' : undefined)}
              className={activeTab === 'gratitude' 
                ? "bg-gradient-to-r from-pink-500 to-rose-500"
                : "bg-gradient-primary"
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'gratitude' ? 'Add Gratitude Entry' : 'Capture Your First Memory'}
            </Button>
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
