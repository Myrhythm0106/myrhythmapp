
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export interface GuideHeaderProps {
  printRef: React.RefObject<HTMLDivElement>;
}

export function GuideHeader({ printRef }: GuideHeaderProps) {
  const handlePrint = useReactToPrint({
    documentTitle: "MyRhythm User Guide",
    // The correct property is just passing a function that returns the ref's current value
    content: () => printRef.current,
  });

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-foreground">MyRhythm User Guide</h1>
      <Button onClick={handlePrint} className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span>Export as PDF</span>
      </Button>
    </div>
  );
}
