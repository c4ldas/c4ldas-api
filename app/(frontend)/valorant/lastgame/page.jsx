"use client"

import { useState, useEffect } from 'react';
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { validRegions } from "@/app/lib/valorant_rank";

// const id = "9fe721ed-4a11-5549-8387-e2d3d5ea76d9"; // Danny Jones
// const id = "7cd4994f-3255-5575-b8a2-968f428bf9a1"; // Otsuka
// const id = "10726a29-ce65-5471-a794-32733f309a16"; // Coreano
// const id = "19071032-691d-55a3-8529-4fbbbd867eaf" // Aprendendo

export default function Valorant({ searchParams }) {

  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(searchParams.id || '');
  const [player, setPlayer] = useState(searchParams.player || '');
  const [tag, setTag] = useState(searchParams.tag || '');
  const [regionName, setRegionName] = useState(searchParams.region || 'br');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);


  // Future use
  /*
    let colour;
    if (player?.outcome == "Draw") {
      colour = "rgba(128, 128, 128, 0.60)"; // black 
    }
  
    if (player?.outcome == "Victory") {
      colour = "rgba(0, 64, 0, 0.60)"; // green
    }
  
    if (player?.outcome == "Defeat") {
      colour = "rgba(64, 0, 0, 0.90)"; // red
    }
      
    const style = {
      box: {
        display: "block",
        height: "290px",
        background: `url('${player?.agent_portrait || ''}') 85px top no-repeat,
                        linear-gradient(90deg, rgba(0, 0, 0, 0.90) 20%, ${colour} 80%) center center / 100% 100% no-repeat`,
        backgroundSize: "100%",
        borderRadius: "10px",
        minHeight: "150px",
        minWidth: "500px",
        maxWidth: "500px",
      },
  
      text: {
        minWidth: "55%",
        maxWidth: "55%",
        height: "100%",
        padding: "5% 0px 5% 20px", // top, right, bottom, left
        color: "white",
      },
  
      title: {
        fontWeight: "bold",
        fontSize: "1.4rem",
      },
  
      infos: {
        color: "gray",
        fontWeight: "bold",
        alignItems: "space-around",
      },
  
      light: {
        color: "white",
        fontWeight: "lighter",
        paddingRight: "0.5rem",
      }
    }

  */

  async function handleSubmit(e) {
    e.preventDefault();
    const submitter = e.nativeEvent.submitter.id;
    submitter === "formatted" ? showFormatted(e) : generateCode(e);
  }


  async function showFormatted(e) {
    e.preventDefault();
    setIsLoading(true);
    document.querySelector("#response").innerText = "";

    const request = await fetch("/api/valorant/lastgame?" +
      new URLSearchParams({
        channel: "$(channel)",
        type: 'json',
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
    const responseCode = `.me $(sender) ► $\{customapi.${origin}/api/valorant/lastgame?channel=$(channel)&type=text&${values}"\}`;
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
        <h2>Last Game Status</h2>

        <form id="form" onSubmit={handleSubmit} className="form" style={{ paddingTop: "10px" }}>
          <input type="text" id="playername" className="playername" placeholder="Player Name" onChange={(e) => { setPlayer(e.target.value) }} disabled={id} required={!id} />
          <input type="text" id="tagline" className="tagline" placeholder="Tag" onChange={(e) => { setTag(e.target.value) }} disabled={id} required={!id} />
          <input type="text" id="puuid" className="puuid" placeholder="ID" onChange={(e) => { setId(e.target.value) }} disabled={player || tag} required={!player && !tag} />
          <select id="region" className="regionName" onChange={(e) => { setRegionName(e.target.value) }} value={regionName}>
            {validRegions.map((region) => (
              <option key={region.code} value={region.code}>{region.region_name}</option>
            ))}
          </select>
          <input type="submit" id="formatted" className="formatted" value="Show last game" />
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
