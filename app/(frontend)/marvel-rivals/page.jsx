"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useEffect, useState } from "react";

export default function MarvelRivals() {

  const [origin, setOrigin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("pt");
  const [player, setPlayer] = useState();
  const [msg, setMsg] = useState(`(player) está (rank) com score (score) e (wins) vitórias.`);

  const lang = [
    { code: "pt", name: "Rank language: Português" },
    { code: "en", name: "Rank language: English" }
  ];

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);


  async function handleSubmit(e) {
    e.preventDefault();
    const submitter = e.nativeEvent.submitter.id;
    submitter === "formatted" ? showFormatted(e) : generateCode(e);
  }


  async function showFormatted(e) {
    e.preventDefault();
    setIsLoading(true);
    document.querySelector("#response").innerText = "";

    const request = await fetch("/api/marvel-rivals/rank?" +
      new URLSearchParams({
        channel: "$(channel)",
        type: 'json',
        msg: msg,
        player: player,
        lang: language
      }), {
      method: "GET",
    })

    const response = await request.json();
    document.querySelector('#response').innerText = response.message;
    setIsLoading(false);
  }


  async function generateCode(e) {
    e.preventDefault();
    document.querySelector('#response-code').style.visibility = 'hidden';
    setTimeout(() => {
      document.querySelector('#response-code').style.visibility = 'visible';
    }, 250);

    const responseCode = `.me $(sender) ► $\{customapi.${origin}/api/marvel-rivals/rank?channel=$(channel)&type=text&lang=${language}&player=${player}&msg="${msg}"\}`;
    document.querySelector('#response-code').innerText = responseCode;
  }


  function copyToClipboard(event) {
    const copyText = document.querySelector("#response-code");
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
        <h1 className="title">Marvel Rivals Rank</h1>
        <h2 className="subtitle">Enter your username to show your rank on Marvel Rivals. Click on "Generate chat code" to copy the code to your chat.</h2>

        <form id="form" onSubmit={handleSubmit} className="form" style={{ paddingTop: "10px" }}>
          <input type="text" id="playername" className="playername" placeholder="Player name" onChange={(e) => setPlayer(e.target.value)} required={true} />
          <select id="language" className="language" onChange={(e) => setLanguage(e.target.value)} required={false}>
            {lang.map((region, index) => (<option key={index} value={region.code}>{region.name}</option>))}
          </select>

          <input type="text" id="message" className="message" placeholder="Message: (player) está (rank) com score (score) e (wins) vitórias." onChange={(e) => setMsg(e.target.value)} />
          <h5 className="variables">Available variables: (player), (rank), (score), (wins)</h5>
          <input type="submit" id="formatted" className="formatted" value="Show formatted message" />
          <input type="submit" id="generate-code" className="generate-code" value="Generate chat code" />
          {isLoading && (<div id="loading" className="loading">Loading...</div>)}
          <div id="response" className="response"></div>
          <div id="response-code" className="response-code" onClick={copyToClipboard}></div>
        </form>
        <dialog id="popup" style={{ backgroundColor: "var(--popup-color)" }}>Copied to clipboard</dialog>

      </main>
      <FooterComponent />
    </div >
  );
}
