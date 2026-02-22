"use client";

import { EventEditor } from "@/components/event-editor/event-editor";
import { EventList } from "@/components/event-list/event-list";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, List } from "lucide-react";
import { getEvents, addEvent, type EventWithMetadata } from "@/lib/events-storage";

export default function Home() {
  const [view, setView] = useState<"editor" | "list">("editor");
  const [events, setEvents] = useState<EventWithMetadata[]>([]);
  
  // Załaduj wydarzenia przy starcie
  useEffect(() => {
    const loadedEvents = getEvents();
    setEvents(loadedEvents);
  }, []);
  
  // Funkcja do dodawania nowego wydarzenia
  const handleEventCreated = (eventData: any) => {
    const newEvent = addEvent(eventData);
    setEvents((prev) => [...prev, newEvent]);
    // Przełącz na widok listy po utworzeniu wydarzenia
    setView("list");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 px-4">
        {/* Header z nawigacją */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edytor Wydarzeń
            </h1>
            <p className="text-muted-foreground mt-2">
              Twórz i zarządzaj wydarzeniami
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={view === "editor" ? "default" : "outline"}
              onClick={() => setView("editor")}
              className="group"
            >
              <Calendar className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Edytor
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
              className="group"
            >
              <List className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Lista
            </Button>
          </div>
        </div>

        {/* Główna zawartość */}
        {view === "editor" ? (
          <EventEditor onEventCreated={handleEventCreated} />
        ) : (
          <EventList events={events} onEventsChange={setEvents} />
        )}

        {/* Dialog z informacjami */}
        <div className="mt-8 flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="group">
                Informacje o projekcie
                <span className="ml-2 group-hover:animate-pulse">ℹ️</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Funkcjonalności projektu</DialogTitle>
                <DialogDescription>
                  Projekt wykorzystuje wszystkie wymagane technologie i wzorce
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p><strong>TailwindCSS:</strong> Media queries, pseudoklasy, container, group, animacje, container queries</p>
                <p><strong>TypeScript:</strong> Unie, interesekcje, generyki, przeciążenia, predykaty typów</p>
                <p><strong>React Hook Form & Zod:</strong> Multi-step formularz, walidacja, regex, refine, reCAPTCHA</p>
                <p><strong>Shadcn:</strong> Dialog, Card, Table, Tooltip, Dropdown Menu, wykresy, Compound Components</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
