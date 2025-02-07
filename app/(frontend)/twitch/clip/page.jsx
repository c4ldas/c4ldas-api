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
        <h1>Twitch clip</h1>

        <h3>How to use this endpoint on Streamelements</h3>
        <div>Just copy the code below to the command you want to use (i.e.: <code>!clip</code>):</div>
        <br />

        <div style={{ paddingTop: "10px", cursor: "pointer" }}><code id="code" className="code" onClick={copyToClipboard}>$(touser) ► $(customapi.{origin}/api/twitch/clip?type=text&channel=$(channel))</code></div>
        <h3>Example response:</h3>
        <Image src="/images/clip.png" width={440} height={740} alt="Clip Screenshot" />

        <dialog id="popup" style={{ backgroundColor: "var(--popup-color)" }}>Copied to clipboard</dialog>
      </main>
      <FooterComponent />
    </div >
  );
}

