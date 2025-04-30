
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SymptomTracker } from "@/components/dashboard/SymptomTracker";
import { SymptomLogForm } from "@/components/tracking/SymptomLogForm";
import { SymptomHistory } from "@/components/tracking/SymptomHistory";
import { SymptomInsights } from "@/components/tracking/SymptomInsights";
import { InspirationSection } from "@/components/tracking/InspirationSection";
import { Plus, List, LineChart, Smile } from "lucide-react";

const SymptomTracking = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Symptom Tracking" 
        subtitle="Monitor symptoms and identify patterns over time"
      >
        <Button onClick={() => setActiveTab("log")}>
          <Plus className="mr-1 h-4 w-4" />
          Log Symptoms
        </Button>
      </PageHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="log">Log Symptoms</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <SymptomTracker />
        </TabsContent>
        
        <TabsContent value="log">
          <Card>
            <CardContent className="pt-6">
              <SymptomLogForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <SymptomHistory />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardContent className="pt-6">
              <SymptomInsights />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inspiration">
          <InspirationSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SymptomTracking;
