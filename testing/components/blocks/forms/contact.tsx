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

type FormContactProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "form-contact" }
>;

export default function FormContact({
  padding,
  colorVariant,
  title,
  description,
  buttonText,
  successMessage,
}: FormContactProps) {
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
    phone: z.string().optional(),
    message: z
      .string()
      .min(1, {
        message: "Please enter a message",
      })
      .min(10, {
        message: "Message must be at least 10 characters",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSend = useCallback(
    async ({
      name,
      email,
      phone,
      message,
    }: {
      name: string;
      email: string;
      phone?: string;
      message: string;
    }) => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            message,
          }),
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
      <div className="max-w-2xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
        )}
        {description && <p className="text-muted-foreground mb-8">{description}</p>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormLabel>Phone (optional)</FormLabel>
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

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="How can we help you?"
                      rows={5}
                      data-1p-ignore
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
