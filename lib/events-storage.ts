import { EventWithMetadata, EventFormData } from "./types";

const STORAGE_KEY = "events";

// Typ dla wydarzenia bez recaptcha
type EventDataWithoutRecaptcha = Omit<EventFormData, "recaptcha">;

// Funkcja do pobierania wydarzeń z localStorage
export function getEvents(): EventWithMetadata[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const events = JSON.parse(stored);
    // Konwertuj daty z stringów na obiekty Date
    return events.map((event: any) => ({
      ...event,
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
    }));
  } catch (error) {
    console.error("Error loading events from localStorage:", error);
    return [];
  }
}

// Funkcja do zapisywania wydarzeń do localStorage
export function saveEvents(events: EventWithMetadata[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error("Error saving events to localStorage:", error);
  }
}

// Funkcja do dodawania nowego wydarzenia
export function addEvent(eventData: EventDataWithoutRecaptcha): EventWithMetadata {
  const events = getEvents();
  const newEvent: EventWithMetadata = {
    ...eventData,
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const updatedEvents = [...events, newEvent];
  saveEvents(updatedEvents);
  
  return newEvent;
}

// Funkcja do usuwania wydarzenia
export function deleteEvent(eventId: string): void {
  const events = getEvents();
  const updatedEvents = events.filter((event) => event.id !== eventId);
  saveEvents(updatedEvents);
}

// Funkcja do aktualizacji wydarzenia
export function updateEvent(eventId: string, eventData: Partial<EventFormData>): EventWithMetadata | null {
  const events = getEvents();
  const eventIndex = events.findIndex((event) => event.id === eventId);
  
  if (eventIndex === -1) return null;
  
  const updatedEvent: EventWithMetadata = {
    ...events[eventIndex],
    ...eventData,
    id: eventId,
    updatedAt: new Date(),
  };
  
  events[eventIndex] = updatedEvent;
  saveEvents(events);
  
  return updatedEvent;
}
