"use client"

import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import SpotifyNowPlaying from "@/app/components/Spotify";
import "@/public/css/spotify.css";

export default function Spotify({ _, searchParams }) {
  const error = searchParams.error;

  const [cookie, setCookie] = useState({});
  const [origin, setOrigin] = useState();
  useEffect(() => {
    setOrigin(window.location.origin);
    setCookie(getCookies());
  }, []);


  const baseURL = 'https://accounts.spotify.com/authorize?'
  const urlSearchParams = new URLSearchParams({
    response_type: 'code',
    client_id: '70b6001beb514083889ab4905dbf1384',
    scope: 'user-read-currently-playing user-read-playback-state',
    redirect_uri: `${origin}/api/spotify/callback`,
    show_dialog: true
  });

  async function openDialog() {
    const dialog = document.querySelector("#dialog");
    dialog.style.marginLeft = "auto";
    dialog.showModal();
  }

  function closeDialog() {
    const dialog = document.querySelector("#dialog");
    dialog.close();
  }

  async function confirmRemoval() {
    const dialogTitle = document.querySelector("#dialog-title");
    const submit = document.querySelector("#submit");
    const cancel = document.querySelector("#cancel");
    dialogTitle.innerText = "Removing integration, please wait...";
    submit.style.display = "none";
    cancel.style.display = "none";

    setTimeout(async () => {
      const request = await fetch("/api/spotify/logout", { "method": "POST" });
      const response = await request.json();
      dialogTitle.innerHTML = `${response.message}.<br/> Redirecting back to home page...`;
    }, 1500);

    setTimeout(() => {
      window.location.assign("/spotify");
    }, 3000);
  }

  function copyCode(event) {
    console.log(event.target.textContent);
    const dialog = document.getElementById("copy-success");
    navigator.clipboard.writeText(event.target.textContent);

    // Show the dialog next to the clicked element
    dialog.style.top = (event.pageY - 70) + "px";
    dialog.style.marginLeft = (event.pageX) + "px";
    // dialog.style.top = (event.clientY - 70) + "px";
    // dialog.style.marginLeft = (event.clientX + 50) + "px";
    dialog.show();

    // Close the dialog after 2 seconds
    setTimeout(() => {
      dialog.close();
    }, 2000);
  }

  return (
    <div className="container">
      <Header />
      <main id="main" className="main block">
        <h1 className="title">Now Playing Song</h1>
        {cookie.spotify_id && (
          <>
            <p><button id="remove-integration" type="submit" onClick={openDialog}>Remove integration</button></p>
            <p><strong>Display name:</strong> {cookie.spotify_display_name} </p>
            <p><strong>ID:</strong> {cookie.spotify_id}</p>

            <h3>Widget URL (click to copy)</h3>
            <code style={{ border: "1px solid black", padding: "10px", cursor: "pointer" }} onClick={copyCode}>{origin}/spotify/musica/{cookie.spotify_id}</code>

            <h3>Preview (Open Spotify to see the preview):</h3>
            <SpotifyNowPlaying userId={cookie.spotify_id} />

            {/* 
            <h3>Create command (click to copy):</h3>
            <code
              style={{ border: "1px solid black", cursor: "pointer", padding: "10px" }}
              onClick={copyCode}
              datacommand={`.me $(sender) ► $(customapi.${origin}/api/spotify/musica/${cookie.spotify_id})`}
            >
              .me $(sender) ► $(customapi.{origin}/api/spotify/musica/...)
            </code>

            <h3>How to use it:</h3>
            <code style={{ border: "1px solid black", padding: "10px" }}>!musica</code>

            <h3>Chat response:</h3>
            <code style={{ border: "1px solid black", padding: "10px" }}>Rick Astley - Never Gonna Give You Up</code>
            */}

            {/* <!-- pop-up dialog box, containing a form --> */}
            <dialog id="copy-success" style={{ visibility: "visible", marginLeft: "10px", backgroundColor: "var(--popup-color)" }}>Code copied to clipboard</dialog>
            <dialog id="dialog" className="dialog">
              <div id="dialog-title">
                Are you sure you want to remove the integration?<br />
                You can re-add it at any time.
              </div>
              <div id="dialog-buttons">
                <button id="submit" type="submit" onClick={confirmRemoval}>Confirm</button>
                <button id="cancel" type="reset" onClick={closeDialog}>Cancel</button>
              </div>
            </dialog>

          </>
        )}

        {!cookie.spotify_id && (
          <>
            <p>
              With this integration, you can generate a widget to show which song is currently playing.
              {/* With this integration, you can show on chat which song is currently playing on Spotify. */}
            </p>
            <p>Click on the button below to login with Spotify.</p>
            <a href={baseURL + urlSearchParams.toString()}>
              <button type="submit">Login with Spotify</button>
            </a>
          </>
        )}
        {error && <p>Error: {error}</p>}
        <p>By using "Now Playing Song" widget, you agree with <a href="/terms/end-user-agreement">End user agreement</a> and <a href="/terms/privacy-policy">Privacy policy</a></p>
      </main>
      <FooterComponent />
    </div >
  );
}
