"use client"

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

export default function Twitch({ _, searchParams }) {
  const error = searchParams.error;
  // const path = usePathname();

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
    scope: 'channel:manage:predictions',
    redirect_uri: `${origin}/api/twitch/callback`,
    force_verify: false
  });

  async function openDialog() {
    const dialog = document.querySelector("#dialog");
    const main = document.querySelector("#main").getBoundingClientRect();;
    // dialog.style.marginTop = (main.height) + "px";
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
    const position = event.target.getBoundingClientRect();
    navigator.clipboard.writeText(cookie.code);

    // Show the dialog next to the clicked element
    dialog.style.top = (position.top - position.height) + "px";
    dialog.style.marginLeft = (event.clientX + position.width) + "px";
    dialog.show();

    // Close the dialog after 2 seconds
    setTimeout(() => {
      dialog.close();
    }, 2000);
  }

  function copyPrediction(event) {
    const dialog = document.getElementById("copy-success");
    const position = event.target.getBoundingClientRect();
    const command = event.target.getAttribute("datacommand");
    navigator.clipboard.writeText(command);

    // Show the dialog next to the clicked element
    dialog.style.top = (position.top - position.height) + "px";
    dialog.style.marginLeft = (event.clientX) + "px";
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
        <h1 className="title">Twitch Prediction</h1>
        {!cookie.id && (
          <>
            <p>
              With this integration, you can create predictions on Twitch using chat commands.
              So instead of opening the Twitch prediction panel, you can just type the command <code>!prediction</code> and the prediction will be created directly with the options you choose.
            </p>
            <p>Click on the button below to login with Twitch.</p>
            <a href={baseURL + urlSearchParams.toString()}>
              <button type="submit">Login with Twitch</button>
            </a>
          </>
        )}

        {cookie.id && (
          <>
            <p><button id="remove-integration" type="submit" onClick={openDialog}>Remove integration</button></p>
            <p><strong>Channel name:</strong> {cookie.username} </p>
            <p><strong>Channel ID:</strong> {cookie.id}</p>
            <p><strong>Code (click to copy):</strong> <span style={{ cursor: "pointer" }} onClick={copyCode} >••••••••••••</span></p>
            <dialog id="copy-success" style={{ visibility: "visible", marginLeft: "10px" }}>Code copied to clipboard</dialog>
            <div>
              <p className="red"><strong>- Keep your code safe, otherwise other users could use it to open and close predictions on your account.</strong></p>
              <p className="red"><strong>- Use Streamelements dashboard to create the commands, do not copy it on chat.</strong></p>
            </div>
            <div style={{ padding: "2% 0%" }}>
              <p><strong>Create prediction (click to copy):</strong></p>
              <code
                style={{ border: "1px solid black", cursor: "pointer", padding: "10px" }}
                onClick={copyPrediction}
                datacommand={`${predictionCommand}/create/${cookie.code}/?channel=$(channel)&option1=$(1)&option2=$(2)&question=$(queryescape $(3:|Quem ganha esse mapa?)))`}
              >
                .me $(sender) ► $(customapi.{origin}/api/twitch/prediction/create/••••••••••••/...)
              </code>
            </div>

            <div style={{ padding: "2% 0%" }}>
              <p><strong>Close prediction (click to copy):</strong></p>
              <code
                style={{ border: "1px solid black", cursor: "pointer", padding: "10px" }}
                onClick={copyPrediction}
                datacommand={`${predictionCommand}/close/${cookie.code}/?channel=$(channel)&winner=$(1))`}
              >
                .me $(sender) ► $(customapi.{origin}/api/twitch/prediction/close/••••••••••••/...)
              </code>
            </div>

            <div style={{ padding: "2% 0%" }}>
              <p><strong>Cancel prediction (click to copy):</strong></p>
              <code
                style={{ border: "1px solid black", cursor: "pointer", padding: "10px" }}
                onClick={copyPrediction}
                datacommand={`${predictionCommand}/cancel/${cookie.code}/?channel=$(channel))`}
              >
                .me $(sender) ► $(customapi.{origin}/api/twitch/prediction/cancel/••••••••••••/...)
              </code>
            </div>

            <h2>How to use it:</h2>
            <h3>Create a prediction:</h3>
            <span style={{ border: "1px solid black", padding: "5px" }}>!prediction option1 option2</span>
            <h3>Close prediction:</h3>
            <span style={{ border: "1px solid black", padding: "5px" }}>!close winnerOption</span>
            <h3>Cancel prediction:</h3>
            <span style={{ border: "1px solid black", padding: "5px" }}>!cancel</span>

            {/* <!-- pop-up dialog box, containing a form --> */}
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
      </main>
      <FooterComponent />
    </div >
  );
}
