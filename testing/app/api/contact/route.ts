import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request: Request) => {
  const { name, email, phone, message } = await request.json();

  // Prepare email content
  const emailContent = `
    New Contact Form Submission

    Name: ${name}
    Email: ${email}
    Phone: ${phone || "Not provided"}

    Message:
    ${message}
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: process.env.CONTACT_EMAIL || process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      subject: `New Contact Form Submission from ${name}`,
      text: emailContent,
    });

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Error sending contact email:", error);
    return Response.json(
      { error: "Error sending your message. Please try again." },
      { status: 400 }
    );
  }
};
