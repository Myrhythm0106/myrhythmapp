
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Brain, Target, Heart } from "lucide-react";
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";

interface YearViewProps {
  currentDate: Date;
  events: any[];
  onDayClick: (date: Date) => void;
  onMonthClick?: (date: Date) => void;
}

export function YearView({ currentDate, events, onDayClick, onMonthClick }: YearViewProps) {
  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const getEventsForMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    return events.filter(event => {
      const eventDate = new Date(event.startTime || event.date);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime || event.date);
      return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  };

  const renderMiniCalendar = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const monthEvents = getEventsForMonth(monthDate);

    return (
      <Card key={format(monthDate, 'yyyy-MM')} className="h-48 border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/30 to-white">
        <CardHeader className="p-2">
          <CardTitle className="text-sm font-semibold text-center text-memory-emerald-800">
            <Button
              variant="ghost"
              onClick={() => onMonthClick?.(monthDate)}
              className="h-auto p-1 text-sm hover:bg-memory-emerald-100"
            >
              {format(monthDate, 'MMMM')}
            </Button>
          </CardTitle>
          {monthEvents.length > 0 && (
            <div className="flex justify-center">
              <Badge variant="outline" className="text-xs bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-300">
                {monthEvents.length} events
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-1">
          <div className="grid grid-cols-7 gap-0.5 text-xs">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-gray-500 font-medium p-0.5">
                {day}
              </div>
            ))}
            {days.map(day => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, monthDate);
              const isTodayDate = isToday(day);
              
              return (
                <Button
                  key={day.toISOString()}
                  variant="ghost"
                  onClick={() => onDayClick(day)}
                  className={`
                    h-6 w-6 p-0 text-xs relative
                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                    ${isTodayDate ? 'bg-primary text-primary-foreground font-bold' : ''}
                    ${dayEvents.length > 0 ? 'bg-memory-emerald-100 text-memory-emerald-800' : ''}
                    hover:bg-memory-emerald-200
                  `}
                >
                  {format(day, 'd')}
                  {dayEvents.length > 0 && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-clarity-teal-500 rounded-full"></div>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Year Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Calendar className="h-6 w-6 text-memory-emerald-600" />
          <h2 className="text-2xl font-bold text-memory-emerald-800">
            {format(currentDate, 'yyyy')} Overview
          </h2>
        </div>
        
        {/* Year Stats */}
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-memory-emerald-400 to-memory-emerald-500 rounded-full flex items-center justify-center mx-auto mb-1">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <p className="text-xs text-gray-600">Memory1st</p>
            <p className="text-sm font-semibold">Foundation</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-1">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <p className="text-xs text-gray-600">MYRHYTHM</p>
            <p className="text-sm font-semibold">Process</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-1">
              <Target className="h-6 w-6 text-white" />
            </div>
            <p className="text-xs text-gray-600">LEAP</p>
            <p className="text-sm font-semibold">Outcome</p>
          </div>
        </div>
      </div>

      {/* 12-Month Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map(renderMiniCalendar)}
      </div>

      {/* Year Summary Card */}
      <Card className="border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-memory-emerald-800">
              Your {format(currentDate, 'yyyy')} Journey
            </h3>
            <p className="text-sm text-gray-600">
              Every month builds on your Memory1st foundation, strengthens your MYRHYTHM process, and moves you closer to your LEAP outcome.
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge className="bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200">
                Total Events: {events.length}
              </Badge>
              <Badge className="bg-clarity-teal-100 text-clarity-teal-700 border-clarity-teal-200">
                Active Months: {months.filter(month => getEventsForMonth(month).length > 0).length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
