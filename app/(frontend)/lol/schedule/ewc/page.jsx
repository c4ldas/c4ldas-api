"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ValorantSchedule({ params, searchParams }) {

  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [id, setId] = useState('');
  const [seriesId, setSeriesId] = useState('all');
  const [msg, setMsg] = useState("No games for (league) today");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const submitter = event.nativeEvent.submitter.id;
    submitter === "formatted" ? showFormatted(event) : generateCode(event);
  }

  async function showFormatted(event) {
    event.preventDefault();
    setIsLoading(true);
    document.querySelector("#response").innerText = "";

    const request = await fetch("/api/valorant/schedule?" +
      new URLSearchParams({
        channel: "$(channel)",
        type: 'text',
        id: id,
        series_id: seriesId,
        msg: msg
      }), {
      method: "GET",
    })

    const response = await request.text();
    console.log(response)
    document.querySelector('#response').innerText = response;
    setIsLoading(false);
  }

  /*   async function generateCode(event) {
      event.preventDefault();
      document.querySelector('#response-code').style.visibility = 'hidden';
      setTimeout(() => document.querySelector('#response-code').style.visibility = 'visible', 250);
  
      const responseCode = `.me $(touser) ► $\{customapi.${origin}/api/valorant/schedule?channel=$(channel)&id=${id}&msg="${msg}"\}`;
      document.querySelector('#response-code').innerText = responseCode;
    } */

  function copyToClipboard(event) {
    const copyText = document.getElementById(event.target.id);
    navigator.clipboard.writeText(copyText.innerText);

    const dialog = document.getElementById("popup");

    // Show the dialog next to the clicked element
    dialog.style.top = (event.pageY - 70) + "px";
    dialog.style.marginLeft = (event.pageX) + "px";
    dialog.show();

    // Close the dialog after 2 seconds
    setTimeout(() => dialog.close(), 2000);
  }


  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>League of Legends EWC Schedule</h1>
        <div>This endpoint shows the League of Legends games of the current day from EWC. Games and scores are updated automatically.</div>
        <h2>How to use this endpoint on StreamElements</h2>
        <div style={{ paddingTop: "10px" }}><code onClick={copyToClipboard} id="code" className="code">$(touser) ► $(customapi.{origin}/api/lol/schedule/ewc?channel=$(channel))</code></div>

        <h2>Optional parameters</h2>
        <div>There are 2 optional parameters you can use to customize the response:</div>
        <ul>
          <li><code className="blue" style={{ fontSize: "1rem" }}>&msg</code> - Message to be shown when there are no games. Available variables: <code>(league)</code>.</li>
          <li><code className="blue" style={{ fontSize: "1rem" }}>&type</code> - Type of response. Available values: <code>json / text</code></li>
        </ul>
        <h3>Example response:</h3>
        <Image src="/images/lol-ewc-schedule.png" width={619} height={581} alt="Clip Screenshot" />
        <dialog id="popup" style={{ backgroundColor: "var(--popup-color)" }}>Copied to clipboard</dialog>
      </main >
      <FooterComponent />
    </div >
  );
}
