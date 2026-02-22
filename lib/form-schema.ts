import { eventSchema } from "./types";

// Eksport schematu dla użycia w formularzu
export { eventSchema };

// Schematy dla poszczególnych kroków
export const step1Schema = eventSchema.pick({
  title: true,
  description: true,
  category: true,
});

export const step2Schema = eventSchema.pick({
  date: true,
  time: true,
  duration: true,
});

export const step3Schema = eventSchema.pick({
  location: true,
  online: true,
  meetingUrl: true,
  maxParticipants: true,
  priority: true,
});

export const step4Schema = eventSchema.pick({
  recaptcha: true,
});
