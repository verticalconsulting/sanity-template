import { defineField, defineType } from "sanity";
import { Mail } from "lucide-react";
import { STACK_ALIGN } from "../shared/layout-variants";

export default defineType({
  name: "form-contact",
  type: "object",
  title: "Form: Contact",
  description:
    "A general-purpose contact form for collecting inquiries with name, email, phone, and message fields.",
  icon: Mail,
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
      initialValue: "Contact Us",
    }),
    defineField({
      name: "description",
      type: "text",
      initialValue: "Fill out the form below and we'll get back to you as soon as possible.",
    }),
    defineField({
      name: "buttonText",
      type: "string",
      initialValue: "Send Message",
    }),
    defineField({
      name: "successMessage",
      type: "text",
      initialValue: "Thank you for contacting us! We'll get back to you soon.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Contact Form",
      };
    },
  },
});
