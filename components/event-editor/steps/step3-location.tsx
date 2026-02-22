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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

interface Step3LocationProps {
  form: UseFormReturn<EventFormData>;
}

export function Step3Location({ form }: Step3LocationProps) {
  const isOnline = form.watch("online");

  useEffect(() => {
    if (!isOnline) {
      form.setValue("meetingUrl", "", { shouldValidate: false });
      form.clearErrors("meetingUrl");
    }
  }, [isOnline, form]);

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-semibold mb-2">Lokalizacja i Szczegóły</h2>
        <p className="text-sm text-muted-foreground">
          Określ lokalizację i dodatkowe informacje
        </p>
      </div>

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lokalizacja *</FormLabel>
            <FormControl>
              <Input
                placeholder="Np. Warszawa, ul. Przykładowa 123"
                {...field}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormDescription>
              Adres lub nazwa miejsca wydarzenia
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="online"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Wydarzenie online</FormLabel>
              <FormDescription>
                Zaznacz, jeśli wydarzenie odbywa się online
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {isOnline && (
        <FormField
          control={form.control}
          name="meetingUrl"
          render={({ field }) => (
            <FormItem className="animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <FormLabel>URL spotkania *</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormDescription>
                Link do spotkania online (Zoom, Google Meet, Teams, itp.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="maxParticipants"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maksymalna liczba uczestników</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={10000}
                placeholder="Opcjonalnie"
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : parseInt(value) || undefined);
                }}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormDescription>
              Maksymalna liczba uczestników (opcjonalnie)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Priorytet</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Wybierz priorytet" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="low">Niski</SelectItem>
                <SelectItem value="medium">Średni</SelectItem>
                <SelectItem value="high">Wysoki</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Priorytet wydarzenia
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
