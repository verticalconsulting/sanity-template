"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SectionContainer from "@/components/ui/section-container";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useCallback } from "react";
import { Loader2 } from "lucide-react";
import { stegaClean } from "next-sanity";
import { PAGE_QUERYResult } from "@/sanity.types";

type FormDonateCarProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "form-donate-car" }
>;

export default function FormDonateCar({
  padding,
  colorVariant,
  title,
  description,
  buttonText,
  successMessage,
}: FormDonateCarProps) {
  // form validation schema
  const formSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: "Please enter your name",
      })
      .min(2, {
        message: "Name must be at least 2 characters",
      }),
    email: z
      .string()
      .min(1, {
        message: "Please enter your email",
      })
      .email({
        message: "Please enter a valid email",
      }),
    phone: z
      .string()
      .min(1, {
        message: "Please enter your phone number",
      })
      .min(10, {
        message: "Please enter a valid phone number",
      }),
    vehicleYear: z
      .string()
      .min(1, {
        message: "Please enter the vehicle year",
      })
      .regex(/^\d{4}$/, {
        message: "Please enter a valid 4-digit year",
      }),
    vehicleMake: z
      .string()
      .min(1, {
        message: "Please enter the vehicle make",
      }),
    vehicleModel: z
      .string()
      .min(1, {
        message: "Please enter the vehicle model",
      }),
    vehicleVin: z.string().optional(),
    mileage: z.string().optional(),
    condition: z
      .string()
      .min(1, {
        message: "Please select the vehicle condition",
      }),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleVin: "",
      mileage: "",
      condition: "",
      notes: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSend = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const response = await fetch("/api/donate-car", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();

        if (response.ok) {
          toast(successMessage);
          form.reset();
        } else {
          toast.error(result.error);
        }
      } catch (error: any) {
        toast.error(error.message);
        throw new Error(error.message);
      }
    },
    [form, successMessage]
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleSend(values);
  }

  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      <div className="max-w-3xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
        )}
        {description && <p className="text-muted-foreground mb-8">{description}</p>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Donor Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Your Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Your name"
                        autoComplete="name"
                        data-1p-ignore
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your.email@example.com"
                        autoComplete="email"
                        data-1p-ignore
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="(555) 123-4567"
                        autoComplete="tel"
                        data-1p-ignore
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Vehicle Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Vehicle Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="vehicleYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="2020"
                          maxLength={4}
                          data-1p-ignore
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleMake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Toyota"
                          data-1p-ignore
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Camry"
                          data-1p-ignore
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="vehicleVin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN (optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="1HGBH41JXMN109186"
                        maxLength={17}
                        data-1p-ignore
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage (optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="50000"
                          data-1p-ignore
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        >
                          <option value="">Select condition</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Any additional information about the vehicle..."
                        rows={4}
                        data-1p-ignore
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {buttonText}
            </Button>
          </form>
        </Form>
      </div>
    </SectionContainer>
  );
}
