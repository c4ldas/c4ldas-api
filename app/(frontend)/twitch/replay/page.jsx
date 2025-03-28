"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState, useEffect } from "react";
import Image from "next/image";


export default function TwitchClip({ params, searchParams }) {

  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);


  function copyToClipboard(event) {
    const copyText = document.querySelector("#code");
    navigator.clipboard.writeText(copyText.innerText);

    const dialog = document.getElementById("popup");

    // Show the dialog next to the clicked element
    dialog.style.top = (event.pageY - 70) + "px";
    dialog.style.marginLeft = (event.pageX) + "px";
    dialog.show();

    // Close the dialog after 2 seconds
    setTimeout(() => {
      dialog.close();
    }, 2000);
  }


  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>Twitch replay</h1>

        <h3>This endpoint generates a download link for your Twitch clip</h3>
        <div>Just copy the code below and replace <code>CLIP_ID</code> and <code>TWITCH_CHANNEL</code>for your actual clip ID and Twitch channel:</div>
        <br />

        <div style={{ paddingTop: "10px", cursor: "pointer" }}><code id="code" className="code" onClick={copyToClipboard}>{origin}/api/twitch/replay?type=text&channel=<span className="red">TWITCH_CHANNEL</span>&id=<span className="red">CLIP_ID</span></code></div>
        {/* 
        <h3>Example response:</h3>
        <Image src="/images/clip.png" width={440} height={740} alt="Clip Screenshot" />
        */}
        <dialog id="popup" style={{ backgroundColor: "var(--popup-color)" }}>Copied to clipboard</dialog>
      </main>
      <FooterComponent />
    </div >
  );
}
