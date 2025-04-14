import { NextResponse } from "next/server";

const TOKEN = process.env.MAILGUN_TOKEN;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const MAIL_FROM = process.env.MAILGUN_MAIL_FROM; // @${DOMAIN}
const MAIL_TO = process.env.MAILGUN_MAIL_TO;
const SUBJECT = "Website c4ldas.com.br";
const TEXT = "This is a test message";

let lastMessageEpoch;
const waitTime = 60000; // 60 seconds


export async function POST(request) {
  console.log("IP:", request.headers.get("x-forwarded-for"));
  try {
    const rateLimit = checkRateLimit(Date.now());
    if (rateLimit.status == "failed") throw new Error("Rate limited");

    /*
    const request = await fetch(`https://api.mailgun.net/v3/${DOMAIN}/messages`, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`api:${TOKEN}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      },

      body: new URLSearchParams({
        "from": `${MAIL_FROM}@${DOMAIN}`,
        "to": MAIL_TO,
        "subject": SUBJECT,
        "text": TEXT,

      }).toString()
    });

    if (!request.ok) {
      console.error("Failed to send message:", await request.text());
      return NextResponse.json({ status: "failed", message: "Failed to send message" });
    }

    const response = await request.json();
    console.log("Email sent:", response.id);
    */
    lastMessageEpoch = Date.now();
    return NextResponse.json({ status: "success", message: "Message sent!" });

  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ status: "failed", message: "Failed to send message" });
  }
}

export async function GET(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed" });
}


// Rate limit of 1 min
function checkRateLimit(date) {
  if (date - lastMessageEpoch <= waitTime) {

    const timeRemaining = waitTime - (date - lastMessageEpoch);
    console.log(`Time remaining: ${parseInt(timeRemaining / 1000)}s`);

    return { status: "failed", message: "Rate Limit reached" }
  }

  return { status: "success", message: "success" }
}