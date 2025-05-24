
import { useState, useEffect } from 'react';

export interface SupportMember {
  id: string;
  name: string;
  permissions: {
    moodTracking: boolean;
    healthTracking: boolean;
  };
}

export interface SupportMessage {
  id: string;
  memberId: string;
  memberName: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function useSupportCircle() {
  // In a real app, these would be fetched from a database
  const [members, setMembers] = useState<SupportMember[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading members from localStorage/database
    const loadSupportCircle = () => {
      try {
        // Load members
        const storedMembers = localStorage.getItem("supportMembers");
        if (storedMembers) {
          setMembers(JSON.parse(storedMembers));
        } else {
          // Initial sample data
          const sampleMembers: SupportMember[] = [
            { 
              id: "1", 
              name: "Sarah Johnson", 
              permissions: { moodTracking: false, healthTracking: false }
            },
            { 
              id: "2", 
              name: "Michael Smith", 
              permissions: { moodTracking: true, healthTracking: false }
            },
            { 
              id: "3", 
              name: "Dr. Smith", 
              permissions: { moodTracking: true, healthTracking: true }
            },
            { 
              id: "4", 
              name: "Mom", 
              permissions: { moodTracking: false, healthTracking: false }
            },
          ];
          setMembers(sampleMembers);
          localStorage.setItem("supportMembers", JSON.stringify(sampleMembers));
        }

        // Load messages
        const storedMessages = localStorage.getItem("supportMessages");
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } else {
          // Initial sample data
          const sampleMessages: SupportMessage[] = [
            {
              id: "1",
              memberId: "1",
              memberName: "Sarah Johnson",
              message: "Hope you're feeling better today! Let me know if you need anything.",
              timestamp: new Date(),
              read: false
            },
            {
              id: "2",
              memberId: "3",
              memberName: "Dr. Smith",
              message: "I noticed your headaches have decreased this week. Great progress!",
              timestamp: new Date(Date.now() - 86400000), // 1 day ago
              read: true
            }
          ];
          setMessages(sampleMessages);
          localStorage.setItem("supportMessages", JSON.stringify(sampleMessages));
        }
      } catch (error) {
        console.error("Failed to load support circle data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSupportCircle();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("supportMembers", JSON.stringify(members));
      } catch (error) {
        console.error("Failed to save support members:", error);
      }
    }
  }, [members, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("supportMessages", JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save support messages:", error);
      }
    }
  }, [messages, isLoading]);

  const updateMemberPermissions = (
    memberId: string, 
    permissions: { moodTracking?: boolean; healthTracking?: boolean }
  ) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { 
              ...member, 
              permissions: { 
                ...member.permissions, 
                ...permissions
              } 
            } 
          : member
      )
    );
  };

  const addMessage = (memberId: string, message: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const newMessage: SupportMessage = {
      id: crypto.randomUUID(),
      memberId,
      memberName: member.name,
      message,
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => [newMessage, ...prev]);
    return newMessage;
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId 
          ? { ...message, read: true } 
          : message
      )
    );
  };

  const hasAccessToMoodTracking = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member?.permissions.moodTracking || false;
  };

  const hasAccessToHealthTracking = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member?.permissions.healthTracking || false;
  };

  return {
    members,
    messages,
    isLoading,
    updateMemberPermissions,
    addMessage,
    markMessageAsRead,
    hasAccessToMoodTracking,
    hasAccessToHealthTracking
  };
}
