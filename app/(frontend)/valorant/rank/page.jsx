"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState, useEffect } from "react";
import { validRegions } from "@/app/lib/valorant_rank";

export default function Valorant({ params, searchParams }) {

  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [id, setId] = useState('');
  const [tag, setTag] = useState('');
  const [player, setPlayer] = useState('');
  const [regionName, setRegionName] = useState('br');
  const [msg, setMsg] = useState(`(player) está (rank) com (pontos) pontos`);

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

    const request = await fetch("/api/valorant/rank?" +
      new URLSearchParams({
        channel: "$(channel)",
        type: 'json',
        msg: msg,
        ...(id ? { id: id } : { player: player, tag: tag, region: regionName }) // If id value exists, only send id, otherwise, send player and tag values
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
    setTimeout(() => document.querySelector('#response-code').style.visibility = 'visible', 250);

    const values = id ? `id=${id}` : `player=${player}&tag=${tag}&region=${regionName}`;
    const responseCode = `.me $(sender) ► $\{customapi.${origin}/api/valorant/rank?channel=$(channel)&type=text&${values}&msg="${msg}"\}`;
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
    setTimeout(() => dialog.close(), 2000);
  }


  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>Valorant Rank</h1>
        <h3>How to use this endpoint on Streamelements</h3>
        <div style={{ paddingTop: "10px" }}><code className="code">$(touser) ► $(customapi.{origin}/api/valorant/rank?channel=$(channel)&type=text&region=<span className="red">REGION</span>&player=<span className="red">PLAYERNAME</span>&tag=<span className="red">TAG</span>&msg=&quot;<span className="red">MESSAGE</span>&quot;)</code></div>

        <div style={{ paddingTop: "10px" }}><code className="code">$(touser) ► $(customapi.{origin}/api/valorant/rank?channel=$(channel)&type=text&id=<span className="red">ID</span>&msg=&quot;<span className="red">MESSAGE</span>&quot;)</code></div>

        <h3>Example:</h3>
        <div><strong>Player: </strong>LOUD Coreano</div>
        <div><strong>Tag: </strong>LLL</div>

        <h3>Parameters:</h3>

        <div>MESSAGE is a custom message to be sent on chat and it is optional. If ommited, the default message is &quot;<span className="blue">(player) está (rank) com (pontos) pontos.</span>&quot;</div>
        <div>MESSAGE text can contain the following variables: (player), (pontos), (rank).</div>
        <div>If the rank is Immortal/Radiant, you can also use (posicao) and (vitorias) to display your position and number of victories, respectively.</div>
        <div>If no message is added, the following default message will be displayed (using the example user):</div>
        <h4><div className="blue">LOUD Coreano tem 213 pontos e tá Imortal 2</div></h4>

        <h2>Configure your message</h2>

        <div>You can use the box below to configure your chat message.</div>

        <form id="form" onSubmit={handleSubmit} className="form" style={{ paddingTop: "10px" }}>
          <input type="text" id="playername" className="playername" placeholder="Playername" onChange={(e) => { setPlayer(e.target.value) }} disabled={id} required={!id} />
          <input type="text" id="tagline" className="tagline" placeholder="Tag" onChange={(e) => { setTag(e.target.value) }} disabled={id} required={!id} />
          <input type="text" id="puuid" className="puuid" placeholder="ID" onChange={(e) => { setId(e.target.value) }} disabled={player || tag} required={!player && !tag} />
          <select id="region" className="regionName" onChange={(e) => { setRegionName(e.target.value) }} value={regionName} disabled={id}>
            {validRegions.map((region) => (
              <option key={region.code} value={region.code}>{region.region_name}</option>
            ))}
          </select>

          <input type="text" id="message" className="message" placeholder="Message: (player) está (rank) com (pontos) pontos" onChange={(e) => { setMsg(e.target.value) }} />
          <h5 className="variables">Available variables: (player) (rank) (pontos)</h5>
          <h5 className="radiant">Immortal/Radiant variables: (player) (rank) (pontos) (posicao) (vitorias)</h5>
          <input type="submit" id="formatted" className="formatted" value="Show formatted message" />
          <input type="submit" id="generate-code" className="generate-code" value="Generate chat code" />
          {isLoading && (<div id="loading" className="loading">Loading...</div>)}
          <div id="response" className="response"></div>
          <div id="response-code" className="response-code" onClick={copyToClipboard}></div>
        </form>
        <dialog id="popup" style={{ backgroundColor: "var(--popup-color)" }}>Copied to clipboard</dialog>
      </main >
      <FooterComponent />
    </div >
  );
}
