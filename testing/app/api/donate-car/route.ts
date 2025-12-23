import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request: Request) => {
  const {
    name,
    email,
    phone,
    vehicleYear,
    vehicleMake,
    vehicleModel,
    vehicleVin,
    mileage,
    condition,
    notes,
  } = await request.json();

  // Prepare email content
  const emailContent = `
    New Vehicle Donation Submission

    Donor Information:
    ------------------
    Name: ${name}
    Email: ${email}
    Phone: ${phone}

    Vehicle Information:
    -------------------
    Year: ${vehicleYear}
    Make: ${vehicleMake}
    Model: ${vehicleModel}
    VIN: ${vehicleVin || "Not provided"}
    Mileage: ${mileage || "Not provided"}
    Condition: ${condition}

    Additional Notes:
    ----------------
    ${notes || "None"}
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: process.env.DONATE_EMAIL || process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      subject: `New Vehicle Donation: ${vehicleYear} ${vehicleMake} ${vehicleModel}`,
      text: emailContent,
    });

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Error sending donation email:", error);
    return Response.json(
      { error: "Error submitting your donation. Please try again." },
      { status: 400 }
    );
  }
};
