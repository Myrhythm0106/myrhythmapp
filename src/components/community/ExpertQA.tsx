
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QASession {
  id: string;
  expert: {
    name: string;
    title: string;
    avatar?: string;
  };
  topic: string;
  date: string;
  time: string;
  status: "upcoming" | "past" | "live";
}

export function ExpertQA() {
  const sessions: QASession[] = [
    {
      id: "1",
      expert: {
        name: "Dr. Sarah Chen",
        title: "Neurologist, Dallas Medical Center",
        avatar: undefined,
      },
      topic: "Understanding Post-TBI Headaches",
      date: "May 22, 2023",
      time: "2:00 PM",
      status: "upcoming",
    },
    {
      id: "2",
      expert: {
        name: "Dr. Michael Rivera",
        title: "Rehabilitation Specialist",
        avatar: undefined,
      },
      topic: "Cognitive Exercises for TBI Recovery",
      date: "May 25, 2023",
      time: "4:00 PM",
      status: "upcoming",
    },
    {
      id: "3",
      expert: {
        name: "Dr. Lisa Johnson",
        title: "Psychiatrist, Mental Health Institute",
        avatar: undefined,
      },
      topic: "Managing Depression After Brain Injury",
      date: "May 15, 2023",
      time: "3:00 PM",
      status: "past",
    }
  ];

  const getStatusLabel = (status: QASession["status"]) => {
    switch (status) {
      case "upcoming":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Upcoming</span>;
      case "live":
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Live Now</span>;
      case "past":
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">Past</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Expert Q&A Sessions</h3>
        <p className="text-sm text-muted-foreground">
          Join live sessions with healthcare professionals and ask questions
        </p>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={session.expert.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {session.expert.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{session.expert.name}</h4>
                    {getStatusLabel(session.status)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {session.expert.title}
                  </div>
                  
                  <div className="font-medium mt-2">{session.topic}</div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{session.date} at {session.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                {session.status === "past" ? (
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    View Discussion
                  </Button>
                ) : session.status === "live" ? (
                  <Button>
                    Join Now
                  </Button>
                ) : (
                  <Button variant="outline">
                    Set Reminder
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
