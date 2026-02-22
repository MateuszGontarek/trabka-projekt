"use client";

import { useState, useRef, type RefObject } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { formatEventDate, type EventWithMetadata } from "@/lib/types";
import { EventStatsChart } from "@/components/ui/event-stats";
import { deleteEvent } from "@/lib/events-storage";

// Użycie typów dla referencji
interface EventListProps {
  events: EventWithMetadata[];
  onEventsChange?: (events: EventWithMetadata[]) => void;
}

export function EventList({ events, onEventsChange }: EventListProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventWithMetadata | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Przykładowe dane dla wykresu
  const chartData = [
    { date: "Pon", events: 4 },
    { date: "Wt", events: 3 },
    { date: "Śr", events: 5 },
    { date: "Czw", events: 2 },
    { date: "Pt", events: 6 },
    { date: "Sob", events: 1 },
    { date: "Nie", events: 3 },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Container Query Example */}
      <div
        ref={containerRef}
        className="@container w-full"
      >
        <div className="@lg:grid @lg:grid-cols-2 @lg:gap-6 space-y-6 @lg:space-y-0">
          <Card className="@lg:col-span-2">
            <CardHeader>
              <CardTitle>Lista Wydarzeń</CardTitle>
              <CardDescription>
                Zarządzaj swoimi wydarzeniami
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={tableRef}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tytuł</TableHead>
                      <TableHead>Kategoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Lokalizacja</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Brak wydarzeń
                        </TableCell>
                      </TableRow>
                    ) : (
                      events.map((event) => (
                        <TableRow
                          key={event.id}
                          className="group hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>
                            <span className="capitalize">{event.category}</span>
                          </TableCell>
                          <TableCell>{formatEventDate(event.date)}</TableCell>
                          <TableCell>
                            {event.online ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-blue-600 cursor-help">Online</span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{event.meetingUrl}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              event.location
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 group-hover:bg-accent"
                                >
                                  <span className="sr-only">Otwórz menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setSelectedEvent(event)}
                                  className="cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Zobacz
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edytuj
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive cursor-pointer"
                                  onClick={() => {
                                    if (confirm(`Czy na pewno chcesz usunąć wydarzenie "${event.title}"?`)) {
                                      deleteEvent(event.id);
                                      if (onEventsChange) {
                                        const updatedEvents = events.filter((e) => e.id !== event.id);
                                        onEventsChange(updatedEvents);
                                      }
                                    }
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Usuń
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <EventStatsChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
