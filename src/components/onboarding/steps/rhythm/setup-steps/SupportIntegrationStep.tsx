
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Users, Plus, X, Shield } from "lucide-react";

interface SupportIntegrationStepProps {
  onComplete: (data: any) => void;
  assessmentResult: any;
}

export function SupportIntegrationStep({ onComplete, assessmentResult }: SupportIntegrationStepProps) {
  const [supportData, setSupportData] = useState({
    supportCircle: [] as Array<{
      name: string;
      relationship: string;
      email: string;
      accessLevel: string;
    }>,
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    sharingPreferences: {
      calendar: false,
      goals: false,
      mood: false,
      symptoms: false
    },
    communityEngagement: "moderate"
  });

  const addSupportPerson = () => {
    setSupportData(prev => ({
      ...prev,
      supportCircle: [...prev.supportCircle, {
        name: "",
        relationship: "",
        email: "",
        accessLevel: "basic"
      }]
    }));
  };

  const updateSupportPerson = (index: number, field: string, value: string) => {
    setSupportData(prev => ({
      ...prev,
      supportCircle: prev.supportCircle.map((person, i) => 
        i === index ? { ...person, [field]: value } : person
      )
    }));
  };

  const removeSupportPerson = (index: number) => {
    setSupportData(prev => ({
      ...prev,
      supportCircle: prev.supportCircle.filter((_, i) => i !== index)
    }));
  };

  const updateSharingPreference = (key: string, checked: boolean) => {
    setSupportData(prev => ({
      ...prev,
      sharingPreferences: { ...prev.sharingPreferences, [key]: checked }
    }));
  };

  const handleContinue = () => {
    onComplete(supportData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Support Circle & Privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emergency Contact */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Emergency Contact (Optional but Recommended)</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="emergency-name">Name</Label>
              <Input
                id="emergency-name"
                value={supportData.emergencyContact.name}
                onChange={(e) => setSupportData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                }))}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label htmlFor="emergency-phone">Phone</Label>
              <Input
                id="emergency-phone"
                value={supportData.emergencyContact.phone}
                onChange={(e) => setSupportData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                }))}
                placeholder="Phone number"
              />
            </div>
            <div>
              <Label htmlFor="emergency-relationship">Relationship</Label>
              <Select 
                value={supportData.emergencyContact.relationship} 
                onValueChange={(value) => setSupportData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, relationship: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse/Partner</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="caregiver">Caregiver</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Support Circle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Support Circle (Optional)</Label>
            <Button variant="outline" size="sm" onClick={addSupportPerson}>
              <Plus className="h-4 w-4 mr-2" />
              Add Person
            </Button>
          </div>
          
          {supportData.supportCircle.length === 0 ? (
            <div className="text-center p-6 border-2 border-dashed rounded-lg">
              <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No support circle members yet</p>
              <p className="text-sm text-muted-foreground">Add family, friends, or caregivers who support your journey</p>
            </div>
          ) : (
            <div className="space-y-3">
              {supportData.supportCircle.map((person, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 flex-1">
                      <div>
                        <Label htmlFor={`person-name-${index}`}>Name</Label>
                        <Input
                          id={`person-name-${index}`}
                          value={person.name}
                          onChange={(e) => updateSupportPerson(index, 'name', e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`person-relationship-${index}`}>Relationship</Label>
                        <Select value={person.relationship} onValueChange={(value) => updateSupportPerson(index, 'relationship', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spouse">Spouse/Partner</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="friend">Friend</SelectItem>
                            <SelectItem value="caregiver">Caregiver</SelectItem>
                            <SelectItem value="therapist">Therapist</SelectItem>
                            <SelectItem value="doctor">Doctor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`person-email-${index}`}>Email</Label>
                        <Input
                          id={`person-email-${index}`}
                          type="email"
                          value={person.email}
                          onChange={(e) => updateSupportPerson(index, 'email', e.target.value)}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`person-access-${index}`}>Access Level</Label>
                        <Select value={person.accessLevel} onValueChange={(value) => updateSupportPerson(index, 'accessLevel', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic - General updates</SelectItem>
                            <SelectItem value="moderate">Moderate - Progress & calendar</SelectItem>
                            <SelectItem value="full">Full - All health information</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeSupportPerson(index)} className="ml-2">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Preferences */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            What information can be shared with your support circle?
          </Label>
          <div className="space-y-2 pl-6">
            {[
              { key: "calendar", label: "Calendar events and appointments" },
              { key: "goals", label: "Goals and progress updates" },
              { key: "mood", label: "Mood and energy tracking" },
              { key: "symptoms", label: "Symptom logs and health data" }
            ].map((item) => (
              <div key={item.key} className="flex items-center space-x-2">
                <Checkbox 
                  id={item.key}
                  checked={supportData.sharingPreferences[item.key as keyof typeof supportData.sharingPreferences]}
                  onCheckedChange={(checked) => updateSharingPreference(item.key, checked as boolean)}
                />
                <Label htmlFor={item.key}>{item.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleContinue} className="w-full">
            Continue to Dashboard Layout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
