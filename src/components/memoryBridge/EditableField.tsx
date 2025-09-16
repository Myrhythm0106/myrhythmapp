import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, X, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

interface EditableFieldProps {
  value: string | number | Date | null;
  onSave: (value: any) => void;
  type?: 'text' | 'textarea' | 'select' | 'date' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  className?: string;
}

export function EditableField({ 
  value, 
  onSave, 
  type = 'text', 
  options = [], 
  placeholder = 'Click to edit...',
  label,
  className = ''
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const displayValue = (): React.ReactNode => {
    if (!value) return placeholder;
    
    if (type === 'date' && value instanceof Date) {
      return format(value, 'MMM dd, yyyy');
    }
    
    if (type === 'date' && typeof value === 'string') {
      return format(new Date(value), 'MMM dd, yyyy');
    }
    
    if (type === 'select' && options.length > 0) {
      const option = options.find(opt => opt.value === String(value));
      return option?.label || String(value);
    }
    
    return String(value);
  };

  if (!isEditing) {
    return (
      <div 
        className={`group cursor-pointer hover:bg-muted/50 p-2 rounded-md border border-transparent hover:border-border transition-colors ${className}`}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex items-center gap-2">
          <span className={value ? 'text-foreground' : 'text-muted-foreground italic'}>
            {displayValue()}
          </span>
          <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
        </div>
        {label && <div className="text-xs text-muted-foreground mt-1">{label}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <div className="text-xs font-medium text-muted-foreground">{label}</div>}
      
      <div className="flex items-center gap-2">
        {type === 'textarea' && (
          <Textarea
            value={String(editValue || '')}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="flex-1"
            autoFocus
          />
        )}
        
        {type === 'text' && (
          <Input
            value={String(editValue || '')}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        )}
        
        {type === 'number' && (
          <Input
            type="number"
            value={String(editValue || '')}
            onChange={(e) => setEditValue(Number(e.target.value))}
            placeholder={placeholder}
            className="flex-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        )}
        
        {type === 'select' && (
          <Select value={String(editValue || '')} onValueChange={setEditValue}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {type === 'date' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {editValue ? (
                  format(
                    editValue instanceof Date ? editValue : new Date(editValue as string), 
                    'PPP'
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={editValue ? (
                  editValue instanceof Date ? editValue : new Date(editValue as string)
                ) : undefined}
                onSelect={(date) => setEditValue(date?.toISOString().split('T')[0] || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
        
        <div className="flex gap-1">
          <Button size="sm" onClick={handleSave}>
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}