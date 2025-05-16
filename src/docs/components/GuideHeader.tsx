
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export interface GuideHeaderProps {
  printRef: React.RefObject<HTMLDivElement>;
}

export function GuideHeader({ printRef }: GuideHeaderProps) {
  const handlePrint = useReactToPrint({
    documentTitle: "MyRhythm User Guide",
    // According to the react-to-print library, we should use the 'printRef' property
    contentRef: printRef,
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
