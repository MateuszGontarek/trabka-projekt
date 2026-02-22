import { z } from "zod";

// Użycie unii i interesekcji
export type EventStatus = "draft" | "published" | "cancelled";
export type EventCategory = "conference" | "workshop" | "meetup" | "webinar";

// Użycie wbudowanych typów generycznych
export type PartialEvent = Partial<EventFormData>;
export type RequiredEventFields = Required<Pick<EventFormData, "title" | "date" | "time">>;
export type ReadonlyEvent = Readonly<EventFormData>;
export type EventRecord = Record<string, EventFormData>;

// Intersekcja typów - wydarzenie bez recaptcha (recaptcha jest tylko do walidacji formularza)
export type EventWithMetadata = Omit<EventFormData, "recaptcha"> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

// Union type dla priorytetów
export type EventPriority = "low" | "medium" | "high";

// Schemat Zod z walidacją, regex i refine
export const eventSchema = z.object({
  // Step 1: Podstawowe informacje
  title: z
    .string()
    .min(3, "Tytuł musi mieć minimum 3 znaki")
    .max(100, "Tytuł może mieć maksimum 100 znaków")
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s\-_]+$/, "Tytuł może zawierać tylko litery, cyfry, spacje, myślniki i podkreślenia"),
  
  description: z
    .union([
      z.string()
        .max(1000, "Opis może mieć maksimum 1000 znaków")
        .refine((val) => val.length >= 10, {
          message: "Opis musi mieć minimum 10 znaków",
        }),
      z.literal(""),
      z.undefined(),
    ])
    .optional(),
  
  category: z.enum(["conference", "workshop", "meetup", "webinar"]),
  
  // Step 2: Data i czas
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data musi być w formacie YYYY-MM-DD"),
  
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Czas musi być w formacie HH:MM"),
  
  duration: z
    .number()
    .min(15, "Czas trwania musi wynosić minimum 15 minut")
    .max(480, "Czas trwania może wynosić maksimum 480 minut"),
  
  // Step 3: Lokalizacja i dodatkowe informacje
  location: z
    .string()
    .min(3, "Lokalizacja musi mieć minimum 3 znaki")
    .max(200, "Lokalizacja może mieć maksimum 200 znaków"),
  
  online: z.boolean().default(false),
  
  meetingUrl: z
    .union([
      z.string().url("URL musi być prawidłowym adresem"),
      z.literal(""),
      z.undefined(),
    ])
    .optional(),
  
  maxParticipants: z
    .union([
      z.number()
        .min(1, "Maksymalna liczba uczestników musi wynosić minimum 1")
        .max(10000, "Maksymalna liczba uczestników może wynosić maksimum 10000"),
      z.undefined(),
    ])
    .optional(),
  
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  
  // Step 4: Potwierdzenie
  recaptcha: z.string().min(1, "Potwierdź, że nie jesteś robotem"),
})
.superRefine((data, ctx) => {
  // Waliduj meetingUrl tylko jeśli wydarzenie jest online
  if (data.online === true) {
    if (!data.meetingUrl || data.meetingUrl.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "URL spotkania jest wymagany dla wydarzeń online",
        path: ["meetingUrl"],
      });
    } else if (data.meetingUrl && data.meetingUrl.trim() !== "") {
      // Sprawdź czy URL jest prawidłowy tylko jeśli nie jest pusty
      try {
        new URL(data.meetingUrl);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "URL musi być prawidłowym adresem",
          path: ["meetingUrl"],
        });
      }
    }
  }
  
  // Debug: loguj dane podczas walidacji
  console.log("🔍 SuperRefine validation:", {
    online: data.online,
    meetingUrl: data.meetingUrl,
    hasMeetingUrl: !!data.meetingUrl,
    meetingUrlLength: data.meetingUrl?.length || 0,
  });
});

export type EventFormData = z.infer<typeof eventSchema>;
/** Typ wejściowy formularza (przed zastosowaniem domyślnych wartości) – do useForm + zodResolver */
export type EventFormInput = z.input<typeof eventSchema>;

// Użycie predykatu typu
export function isEventStatus(status: string): status is EventStatus {
  return ["draft", "published", "cancelled"].includes(status);
}

// Użycie przeciążeń funkcji
export function formatEventDate(date: string): string;
export function formatEventDate(date: Date): string;
export function formatEventDate(date: string | Date): string {
  if (typeof date === "string") {
    return new Date(date).toLocaleDateString("pl-PL");
  }
  return date.toLocaleDateString("pl-PL");
}

// Generyczny komponent typu
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type EventListResponse = ApiResponse<EventWithMetadata[]>;
export type EventResponse = ApiResponse<EventWithMetadata>;
