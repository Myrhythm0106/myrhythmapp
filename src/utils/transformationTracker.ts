
export interface TransformationTask {
  id: string;
  component: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'testing';
  priority: 'high' | 'medium' | 'low';
  dependencies?: string[];
  estimatedHours: number;
  notes?: string;
}

export const TRANSFORMATION_ROADMAP: TransformationTask[] = [
  // Phase 1: Dashboard Transformation (Current Focus)
  {
    id: 'dash-001',
    component: 'Dashboard Layout',
    description: 'Transform main dashboard with Memory1st containers and brain-health colors',
    status: 'in-progress',
    priority: 'high',
    estimatedHours: 8,
  },
  {
    id: 'dash-002', 
    component: 'Dashboard Cards',
    description: 'Wrap all dashboard cards with MemoryEffectsContainer',
    status: 'pending',
    priority: 'high',
    dependencies: ['dash-001'],
    estimatedHours: 6,
  },
  {
    id: 'dash-003',
    component: 'Dashboard Header',
    description: 'Apply brain-health typography and add memory nodes',
    status: 'pending',
    priority: 'medium',
    estimatedHours: 3,
  },
  
  // Phase 2: Navigation & Layout
  {
    id: 'nav-001',
    component: 'Main Navigation',
    description: 'Transform sidebar with brain-health theme and memory trails',
    status: 'pending',
    priority: 'high',
    estimatedHours: 10,
  },
  {
    id: 'nav-002',
    component: 'Header Navigation',
    description: 'Update header with Memory1st branding and neural pathways',
    status: 'pending',
    priority: 'medium',
    estimatedHours: 4,
  },
  
  // Phase 3: Core Feature Pages
  {
    id: 'cal-001',
    component: 'Calendar Page',
    description: 'Transform calendar with memory preservation timeline approach',
    status: 'pending',
    priority: 'high',
    estimatedHours: 12,
  },
  {
    id: 'mood-001',
    component: 'Mood Tracking',
    description: 'Apply brain-health colors and add memory effects to mood tracking',
    status: 'pending',
    priority: 'high',
    estimatedHours: 8,
  },
  {
    id: 'games-001',
    component: 'Brain Games',
    description: 'Enhance with neural network visuals and memory themes',
    status: 'pending',
    priority: 'medium',
    estimatedHours: 10,
  },
  
  // Phase 4: Forms & Interactions
  {
    id: 'forms-001',
    component: 'Form Components',
    description: 'Update all forms with brain-friendly design and reduced cognitive load',
    status: 'pending',
    priority: 'medium',
    estimatedHours: 8,
  },
  {
    id: 'buttons-001',
    component: 'Button System',
    description: 'Apply memory-pulse animations and brain-health colors to all buttons',
    status: 'pending',
    priority: 'low',
    estimatedHours: 4,
  }
];

export function getTasksByStatus(status: TransformationTask['status']) {
  return TRANSFORMATION_ROADMAP.filter(task => task.status === status);
}

export function updateTaskStatus(taskId: string, newStatus: TransformationTask['status']) {
  const task = TRANSFORMATION_ROADMAP.find(t => t.id === taskId);
  if (task) {
    task.status = newStatus;
  }
}

export function getCompletionPercentage(): number {
  const completed = getTasksByStatus('completed').length;
  const total = TRANSFORMATION_ROADMAP.length;
  return Math.round((completed / total) * 100);
}
