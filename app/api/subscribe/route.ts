import mailchimp from "@mailchimp/mailchimp_marketing";
import { NextRequest } from "next/server";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER, // e.g. us1
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { email } = json;

  console.log("email", email);

  if (!email) {
    return new Response("Email is required", { status: 400 });
  }

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID!, {
      email_address: email,
      status: "subscribed",
    });
  } catch (e) {
    console.log(e);
    return new Response("There was an error subscribing to the newsletter.", {
      status: 400,
    });
  }

  return new Response("Success", { status: 200 });
}
