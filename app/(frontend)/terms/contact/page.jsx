/*
This page is accessible via /contact and /terms/contact using the rewrites in next.config.mjs
*/


"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState } from "react";

const maxCharacters = 500;

export default function Contact({ params, searchParams }) {

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [msg, setMsg] = useState();
  const [remaining, setRemaining] = useState(maxCharacters);
  const [isDisabled, setIsDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [submitValue, setSubmitValue] = useState("Send message");

  async function sendMessage(e) {
    try {
      e.preventDefault();

      document.querySelector("#email").style.color = "#757575";
      document.querySelector("#name").style.color = "#757575";
      document.querySelector("#textarea").style.color = "#757575";

      const result = document.querySelector("#result");
      setIsDisabled(true);
      setReadOnly(true);
      setSubmitValue("Sending...");

      const request = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          email: email,
          msg: msg
        })
      });

      if (!request.ok) throw new Error();

      const response = await request.json();

      result.innerText = response.status == "success" ? "✅ Message sent!" : "❌ Failed to send. Try again in a few minutes."
      setSubmitValue("Send message");

      setTimeout(() => {
        document.querySelector("#remaining-characters").style.visibility = "visible";
        response.status == "success" ? document.querySelector("#form").reset() : "";
        document.querySelector("#email").style.color = "var(--color)";
        document.querySelector("#name").style.color = "var(--color)";
        document.querySelector("#textarea").style.color = "var(--color)";
        setSubmitValue("Send message");
        setIsDisabled(false);
        setReadOnly(false);
        setRemaining(maxCharacters);
        result.innerText = "";
      }, 4 * 1000);

    } catch (error) {
      result.innerText = "❌ Failed to send. Please use the alternative methods to get in touch.";

      setTimeout(() => {
        document.querySelector("#remaining-characters").style.visibility = "visible";
        document.querySelector("#email").style.color = "var(--color)";
        document.querySelector("#name").style.color = "var(--color)";
        document.querySelector("#textarea").style.color = "var(--color)";
        setSubmitValue("Send message");
        setIsDisabled(false);
        setReadOnly(false);
        setRemaining(maxCharacters);
        result.innerText = "";
      }, 6 * 1000);

    }
  }


  return (
    <div className="container">
      <Header />
      <main className="main block relative">
        <div>
          <h1 className="title">Contact</h1>
        </div>

        <p>
          You can reach out using the form below or through any of the links in the footer (GitHub, Twitter, Twitch, etc).
          <br />
          Alternatively, you can find me on Discord as <strong>c4ldas</strong>.
          <br /><br />
          Responses will be sent to the email provided in the form.
        </p>

        <form id="form" onSubmit={sendMessage} className="form-inline" style={{ padding: "10px 0 10px 0", width: "150px" }}>

          <input id="name" type="text" required={true} readOnly={readOnly} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ width: "300px", padding: "10px", marginTop: "10px" }} ></input>

          <input id="email" type="email" required={true} readOnly={readOnly} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" style={{ width: "300px", padding: "10px", marginTop: "10px" }} ></input>

          <textarea id="textarea" required={true} readOnly={readOnly} rows={10} maxLength={maxCharacters} title="text" onChange={(e) => {
            setMsg(e.target.value);
            setRemaining(maxCharacters - e.target.textLength);
          }}
            style={{ width: "300px", padding: "5px", marginTop: "10px" }}
          ></textarea>
          <div id="remaining-characters" style={{ width: "300px", fontSize: "0.8rem", margin: "0 0 5px 0", textAlign: "right" }}>{remaining} characters left</div>
          <input type="submit" id="submit" className="formatted" value={submitValue} disabled={isDisabled} />

        </form>
        <span id="result"></span>
      </main>
      <FooterComponent />
    </div>
  );
}

