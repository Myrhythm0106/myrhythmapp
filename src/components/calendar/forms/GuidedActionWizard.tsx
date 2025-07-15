
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Zap, Heart } from "lucide-react";

interface GuidedActionWizardProps {
  onSuccess: (actionData: any) => void;
  onUpgradeClick: () => void;
  preFilledData?: {
    date?: string;
    time?: string;
  };
}

export function GuidedActionWizard({ 
  onSuccess, 
  onUpgradeClick,
  preFilledData 
}: GuidedActionWizardProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: preFilledData?.date || '',
    time: preFilledData?.time || '',
    duration: '30',
    difficulty: '1',
    category: 'personal',
    energyLevel: '2'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(formData);
  };

  const categories = [
    { value: 'health', label: 'Health & Wellness', icon: Heart },
    { value: 'personal', label: 'Personal Growth', icon: Zap },
    { value: 'work', label: 'Work & Focus', icon: Target },
    { value: 'family', label: 'Family & Social', icon: Heart },
    { value: 'rest', label: 'Rest & Recovery', icon: Clock }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Action Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="What would you like to accomplish?"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add any details or notes..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Easy - Low energy needed</SelectItem>
                <SelectItem value="2">Moderate - Some focus required</SelectItem>
                <SelectItem value="3">Challenging - High focus needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Category</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.value}
                  type="button"
                  variant={formData.category === category.value ? "default" : "outline"}
                  onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                  className="justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="energyLevel">Required Energy Level</Label>
          <Select value={formData.energyLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, energyLevel: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Low - Minimal energy required</SelectItem>
              <SelectItem value="2">Medium - Moderate energy needed</SelectItem>
              <SelectItem value="3">High - Peak energy required</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" className="flex-1">
          <Target className="h-4 w-4 mr-2" />
          Create Action
        </Button>
        <Button type="button" variant="outline" onClick={onUpgradeClick}>
          Get Premium Features
        </Button>
      </div>
    </form>
  );
}
