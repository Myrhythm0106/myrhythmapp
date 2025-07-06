
import React from "react";
import { FeatureCard } from "./FeatureCard";
import { 
  Heart, Calendar, Target, Users, Brain, Gamepad2, 
  MessageSquare, Users2, Bell, StickyNote, Music,
  HelpCircle, Settings, BookOpen, Smile
} from "lucide-react";

export function FeatureCategories() {
  return (
    <div className="space-y-8">
      {/* Essential Daily Features */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-800">Essential Daily</h2>
          <span className="text-sm text-gray-500">Your core MyRhythm experience</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <FeatureCard
            title="Personal Empowerment Hub"
            description="Daily #IChoose affirmations, victory celebrations, and LEAP progress tracking"
            icon={<Music className="h-5 w-5 text-purple-600" />}
            status="available"
            category="essential"
            path="/personal-empowerment"
            metric={{ value: "Day 7", label: "LEAP Journey" }}
          />
          <FeatureCard
            title="Mood Harmony"
            description="Track your emotional wellness with Memory1st principles and gentle progress"
            icon={<Heart className="h-5 w-5 text-red-600" />}
            status="available"
            category="essential"
            path="/mood"
            metric={{ value: "8.2/10", label: "Today's mood" }}
          />
          <FeatureCard
            title="Calendar & Goals"
            description="Gentle scheduling and LEAP goal tracking designed for cognitive wellness"
            icon={<Calendar className="h-5 w-5 text-blue-600" />}
            status="available"
            category="essential"
            path="/calendar"
            metric={{ value: "3/5", label: "Activities completed" }}
          />
          <FeatureCard
            title="LEAP Goals"
            description="Empowering goal-setting with Memory1st approach and gentle progress tracking"
            icon={<Target className="h-5 w-5 text-green-600" />}
            status="available"
            category="essential"
            path="/goals"
            metric={{ value: "78%", label: "Progress this week" }}
          />
        </div>
      </div>

      {/* Memory1st Tools */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-800">Memory1st Tools</h2>
          <span className="text-sm text-gray-500">Cognitive wellness and brain training</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Brain Games"
            description="Cognitive training games designed with Memory1st principles for gentle improvement"
            icon={<Gamepad2 className="h-5 w-5 text-purple-600" />}
            status="available"
            category="memory1st"
            path="/brain-games"
          />
          <FeatureCard
            title="Brain Recovery"
            description="Comprehensive recovery tools and Memory1st strategies for cognitive wellness"
            icon={<Brain className="h-5 w-5 text-indigo-600" />}
            status="available"
            category="memory1st"
            path="/brain-recovery"
          />
          <FeatureCard
            title="Gratitude Practice"
            description="Daily gratitude exercises to enhance mental wellness and positive thinking"
            icon={<Smile className="h-5 w-5 text-amber-600" />}
            status="available"
            category="memory1st"
            path="/gratitude"
          />
        </div>
      </div>

      {/* Community & Support */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-800">Community & Support</h2>
          <span className="text-sm text-gray-500">Connect and grow together</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="MyRhythm Community"
            description="Connect with others on their Memory1st → LEAP journey in our supportive community"
            icon={<MessageSquare className="h-5 w-5 text-teal-600" />}
            status="available"
            category="community"
            path="/community"
            metric={{ value: "500+", label: "Members" }}
          />
          <FeatureCard
            title="Support Circle"
            description="Your personal network of family, friends, and supporters on your empowerment journey"
            icon={<Users2 className="h-5 w-5 text-orange-600" />}
            status="available"
            category="community"
            path="/personal-community"
            metric={{ value: "5", label: "Circle members" }}
          />
          <FeatureCard
            title="Accountability Hub"
            description="Smart reminders and gentle accountability to keep you on track"
            icon={<Bell className="h-5 w-5 text-yellow-600" />}
            status="available"
            category="community"
            path="/accountability"
          />
        </div>
      </div>

      {/* Resources & Tools */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-800">Resources & Tools</h2>
          <span className="text-sm text-gray-500">Knowledge and personal management</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="My Notes"
            description="Capture Memory1st insights, thoughts, and progress in your personal notebook"
            icon={<StickyNote className="h-5 w-5 text-blue-600" />}
            status="available"
            category="resources"
            path="/notes"
          />
          <FeatureCard
            title="Useful Resources"
            description="Curated resources, tips, and tools to support your cognitive wellness journey"
            icon={<HelpCircle className="h-5 w-5 text-green-600" />}
            status="available"
            category="resources"
            path="/useful-info"
          />
          <FeatureCard
            title="User Guide"
            description="Complete guide to using MyRhythm effectively for your empowerment journey"
            icon={<BookOpen className="h-5 w-5 text-gray-600" />}
            status="preview"
            category="resources"
            path="/user-guide"
          />
          <FeatureCard
            title="Profile Settings"
            description="Manage your account, preferences, and customize your MyRhythm experience"
            icon={<Settings className="h-5 w-5 text-gray-600" />}
            status="available"
            category="resources"
            path="/profile"
          />
        </div>
      </div>
    </div>
  );
}
