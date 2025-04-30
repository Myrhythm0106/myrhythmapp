
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { HeartPulse, Plus } from "lucide-react";
import { Link } from "react-router-dom";

// Sample data for the chart
const data = [
  { day: "Mon", level: 3 },
  { day: "Tue", level: 4 },
  { day: "Wed", level: 2 },
  { day: "Thu", level: 5 },
  { day: "Fri", level: 3 },
  { day: "Sat", level: 2 },
  { day: "Sun", level: 1 },
];

export function SymptomTracker() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Symptom Tracking</CardTitle>
        <Button size="sm" asChild>
          <Link to="/tracking/add">
            <Plus className="mr-1 h-4 w-4" />
            Log Symptoms
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border p-4">
          <div className="mb-2 flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-destructive" />
            <h3 className="font-medium">Headache Intensity</h3>
          </div>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="level"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Tracking headache intensity on a scale from 0-5
          </p>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/tracking">View All Tracking Data</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
