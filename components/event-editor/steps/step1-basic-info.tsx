"use client";

import { UseFormReturn } from "react-hook-form";
import { EventFormInput } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Step1BasicInfoProps {
  form: UseFormReturn<EventFormInput>;
}

export function Step1BasicInfo({ form }: Step1BasicInfoProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-semibold mb-2">Podstawowe Informacje</h2>
        <p className="text-sm text-muted-foreground">
          Wprowadź podstawowe informacje o wydarzeniu
        </p>
      </div>

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tytuł wydarzenia *</FormLabel>
            <FormControl>
              <Input
                placeholder="Np. Konferencja Technologiczna 2024"
                {...field}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            <FormDescription>
              Tytuł powinien być krótki i opisowy
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Opis</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Szczegółowy opis wydarzenia..."
                className="min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Opcjonalny opis wydarzenia (10-1000 znaków)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kategoria *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="conference">Konferencja</SelectItem>
                <SelectItem value="workshop">Warsztat</SelectItem>
                <SelectItem value="meetup">Spotkanie</SelectItem>
                <SelectItem value="webinar">Webinar</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Wybierz kategorię wydarzenia
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
