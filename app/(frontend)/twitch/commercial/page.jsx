"use client"

import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

export default function Twitch({ _, searchParams }) {
  const error = searchParams.error;

  const [cookie, setCookie] = useState({});
  const [origin, setOrigin] = useState();
  useEffect(() => {
    setOrigin(window.location.origin);
    setCookie(getCookies());
  }, []);


  const predictionCommand = `.me $(sender) ► $(customapi.${origin}/api/twitch/prediction`
  const baseURL = 'https://id.twitch.tv/oauth2/authorize?'
  const urlSearchParams = new URLSearchParams({
    response_type: 'code',
    client_id: '1mhvnqfp2xtswwqz1p8ol3doqm4t26',
    scope: 'channel:edit:commercial channel:read:ads channel:manage:ads',
    redirect_uri: `${origin}/api/twitch/callback`,
    force_verify: false
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
      const request = await fetch("/api/twitch/logout", { "method": "POST" });
      const response = await request.json();
      dialogTitle.innerHTML = `${response.message}.<br/> Redirecting back to home page...`;
    }, 1500);

    setTimeout(() => {
      window.location.assign("/twitch");
    }, 3000);
  }

  function copyCode(event) {
    const dialog = document.getElementById("copy-success");
    const command = event.target.getAttribute("datacommand");
    navigator.clipboard.writeText(command);

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
        <h1 className="title">Twitch Commercial (ads)</h1>
        {!cookie.twitch_id && (
          <>
            <p>
              With this integration, you can configure your Twitch commercial (ads) to be run at specified times.
            </p>
            <p>Click on the button below to login with Twitch.</p>
            <a href={baseURL + urlSearchParams.toString()}>
              <button type="submit">Login with Twitch</button>
            </a>
          </>
        )}

        {cookie.twitch_id && (
          <>
            <p><button id="remove-integration" type="submit" onClick={openDialog}>Remove integration</button></p>
            <p><strong>Channel name:</strong> {cookie.twitch_username} </p>
            <p><strong>Channel ID:</strong> {cookie.twitch_id}</p>
            <p><strong>Code (click to copy):</strong> <span style={{ cursor: "pointer" }} onClick={copyCode} datacommand={cookie.twitch_code}>••••••••••••</span></p>

            <div>
              <p className="red"><strong>- Keep your code safe, otherwise other users could use it to manage commercials on your channel.</strong></p>
            </div>

            {/* <!-- pop-up dialog box, containing a form --> */}
            <dialog id="copy-success" style={{ visibility: "visible", marginLeft: "10px", backgroundColor: "var(--popup-color)" }}>Code copied to clipboard</dialog>
            <dialog id="dialog">
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
        {error && <p>Error: {error}</p>}
      </main>
      <FooterComponent />
    </div >
  );
}
