"use client";

import { UseFormReturn } from "react-hook-form";
import { EventFormInput } from "@/lib/types";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ReCAPTCHA from "react-google-recaptcha";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEventDate } from "@/lib/types";

interface Step4ConfirmationProps {
  form: UseFormReturn<EventFormInput>;
}

export function Step4Confirmation({ form }: Step4ConfirmationProps) {
  const formData = form.watch();

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-semibold mb-2">Podsumowanie</h2>
        <p className="text-sm text-muted-foreground">
          Sprawdź szczegóły wydarzenia i potwierdź utworzenie
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Szczegóły wydarzenia</CardTitle>
          <CardDescription>Podgląd wprowadzonych danych</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tytuł</p>
              <p className="text-base font-semibold">{formData.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kategoria</p>
              <p className="text-base font-semibold capitalize">{formData.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data</p>
              <p className="text-base font-semibold">{formatEventDate(formData.date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Godzina</p>
              <p className="text-base font-semibold">{formData.time}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Czas trwania</p>
              <p className="text-base font-semibold">{formData.duration} minut</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lokalizacja</p>
              <p className="text-base font-semibold">{formData.location}</p>
            </div>
            {formData.online && formData.meetingUrl && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">URL spotkania</p>
                <p className="text-base font-semibold break-all">{formData.meetingUrl}</p>
              </div>
            )}
            {formData.maxParticipants && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maks. uczestników</p>
                <p className="text-base font-semibold">{formData.maxParticipants}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Priorytet</p>
              <p className="text-base font-semibold capitalize">{formData.priority}</p>
            </div>
          </div>
          {formData.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Opis</p>
              <p className="text-base">{formData.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <FormField
        control={form.control}
        name="recaptcha"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Weryfikacja *</FormLabel>
            <FormControl>
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test key - w produkcji użyj własnego klucza
                onChange={(token) => {
                  console.log("ReCAPTCHA token:", token);
                  field.onChange(token || "");
                }}
                onExpired={() => {
                  console.log("ReCAPTCHA expired");
                  field.onChange("");
                }}
                onErrored={(error) => {
                  console.log("ReCAPTCHA error:", error);
                  field.onChange("");
                }}
              />
            </FormControl>
            <FormDescription>
              Potwierdź, że nie jesteś robotem (kliknij checkbox reCAPTCHA)
            </FormDescription>
            <FormMessage />
            {form.formState.errors.recaptcha && (
              <div className="text-sm text-destructive mt-2 p-2 bg-destructive/10 rounded">
                <p className="font-semibold">Błąd weryfikacji:</p>
                <p>{form.formState.errors.recaptcha.message}</p>
                <p className="text-xs mt-1 opacity-75">
                  Upewnij się, że zaznaczyłeś checkbox reCAPTCHA
                </p>
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
