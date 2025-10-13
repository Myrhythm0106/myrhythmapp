import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Stethoscope, Calendar, Clock, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface MedicalContext {
  provider: string;
  nextAppointment?: string;
  medications: string[];
  allergies: string[];
}

export function MedicalContextHelper() {
  const [context, setContext] = useState<MedicalContext>({
    provider: '',
    medications: [],
    allergies: []
  });
  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  const addMedication = () => {
    if (newMedication.trim()) {
      setContext({
        ...context,
        medications: [...context.medications, newMedication.trim()]
      });
      setNewMedication('');
      toast.success('Medication added to your profile');
    }
  };

  const removeMedication = (index: number) => {
    setContext({
      ...context,
      medications: context.medications.filter((_, i) => i !== index)
    });
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setContext({
        ...context,
        allergies: [...context.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
      toast.success('Allergy added to your profile');
    }
  };

  const removeAllergy = (index: number) => {
    setContext({
      ...context,
      allergies: context.allergies.filter((_, i) => i !== index)
    });
  };

  return (
    <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-900">
          <Stethoscope className="h-5 w-5" />
          Medical Context Quick Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="provider">Primary Care Provider</Label>
          <Input
            id="provider"
            placeholder="Dr. Smith's office"
            value={context.provider}
            onChange={(e) => setContext({ ...context, provider: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment">Next Appointment</Label>
          <Input
            id="appointment"
            type="datetime-local"
            value={context.nextAppointment || ''}
            onChange={(e) => setContext({ ...context, nextAppointment: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Current Medications</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add medication..."
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMedication()}
            />
            <Button size="sm" onClick={addMedication}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {context.medications.map((med, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {med}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeMedication(index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Allergies</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add allergy..."
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
            />
            <Button size="sm" onClick={addAllergy}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {context.allergies.map((allergy, index) => (
              <Badge key={index} variant="destructive" className="gap-1">
                {allergy}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeAllergy(index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
          <p className="text-xs text-teal-800">
            💡 This information will be available during voice recordings with medical staff, 
            helping you remember important details during appointments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
