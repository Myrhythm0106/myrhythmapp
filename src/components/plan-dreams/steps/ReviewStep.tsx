
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Edit3, Heart } from "lucide-react";
import { DreamPlan } from "../PlanMyDreams";

interface ReviewStepProps {
  dreamPlan: DreamPlan;
  onSave: () => void;
  onEdit: (step: number) => void;
}

export function ReviewStep({ dreamPlan, onSave, onEdit }: ReviewStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
          <Heart className="h-8 w-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800">Review My Dream Plan</h2>
        <p className="text-gray-600 text-lg">
          Look over your plan and make sure everything feels right
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Big Dream */}
        <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">My Big Dream:</h3>
              <p className="text-xl text-purple-900">{dreamPlan.bigDream}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(1)}
              className="text-purple-600 hover:text-purple-700"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Smaller Parts and Daily Dos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">My Step by Step Plan:</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(2)}
              className="text-gray-600 hover:text-gray-700"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
          
          {dreamPlan.smallerParts.map((part, partIndex) => {
            const partDailyDos = dreamPlan.dailyDos.filter(dd => dd.smallerPartIndex === partIndex);
            
            return (
              <div key={partIndex} className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">
                  Smaller Part {partIndex + 1}: {part}
                </h4>
                
                <div className="space-y-2 ml-4">
                  {partDailyDos.map((dailyDo, doIndex) => (
                    <div key={doIndex} className="bg-white p-3 rounded border border-green-300">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                          <p className="font-medium text-gray-800">
                            What I'll do: {dailyDo.action}
                          </p>
                          <p className="text-gray-600 text-sm">
                            How I'll know: {dailyDo.measurement}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {dailyDo.timing}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => onEdit(3)}
              className="text-orange-600 hover:text-orange-700"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Edit Daily Dos
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-center pt-4">
        <Button 
          onClick={onSave}
          size="lg"
          className="text-xl px-12 py-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          <Heart className="h-6 w-6 mr-2" />
          Save My Dream Plan
        </Button>
      </div>
    </div>
  );
}
