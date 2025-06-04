
import React from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FocusAreaInfo } from "@/utils/rhythmAnalysis";

interface PersonalizedFocusCardProps {
  focusInfo: FocusAreaInfo;
}

export function PersonalizedFocusCard({ focusInfo }: PersonalizedFocusCardProps) {
  return (
    <div className="space-y-4 text-left bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-green-600" />
        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
          Your Personalized Focus
        </Badge>
      </div>
      
      <h3 className={`text-xl font-semibold bg-gradient-to-r ${focusInfo.gradient} bg-clip-text text-transparent`}>
        {focusInfo.title}
      </h3>
      
      <p className="text-gray-700 leading-relaxed">
        {focusInfo.description}
      </p>
      
      <div className="text-sm text-gray-600">
        <strong>Phase:</strong> {focusInfo.phase}
      </div>
      
      <div className="bg-white/50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Your focus will include:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {focusInfo.keyFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
