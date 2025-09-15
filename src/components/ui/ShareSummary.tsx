import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface ShareSummaryProps {
  title?: string;
  data?: any;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  triggerContent?: React.ReactNode;
  userData?: {
    name?: string;
    routines?: Array<{ name: string; status: string }>;
    recentWins?: Array<{ text: string; date: string }>;
    notes?: Array<{ content: string; date: string }>;
    lastAssessment?: string;
  };
}

export function ShareSummary({ 
  title = "MyRhythm Summary",
  data,
  className = "",
  variant = "outline",
  triggerContent,
  userData 
}: ShareSummaryProps) {
  const summaryRef = React.useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: summaryRef,
    documentTitle: title,
  });

  const defaultData = {
    name: userData?.name || "User",
    routines: userData?.routines || (data?.recommendations ? 
      data.recommendations.map((rec: string, index: number) => ({ 
        name: rec, 
        status: "Recommended" 
      })) : [
        { name: "Morning routine", status: "Active" },
        { name: "Evening wind-down", status: "In progress" }
      ]),
    recentWins: userData?.recentWins || [
      { text: "Completed assessment", date: "Today" },
      { text: data?.primaryRhythm ? `Identified as ${data.primaryRhythm}` : "Building awareness", date: "Today" }
    ],
    notes: userData?.notes || [
      { content: data?.overallScore ? `Assessment score: ${data.overallScore}/100` : "Starting MyRhythm journey", date: "This week" }
    ],
    lastAssessment: userData?.lastAssessment || (data?.completedAt || "Today")
  };

  return (
    <div className="space-y-4">
      {/* Trigger Button when triggerContent is provided */}
      {triggerContent && (
        <Button onClick={() => handlePrint()} variant={variant} className={className}>
          {triggerContent}
        </Button>
      )}

      {/* Header section - only show when not in trigger mode */}
      {!triggerContent && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Share Summary</h3>
          <Button onClick={() => handlePrint()} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      )}

      {/* Printable content - always rendered but hidden when in trigger mode */}
      <div 
        ref={summaryRef} 
        className={`print:p-4 ${triggerContent ? 'hidden' : 'block'}`}
      >
        <style>{`
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
          }
        `}</style>
        
        <Card className="border-none shadow-none print:shadow-none">
          <CardHeader className="text-center">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
            <Badge variant="outline" className="mx-auto bg-amber-50 text-amber-800 border-amber-200">
              <FileText className="h-3 w-3 mr-1" />
              Not medical advice - Support tool only
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Current Routines</h3>
              <div className="space-y-2">
                {defaultData.routines.map((routine, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{routine.name}</span>
                    <Badge variant="outline">{routine.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Recent Wins</h3>
              <div className="space-y-2">
                {defaultData.recentWins.map((win, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p>{win.text}</p>
                      <p className="text-xs text-muted-foreground">{win.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Notes</h3>
              <div className="space-y-2">
                {defaultData.notes.map((note, index) => (
                  <div key={index} className="bg-muted/30 p-3 rounded-lg">
                    <p>{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{note.date}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="text-center text-sm text-muted-foreground">
              <p>Last assessment: {defaultData.lastAssessment}</p>
              <p className="mt-2">
                This summary is generated by MyRhythm, a support app for building 
                structure and connections. This is not medical advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}