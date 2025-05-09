
import React from "react";
import { DailyCheckin } from "@/components/dashboard/DailyCheckin";
import { SymptomTracker } from "@/components/dashboard/SymptomTracker";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import { SwipeableCarousel } from "@/components/dashboard/SwipeableCarousel";

export function MobileCarousel() {
  const dashboardCards = [
    <DailyCheckin key="checkin" />,
    <SymptomTracker key="symptom" />,
    <CommunityCard key="community" />,
    <UpcomingEvents key="upcoming" date={new Date()} />
  ];

  return (
    <SwipeableCarousel items={dashboardCards} title="Your Health Overview" />
  );
}
