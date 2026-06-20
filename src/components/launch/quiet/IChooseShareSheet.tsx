import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Mail, Copy, Download, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { generateAndShareIChoose } from './IChooseShareCard';

interface Props {
  open: boolean;
  onClose: () => void;
  statement: string;
}

function buildShareText(statement: string): string {
  return `Today I Choose… ${statement}\n\n— sent from MyRhythm  #IChoose`;
}

export function IChooseShareSheet({ open, onClose, statement }: Props) {
  const { fixtures } = useDemoOrLive();
  const circle = (fixtures.supportCircle ?? []).filter((m) => m.status === 'active');

  const sendToSupporter = async (name: string) => {
    await generateAndShareIChoose(statement, name);
    toast.success(`Sent to ${name}`, {
      description: "They'll know you're showing up today.",
    });
    onClose();
  };

  const shareAnywhere = async () => {
    await generateAndShareIChoose(statement);
    toast.success('Ready to share', { description: 'Pick where to send it.' });
    onClose();
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent('Today I Choose…');
    const body = encodeURIComponent(buildShareText(statement));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast.success('Email opened', { description: 'Your statement is ready to send.' });
    onClose();
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText(statement));
      toast.success('Copied', { description: 'Paste it anywhere you like.' });
    } catch {
      toast.error("Couldn't copy", { description: 'Try selecting the text and copying.' });
    }
    onClose();
  };

  const justSave = async () => {
    await generateAndShareIChoose(statement);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-brand-orange-500" />
            Share today's choice
          </SheetTitle>
          <SheetDescription>
            Send it to someone who matters. Nothing is shared until you choose.
          </SheetDescription>
        </SheetHeader>

        {/* Support Circle */}
        <section className="mt-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-brain-health-600" />
            <h3 className="text-sm font-semibold text-brain-health-800">Your Support Circle</h3>
          </div>
          {circle.length === 0 ? (
            <p className="text-sm text-brain-health-500 py-2">
              No one in your circle yet. Use “Someone else” below.
            </p>
          ) : (
            <ul className="space-y-2">
              {circle.map((m) => (
                <li key={m.name}>
                  <Button
                    variant="outline"
                    onClick={() => sendToSupporter(m.name)}
                    className="w-full justify-between min-h-[56px] text-left"
                    aria-label={`Send today's choice to ${m.name}`}
                  >
                    <span>
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-brain-health-500 ml-2">{m.relationship}</span>
                    </span>
                    <span className="text-xs text-brand-orange-600">Send</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Someone else */}
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-brain-health-800 mb-2">Someone else</h3>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              onClick={shareAnywhere}
              className="w-full justify-start min-h-[56px]"
              aria-label="Share via message, WhatsApp, or anywhere"
            >
              <MessageCircle className="h-4 w-4 mr-2 text-brand-teal-600" />
              Message, WhatsApp, anywhere
            </Button>
            <Button
              variant="outline"
              onClick={shareByEmail}
              className="w-full justify-start min-h-[56px]"
              aria-label="Share by email"
            >
              <Mail className="h-4 w-4 mr-2 text-brain-health-600" />
              Email
            </Button>
            <Button
              variant="outline"
              onClick={copyText}
              className="w-full justify-start min-h-[56px]"
              aria-label="Copy today's statement to clipboard"
            >
              <Copy className="h-4 w-4 mr-2 text-brain-health-600" />
              Copy the words
            </Button>
          </div>
        </section>

        {/* Just save */}
        <section className="mt-6 mb-2">
          <Button
            variant="ghost"
            onClick={justSave}
            className="w-full justify-start min-h-[56px] text-brain-health-700"
            aria-label="Just save the image to my device"
          >
            <Download className="h-4 w-4 mr-2" />
            Just save the image
          </Button>
        </section>
      </SheetContent>
    </Sheet>
  );
}
