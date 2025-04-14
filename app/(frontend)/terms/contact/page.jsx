"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState } from "react";

const maxCharacters = 500;

///////////////////////////////////////////////////////
// Pending: 
// - Dialog to inform message failed or sent successfully
// - If message failed, do not clear the form
// - Adjust time to remove read-only status from form
// - Make the form more atractive visually
///////////////////////////////////////////////////////


export default function Contact({ params, searchParams }) {

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [msg, setMsg] = useState();
  const [remaining, setRemaining] = useState(maxCharacters);
  const [result, setResult] = useState();
  const [readOnly, setReadOnly] = useState(false);
  const [color, setColor] = useState();

  async function sendMessage(e) {
    e.preventDefault();
    document.querySelector("#remaining-characters").style.visibility = "hidden";
    setReadOnly(true);
    setColor("hsl(0, 0%, 0%, 0.3)");


    const request = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        email: email,
        msg: msg
      })
    });

    const response = await request.json();
    setResult(response.status);

    setTimeout(() => {
      document.querySelector("#remaining-characters").style.visibility = "visible";
      document.querySelector("#form").reset();
      setResult("");
      setColor("");
      setReadOnly(false)
    }, 30 * 1000);

  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <div>
          <h1 className="title">Contact page</h1>
        </div>

        <p>
          You can contact me at the form below or using any links in the footer of the page (GitHub, Twitter, Twitch, etc). You can also look for me on Discord as <strong>c4ldas</strong>.
        </p>

        <form id="form" onSubmit={sendMessage} className="form-inline" style={{ paddingTop: "10px", width: "50px" }}>

          <input type="text" required={true} readOnly={readOnly} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ backgroundColor: color, width: "300px", padding: "10px", marginTop: "10px" }} ></input>

          <input type="email" required={true} readOnly={readOnly} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" style={{ backgroundColor: color, width: "300px", padding: "10px", marginTop: "10px" }} ></input>

          <textarea required={true} rows={10} maxLength={maxCharacters} readOnly={readOnly} title="text" onChange={(e) => {
            setMsg(e.target.value);
            setRemaining(maxCharacters - e.target.textLength);
          }}
            style={{ backgroundColor: color, width: "300px", padding: "5px", marginTop: "10px" }}
          ></textarea>
          <div id="remaining-characters" style={{ width: "300px" }}>{remaining} characters remaining</div>
          <input type="submit" value="Send message" disabled={readOnly} />

        </form>
        <div id="response">{result}</div>

      </main>


      <FooterComponent />
    </div>
  );
}

