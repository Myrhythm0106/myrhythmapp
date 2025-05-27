
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, Trash2, Check } from "lucide-react";
import { DreamPlan } from "../PlanMyDreams";

interface StepThreeProps {
  bigDream: string;
  smallerParts: string[];
  onComplete: (dailyDos: DreamPlan['dailyDos']) => void;
  initialDailyDos?: DreamPlan['dailyDos'];
}

export function StepThree({ bigDream, smallerParts, onComplete, initialDailyDos = [] }: StepThreeProps) {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [dailyDos, setDailyDos] = useState<DreamPlan['dailyDos']>(initialDailyDos);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const currentPart = smallerParts[currentPartIndex];
  const currentPartDailyDos = dailyDos.filter(dd => dd.smallerPartIndex === currentPartIndex);

  const addDailyDo = () => {
    const newDailyDo = {
      smallerPartIndex: currentPartIndex,
      action: "",
      measurement: "",
      timing: ""
    };
    setDailyDos([...dailyDos, newDailyDo]);
    setEditingIndex(currentPartDailyDos.length);
  };

  const updateDailyDo = (index: number, field: keyof DreamPlan['dailyDos'][0], value: string) => {
    const dailyDoIndex = dailyDos.findIndex((dd, i) => dd.smallerPartIndex === currentPartIndex && 
      dailyDos.filter(d => d.smallerPartIndex === currentPartIndex).indexOf(dd) === index);
    
    if (dailyDoIndex !== -1) {
      const updated = [...dailyDos];
      updated[dailyDoIndex] = { ...updated[dailyDoIndex], [field]: value };
      setDailyDos(updated);
    }
  };

  const removeDailyDo = (index: number) => {
    const dailyDoIndex = dailyDos.findIndex((dd, i) => dd.smallerPartIndex === currentPartIndex && 
      dailyDos.filter(d => d.smallerPartIndex === currentPartIndex).indexOf(dd) === index);
    
    if (dailyDoIndex !== -1) {
      setDailyDos(dailyDos.filter((_, i) => i !== dailyDoIndex));
    }
  };

  const saveAndFinishDailyDo = (index: number) => {
    const dailyDo = currentPartDailyDos[index];
    if (dailyDo.action.trim() && dailyDo.measurement.trim()) {
      setEditingIndex(null);
    }
  };

  const handleNext = () => {
    if (currentPartIndex < smallerParts.length - 1) {
      setCurrentPartIndex(currentPartIndex + 1);
    } else {
      onComplete(dailyDos);
    }
  };

  const hasValidDailyDos = currentPartDailyDos.some(dd => dd.action.trim() && dd.measurement.trim());
  const isLastPart = currentPartIndex === smallerParts.length - 1;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
          <Calendar className="h-8 w-8 text-white" />
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800">My Big Dream:</h3>
          <p className="text-xl text-purple-900 mt-1">{bigDream}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <h3 className="text-lg font-semibold text-green-800">Now, let's plan for:</h3>
          <p className="text-xl text-green-900 mt-1">{currentPart}</p>
          <p className="text-sm text-green-600 mt-1">
            Part {currentPartIndex + 1} of {smallerParts.length}
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        {currentPartDailyDos.map((dailyDo, index) => (
          <div key={index} className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-orange-800">Daily Do #{index + 1}</h4>
              <div className="flex gap-2">
                {editingIndex === index && (
                  <Button
                    onClick={() => saveAndFinishDailyDo(index)}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    disabled={!dailyDo.action.trim() || !dailyDo.measurement.trim()}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save & Finish
                  </Button>
                )}
                {currentPartDailyDos.length > 1 && editingIndex !== index && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeDailyDo(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {editingIndex === index ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-orange-700">What I'll do:</label>
                  <Input
                    value={dailyDo.action}
                    onChange={(e) => updateDailyDo(index, 'action', e.target.value)}
                    placeholder="walk 5 steps, read for 10 minutes, cut one carrot"
                    className="mt-1 border-orange-300 focus:border-orange-400"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-orange-700">How I'll know I did it:</label>
                  <Input
                    value={dailyDo.measurement}
                    onChange={(e) => updateDailyDo(index, 'measurement', e.target.value)}
                    placeholder="I walked 5 steps, I read for 10 minutes, The carrot is chopped"
                    className="mt-1 border-orange-300 focus:border-orange-400"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-orange-700">When:</label>
                  <Select value={dailyDo.timing} onValueChange={(value) => updateDailyDo(index, 'timing', value)}>
                    <SelectTrigger className="mt-1 border-orange-300 focus:border-orange-400">
                      <SelectValue placeholder="Choose when you'll do this" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="this-week">This week</SelectItem>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-2 cursor-pointer" onClick={() => setEditingIndex(index)}>
                <p className="text-orange-900"><strong>What I'll do:</strong> {dailyDo.action || "Click to edit"}</p>
                <p className="text-orange-900"><strong>How I'll know:</strong> {dailyDo.measurement || "Click to edit"}</p>
                <p className="text-orange-700"><strong>When:</strong> {dailyDo.timing || "Click to edit"}</p>
              </div>
            )}
          </div>
        ))}
        
        <Button
          onClick={addDailyDo}
          variant="outline"
          className="w-full border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 p-4"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add a Daily Do
        </Button>
        
        <div className="text-sm text-gray-500 space-y-1 text-center">
          <p>Make this super simple – something you can do today</p>
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          onClick={handleNext}
          disabled={!hasValidDailyDos}
          size="lg"
          className="text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          {isLastPart ? "Finish Planning My Dream" : "Next Smaller Part"}
        </Button>
      </div>
    </div>
  );
}
