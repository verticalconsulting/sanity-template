import { defineField, defineType } from "sanity";
import { Car } from "lucide-react";
import { STACK_ALIGN } from "../shared/layout-variants";

export default defineType({
  name: "form-donate-car",
  type: "object",
  title: "Form: Donate Car",
  description:
    "A specialized form for collecting vehicle donation information including vehicle details and donor contact information.",
  icon: Car,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant",
    }),
    defineField({
      name: "stackAlign",
      type: "string",
      title: "Stack Layout Alignment",
      options: {
        list: STACK_ALIGN.map(({ title, value }) => ({ title, value })),
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "title",
      type: "string",
      initialValue: "Donate Your Car",
    }),
    defineField({
      name: "description",
      type: "text",
      initialValue: "Fill out the form below to donate your vehicle. We'll contact you to arrange pickup.",
    }),
    defineField({
      name: "buttonText",
      type: "string",
      initialValue: "Submit Donation",
    }),
    defineField({
      name: "successMessage",
      type: "text",
      initialValue: "Thank you for your donation! We'll contact you soon to arrange pickup.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Donate Car Form",
      };
    },
  },
});
