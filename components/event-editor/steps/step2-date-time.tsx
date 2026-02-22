"use client";

import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "@/lib/types";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Step2DateTimeProps {
  form: UseFormReturn<EventFormData>;
}

export function Step2DateTime({ form }: Step2DateTimeProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-semibold mb-2">Data i Czas</h2>
        <p className="text-sm text-muted-foreground">
          Ustaw datę, godzinę i czas trwania wydarzenia
        </p>
      </div>

      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data wydarzenia *</FormLabel>
            <FormControl>
              <Input
                type="date"
                min={today}
                {...field}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormDescription>
              Wybierz datę wydarzenia
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Godzina rozpoczęcia *</FormLabel>
            <FormControl>
              <Input
                type="time"
                {...field}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormDescription>
              Ustaw godzinę rozpoczęcia (format HH:MM)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Czas trwania (minuty) *</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={15}
                max={480}
                step={15}
                value={field.value ?? 60}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? 60 : parseInt(value) || 60);
                }}
                onBlur={field.onBlur}
                name={field.name}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormDescription>
              Czas trwania wydarzenia w minutach (15-480)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
