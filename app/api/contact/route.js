import { NextResponse } from "next/server";

const TOKEN = process.env.MAILGUN_TOKEN;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const MAIL_FROM = process.env.MAILGUN_MAIL_FROM; // @${DOMAIN}
const MAIL_TO = process.env.MAILGUN_MAIL_TO;
const SUBJECT = "Website c4ldas.com.br";

let lastMessageEpoch;
const waitTime = 60000; // 60 seconds


///////////////////////////////////////////////////////
// Pending: 
// - Rate limit based on IP
// - When a message is sent, the IP is stored in the Map with a timer.
// - After 2 minutes, the timer runs and deletes the IP automatically.
// 
// const forwardedFor = request.headers.get("x-forwarded-for");
// const ip = forwardedFor?.split(",")[0] || "unknown";
// const now = Date.now();
// const lastSent = ipTimestamps.get(ip);
// if (lastSent && now - lastSent < COOLDOWN_MS) {
//   throw new Error("Cooldown active"); // silent fail
// }
// ipTimestamps.set(ip, now);
// setTimeout(() => ipTimestamps.delete(ip), COOLDOWN_MS);
///////////////////////////////////////////////////////


export async function POST(request) {


  try {
    // Change below to rate limit based on IP
    const rateLimit = checkRateLimit(Date.now());
    if (rateLimit.status == "failed") throw new Error("Rate limited");

    const body = await request.json();

    const mailRequest = await fetch(`https://api.mailgun.net/v3/${DOMAIN}/messages`, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`api:${TOKEN}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      },

      body: new URLSearchParams({
        "from": `${MAIL_FROM}@${DOMAIN}`,
        "to": MAIL_TO,
        "subject": SUBJECT,
        "text": `From: ${body.name}\nEmail: ${body.email}\n\n${body.msg}`,

      }).toString()
    });

    if (!mailRequest.ok) {
      console.error("Failed to send message:", await mailRequest.text());
      return NextResponse.json({ status: "failed", message: "Failed to send message" });
    }

    const response = await mailRequest.json();
    console.log("Email sent:", response.id);

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



// Change it based on IP
function checkRateLimit(date) {



  // Rate limit of 1 min
  if (date - lastMessageEpoch <= waitTime) {

    const timeRemaining = waitTime - (date - lastMessageEpoch);
    console.log(`Time remaining: ${parseInt(timeRemaining / 1000)}s`);

    return { status: "failed", message: "Rate Limit reached" }
  }

  return { status: "success", message: "success" }
}