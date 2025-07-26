"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoLScheduleEWC({ params, searchParams }) {

  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  function copyToClipboard(event) {
    const copyText = event.currentTarget.innerText;
    // const copyText = document.getElementById(event.target.id);
    navigator.clipboard.writeText(copyText);

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
