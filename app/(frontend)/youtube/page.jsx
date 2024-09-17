"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState } from "react";
import Image from "next/image";

export default function Youtube({ params, searchParams }) {
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    document.querySelector('#response').style.visibility = "hidden";

    const request = await fetch("/api/youtube/channel?" +
      new URLSearchParams({
        username: handle,
        type: 'json'
      }), {
      method: "GET",
    })

    const response = await request.json();
    document.querySelector('#youtube-url').href = `https://youtube.com/channel/${response.channelId}`;
    document.querySelector('#youtube-thumbnail').src = response.thumbnails.medium.url;
    document.querySelector('#youtube-thumbnail').width = response.thumbnails.medium.width;
    document.querySelector('#youtube-thumbnail').height = response.thumbnails.medium.height;
    document.querySelector('#youtube-display-name').innerText = response.title;
    document.querySelector('#youtube-id').innerText = response.channelId;
    document.querySelector('#youtube-created-at').innerText = response.publishedAt?.split("T")[0] || "N/A";
    document.querySelector('#response').style.visibility = "visible";
    setIsLoading(false);
  }

  function copyToClipboard(event) {
    const copyText = document.querySelector("#youtube-id");
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
        <h1>Youtube - Find your Channel ID</h1>

        <form id="form" onSubmit={handleSubmit} className="form-inline" style={{ paddingTop: "10px" }}>
          <input style={{ marginRight: "10px" }} type="text" id="handle" className="youtube-handle" placeholder="Channel handle with @" onChange={(e) => { setHandle(e.target.value) }} required={true} />
          <input type="submit" id="formatted" className="formatted" value="Get Channel Info" />
          {isLoading && (<div id="loading" className="loading">Loading...</div>)}
          <div id="response" className="response" style={{ visibility: "hidden" }}>
            <h2><strong>Channel Information:</strong></h2>
            <a href="#" id="youtube-url" target="_blank"><Image id="youtube-thumbnail" style={{ borderRadius: "50%" }} alt="youtube-thumbnail" src="/images/youtube.svg" width={1} height={1}></Image></a>
            <div><strong>Display name: </strong><span id="youtube-display-name"></span></div>
            <div><strong>ID (click to copy): </strong><span id="youtube-id" onClick={copyToClipboard} style={{ cursor: "pointer" }}></span></div>
            <div><strong>Created at: </strong><span id="youtube-created-at"></span></div>
          </div>
        </form>
        <dialog id="popup" style={{ backgroundColor: "var(--popup-color)" }}>Copied to clipboard</dialog>
      </main>
      <FooterComponent />
    </div >
  );
}
