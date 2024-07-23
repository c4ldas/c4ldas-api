"use client"

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

export default function Twitch({ _, searchParams }) {
  const error = searchParams.error;
  const path = usePathname();

  const [cookie, setCookie] = useState({});
  const [origin, setOrigin] = useState();
  useEffect(() => {
    setOrigin(window.location.origin);
    setCookie(getCookies());
  }, []);

  // console.log("cookie:", cookie);

  const baseURL = 'https://id.twitch.tv/oauth2/authorize?'
  const urlSearchParams = new URLSearchParams({
    response_type: 'code',
    client_id: '1mhvnqfp2xtswwqz1p8ol3doqm4t26',
    scope: 'channel:manage:predictions',
    redirect_uri: `${origin}/api/twitch/callback`,
    force_verify: false
  });

  async function openDialog() {
    const dialog = document.querySelector("#dialog");
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

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>This is the {path} page</h1>
        {cookie.id && (
          <>
            <p><strong>Channel name:</strong> {cookie.username} </p>
            <p><strong>Channel ID:</strong> {cookie.id}</p>
            <details>
              <summary>Click to show code:</summary>
              <p><strong>{cookie.code}</strong></p>
            </details>
            <p><button id="remove-integration" type="submit" onClick={openDialog}>Remove integration</button></p>

            { /* <!-- pop-up dialog box, containing a form --> */}
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
        {error && <p>Error: {error}</p>}
        {!cookie.id && (
          <a href={baseURL + urlSearchParams.toString()}>
            <button type="submit">Login with Twitch</button>
          </a>
        )}
      </main>
      <FooterComponent />
    </div >
  );
}
