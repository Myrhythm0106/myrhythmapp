
import React from 'react';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';

export function MediaAttachment() {
  return (
    <FormItem>
      <FormLabel>Attachments (Optional)</FormLabel>
      <Button variant="outline" type="button" className="w-full">
        <Paperclip className="h-4 w-4 mr-2" />
        Add Photo or File
      </Button>
    </FormItem>
  );
}
