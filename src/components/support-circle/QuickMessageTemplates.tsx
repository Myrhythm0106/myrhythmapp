import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Sparkles, Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QuickMessageTemplates() {
  const { toast } = useToast();

  const templates = [
    {
      icon: Heart,
      text: 'Thinking of you 💙',
      message: 'Just wanted to let you know I\'m thinking of you today. You\'re doing great!',
      color: 'text-red-500'
    },
    {
      icon: Sparkles,
      text: 'Great job!',
      message: 'Amazing work on completing your daily actions! So proud of you! 🎉',
      color: 'text-yellow-500'
    },
    {
      icon: MessageCircle,
      text: 'Quick check-in',
      message: 'Hey! How are you feeling today? Let me know if you need anything.',
      color: 'text-blue-500'
    },
    {
      icon: Coffee,
      text: 'Need support?',
      message: 'I\'m here if you need to talk or just need some company. No pressure!',
      color: 'text-green-500'
    }
  ];

  const handleSendMessage = (template: typeof templates[0]) => {
    // In a real implementation, this would send the message
    toast({
      title: "Message sent!",
      description: template.text,
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium mb-3">Quick Messages</p>
      {templates.map((template, index) => {
        const Icon = template.icon;
        return (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="w-full justify-start text-left hover:bg-primary/5"
            onClick={() => handleSendMessage(template)}
          >
            <Icon className={`w-4 h-4 mr-2 flex-shrink-0 ${template.color}`} />
            <span className="text-sm">{template.text}</span>
          </Button>
        );
      })}
    </div>
  );
}
