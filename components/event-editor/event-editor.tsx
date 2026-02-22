"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventFormData } from "@/lib/types";
import { Step1BasicInfo } from "./steps/step1-basic-info";
import { Step2DateTime } from "./steps/step2-date-time";
import { Step3Location } from "./steps/step3-location";
import { Step4Confirmation } from "./steps/step4-confirmation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TOTAL_STEPS = 4;

interface EventEditorProps {
  onEventCreated?: (eventData: Omit<EventFormData, "recaptcha">) => void;
}

export function EventEditor({ onEventCreated }: EventEditorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      category: "conference",
      date: "",
      time: "",
      duration: 60,
      location: "",
      online: false,
      meetingUrl: "",
      maxParticipants: undefined,
      priority: "medium",
      recaptcha: "",
    },
  });

  const { handleSubmit, trigger, formState: { errors, isValid, isDirty } } = form;

  const handleNext = async () => {
    let fieldsToValidate: (keyof EventFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["title", "description", "category"];
        break;
      case 2:
        fieldsToValidate = ["date", "time", "duration"];
        break;
      case 3:
        // Sprawdź czy wydarzenie jest online
        const isOnline = form.getValues("online");
        fieldsToValidate = ["location", "online", "priority"];
        // Dodaj meetingUrl tylko jeśli wydarzenie jest online
        if (isOnline) {
          fieldsToValidate.push("meetingUrl");
        }
        // maxParticipants jest opcjonalne, więc nie wymagamy walidacji
        break;
      default:
        break;
    }

    const isValidStep = await trigger(fieldsToValidate);
    
    // Debug: pokaż błędy w konsoli
    if (!isValidStep) {
      console.log("Validation errors:", form.formState.errors);
      console.log("Fields to validate:", fieldsToValidate);
    }
    
    if (isValidStep && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    console.log("🎉 ========== onSubmit CALLED ==========");
    console.log("✅ onSubmit function called!");
    console.log("✅ Form submitted successfully!");
    console.log("📋 Form data:", JSON.stringify(data, null, 2));
    
    try {
      // Wywołaj callback z danymi wydarzenia (bez recaptcha)
      const { recaptcha, ...eventData } = data;
      if (onEventCreated) {
        onEventCreated(eventData);
      }
      
      // Oznacz jako przesłane
      setIsSubmitted(true);
      
      // Reset formularza po sukcesie
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      console.error("❌ Error in onSubmit:", error);
      alert("Wystąpił błąd podczas tworzenia wydarzenia. Sprawdź konsolę.");
    }
  };

  const onError = (errors: any) => {
    console.log("❌ Form validation errors:", errors);
    console.log("Form values:", form.getValues());
    console.log("All form state:", form.formState);
    
    // Wyświetl szczegółowe informacje o każdym błędzie
    Object.keys(errors).forEach((field) => {
      console.log(`Field "${field}" error:`, errors[field]);
      console.log(`Field "${field}" value:`, form.getValues(field as keyof EventFormData));
    });
    
    // Przewiń do pierwszego błędu
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      console.log("First error field:", firstErrorField, errors[firstErrorField]);
      
      // Spróbuj znaleźć element formularza z błędem
      setTimeout(() => {
        const element = document.querySelector(`[name="${firstErrorField}"]`) ||
                       document.querySelector(`[id="${firstErrorField}"]`) ||
                       document.querySelector(`[aria-invalid="true"]`) ||
                       document.querySelector(`[data-field="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          (element as HTMLElement).focus();
        }
      }, 100);
    }
  };

  // Jeśli formularz został przesłany, pokaż komunikat sukcesu
  if (isSubmitted) {
    return (
      <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-green-600 dark:text-green-400">
              ✅ Wydarzenie utworzone pomyślnie!
            </CardTitle>
            <CardDescription>
              Twoje wydarzenie zostało zapisane
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Wydarzenie zostało pomyślnie utworzone. Możesz teraz utworzyć kolejne wydarzenie lub przejść do listy wydarzeń.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  form.reset();
                  setCurrentStep(1);
                }}
                className="group"
              >
                Utwórz kolejne wydarzenie
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">Edytor Wydarzeń</CardTitle>
          <CardDescription>
            Krok {currentStep} z {TOTAL_STEPS}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress bar */}
          <div className="mb-8 flex items-center justify-between">
            {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
              const step = index + 1;
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300 ease-in-out
                        ${isCompleted 
                          ? "bg-green-500 text-white" 
                          : isActive 
                          ? "bg-blue-500 text-white scale-110" 
                          : "bg-gray-200 text-gray-600"
                        }
                        hover:scale-105 active:scale-95
                      `}
                    >
                      {isCompleted ? "✓" : step}
                    </div>
                    <span className={`text-xs mt-2 ${isActive ? "font-semibold" : ""}`}>
                      Krok {step}
                    </span>
                  </div>
                  {step < TOTAL_STEPS && (
                    <div 
                      className={`
                        h-1 flex-1 mx-2 transition-all duration-300
                        ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form steps */}
          <Form {...form}>
            <form 
              onSubmit={async (e) => {
                console.log("🚀 Form submit event triggered");
                e.preventDefault();
                
                // Ręczna walidacja przed wywołaniem handleSubmit
                const isValid = await trigger();
                console.log("🔍 Validation before submit:", isValid);
                console.log("📋 Form values:", form.getValues());
                console.log("❌ Form errors:", form.formState.errors);
                
                if (isValid) {
                  console.log("✅ Form is valid, calling handleSubmit");
                  const submitHandler = handleSubmit(onSubmit, onError);
                  submitHandler(e);
                } else {
                  console.log("❌ Form is invalid, calling onError");
                  onError(form.formState.errors);
                }
              }} 
              className="space-y-6"
            >
              {currentStep === 1 && <Step1BasicInfo form={form} />}
              {currentStep === 2 && <Step2DateTime form={form} />}
              {currentStep === 3 && <Step3Location form={form} />}
              {currentStep === 4 && <Step4Confirmation form={form} />}

              {/* Navigation buttons */}
              <div className="flex justify-between gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="group"
                >
                  <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Wstecz
                </Button>
                
                {currentStep < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="group"
                  >
                    Dalej
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      type="submit"
                      className="group"
                      onClick={async (e) => {
                        console.log("🔘 Submit button clicked");
                        console.log("Current form values:", form.getValues());
                        console.log("Current errors:", form.formState.errors);
                        console.log("Is valid:", form.formState.isValid);
                        console.log("Form state:", form.formState);
                        
                        // Ręczna walidacja przed submitem
                        const isValid = await form.trigger();
                        console.log("Manual validation result:", isValid);
                        
                        if (isValid) {
                          console.log("✅ Form is valid, proceeding with submit");
                        } else {
                          console.log("❌ Form has validation errors");
                          console.log("Errors:", form.formState.errors);
                        }
                      }}
                    >
                      Utwórz Wydarzenie
                    </Button>
                    {Object.keys(errors).length > 0 && (
                      <div className="text-xs text-destructive text-right max-w-xs">
                        Proszę poprawić błędy w formularzu ({Object.keys(errors).length})
                        <br />
                        <span className="text-[10px] opacity-75">
                          Sprawdź konsolę przeglądarki (F12) dla szczegółów
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
