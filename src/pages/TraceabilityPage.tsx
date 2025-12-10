import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Share2, RefreshCw, Plus, Sparkles, Users } from 'lucide-react';
import { PageLayout } from '@/components/shared/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTraceability, TraceabilityNode, GoalItem, PriorityItem, TaskItem, VisionItem } from '@/contexts/TraceabilityContext';
import TraceabilityTree from '@/components/traceability/TraceabilityTree';
import LinkingModal from '@/components/traceability/LinkingModal';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { toast } from 'sonner';

const TraceabilityPage = () => {
  const navigate = useNavigate();
  const { 
    vision, 
    goals, 
    priorities, 
    tasks,
    isLoading,
    refreshData 
  } = useTraceability();
  
  const [selectedNode, setSelectedNode] = useState<TraceabilityNode | null>(null);
  const [isLinkingOpen, setIsLinkingOpen] = useState(false);
  const [linkingTarget, setLinkingTarget] = useState<{
    type: 'goal' | 'priority' | 'task';
    id: string;
    title: string;
    currentLinkId?: string | null;
  } | null>(null);

  const handleNodeClick = (node: TraceabilityNode) => {
    setSelectedNode(node);
  };

  const handleLinkClick = (node: TraceabilityNode) => {
    if (node.type === 'vision') return;
    
    let currentLinkId: string | null = null;
    
    if (node.type === 'goal') {
      currentLinkId = (node.item as GoalItem).annual_priority_id;
    } else if (node.type === 'priority') {
      currentLinkId = (node.item as PriorityItem).goal_id;
    } else if (node.type === 'task') {
      currentLinkId = (node.item as TaskItem).priority_id || (node.item as TaskItem).goal_id;
    }

    const nodeType = node.type as 'goal' | 'priority' | 'task';
    const nodeTitle = (node.item as GoalItem | PriorityItem | TaskItem).title;
    
    setLinkingTarget({
      type: nodeType,
      id: (node.item as any).id,
      title: nodeTitle,
      currentLinkId
    });
    setIsLinkingOpen(true);
  };

  const handleRefresh = async () => {
    await refreshData();
    toast.success('Data refreshed');
  };

  // Calculate stats
  const linkedGoals = goals.filter(g => g.annual_priority_id).length;
  const linkedPriorities = priorities.filter(p => p.goal_id).length;
  const linkedTasks = tasks.filter(t => t.priority_id || t.goal_id).length;

  return (
    <PageLayout 
      title="Traceability" 
      description="Connect your vision to daily actions"
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{vision ? 1 : 0}</p>
                  <p className="text-xs text-muted-foreground">Vision</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{linkedGoals}/{goals.length}</p>
                  <p className="text-xs text-muted-foreground">Goals Linked</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{linkedPriorities}/{priorities.length}</p>
                  <p className="text-xs text-muted-foreground">Priorities Linked</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Target className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{linkedTasks}/{tasks.length}</p>
                  <p className="text-xs text-muted-foreground">Tasks Linked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/calendar')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Items
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/support-circle')}>
            <Share2 className="w-4 h-4 mr-2" />
            Share with Circle
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tree" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tree">Hierarchy View</TabsTrigger>
            <TabsTrigger value="unlinked">Unlinked Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tree">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Your Traceability Tree
                </CardTitle>
                <CardDescription>
                  Click any item to view details. Use the link button to connect items.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TraceabilityTree 
                  onNodeClick={handleNodeClick}
                  showLinkButtons={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="unlinked">
            <Card>
              <CardHeader>
                <CardTitle>Unlinked Items</CardTitle>
                <CardDescription>
                  These items aren't connected to the hierarchy yet. Link them for full traceability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TraceabilityTree 
                  onNodeClick={(node) => handleLinkClick(node)}
                  showLinkButtons={true}
                  compact={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Node Detail Sheet */}
        <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
          <SheetContent side="right" className="w-full sm:max-w-md">
            {selectedNode && (
              <>
                <SheetHeader>
                  <SheetTitle>
                    {selectedNode.type === 'vision' && (selectedNode.item as VisionItem).yearly_theme}
                    {selectedNode.type !== 'vision' && (selectedNode.item as GoalItem | PriorityItem | TaskItem).title}
                  </SheetTitle>
                  <SheetDescription>
                    {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)} Details
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* Add detail fields based on type */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      handleLinkClick(selectedNode);
                      setSelectedNode(null);
                    }}
                    disabled={selectedNode.type === 'vision'}
                  >
                    Link to Parent
                  </Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Linking Modal */}
        {linkingTarget && (
          <LinkingModal
            open={isLinkingOpen}
            onOpenChange={setIsLinkingOpen}
            itemType={linkingTarget.type}
            itemId={linkingTarget.id}
            itemTitle={linkingTarget.title}
            currentLinkId={linkingTarget.currentLinkId}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default TraceabilityPage;
