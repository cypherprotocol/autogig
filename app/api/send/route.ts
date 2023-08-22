import FollowupEmail from "@/emails";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendSchema = z.object({
  firstName: z.string(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { firstName, email } = sendSchema.parse(json);

  try {
    const data = await resend.emails.send({
      from: "Autogig <hey@autogig.pro>",
      to: [email],
      subject: `👋 Hey ${firstName}!`,
      react: FollowupEmail(),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
