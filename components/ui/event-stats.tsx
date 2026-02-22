"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Compound Component Pattern
interface EventStatsContextValue {
  variant?: "default" | "compact";
}

const EventStatsContext = React.createContext<EventStatsContextValue>({
  variant: "default",
});

interface EventStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "compact";
}

const EventStatsRoot = React.forwardRef<HTMLDivElement, EventStatsProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <EventStatsContext.Provider value={{ variant }}>
        <div
          ref={ref}
          className={cn(
            "rounded-lg border bg-card p-6",
            variant === "compact" && "p-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </EventStatsContext.Provider>
    );
  }
);
EventStatsRoot.displayName = "EventStats";

interface EventStatsHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const EventStatsHeader = React.forwardRef<HTMLDivElement, EventStatsHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = React.useContext(EventStatsContext);
    return (
      <div
        ref={ref}
        className={cn(
          "mb-4",
          variant === "compact" && "mb-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
EventStatsHeader.displayName = "EventStatsHeader";

interface EventStatsTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const EventStatsTitle = React.forwardRef<HTMLHeadingElement, EventStatsTitleProps>(
  ({ className, ...props }, ref) => {
    const { variant } = React.useContext(EventStatsContext);
    return (
      <h3
        ref={ref}
        className={cn(
          "text-lg font-semibold",
          variant === "compact" && "text-base",
          className
        )}
        {...props}
      />
    );
  }
);
EventStatsTitle.displayName = "EventStatsTitle";

interface EventStatsDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const EventStatsDescription = React.forwardRef<HTMLParagraphElement, EventStatsDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }
);
EventStatsDescription.displayName = "EventStatsDescription";

interface EventStatsContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const EventStatsContent = React.forwardRef<HTMLDivElement, EventStatsContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
EventStatsContent.displayName = "EventStatsContent";

// Export compound component
export const EventStats = Object.assign(EventStatsRoot, {
  Header: EventStatsHeader,
  Title: EventStatsTitle,
  Description: EventStatsDescription,
  Content: EventStatsContent,
});

// Example usage component with chart
interface EventStatsChartProps {
  data: Array<{ date: string; events: number }>;
}

export function EventStatsChart({ data }: EventStatsChartProps) {
  return (
    <EventStats variant="default">
      <EventStats.Header>
        <EventStats.Title>Statystyki Wydarzeń</EventStats.Title>
        <EventStats.Description>
          Liczba wydarzeń w ostatnich dniach
        </EventStats.Description>
      </EventStats.Header>
      <EventStats.Content>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="events"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorEvents)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </EventStats.Content>
    </EventStats>
  );
}
