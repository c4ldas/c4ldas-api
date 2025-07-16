"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState, useEffect } from "react";

const regions = [
  { code: "br1", region_name: "Brazil (BR)" },
  { code: "eun1", region_name: "Europe Nordic & East (EUW)" },
  { code: "euw1", region_name: "Europe West (EUW)" },
  { code: "jp1", region_name: "Japan (JP)" },
  { code: "kr", region_name: "Korea (KR)" },
  { code: "la1", region_name: "Latin America North (LA1)" },
  { code: "la2", region_name: "Latin America South (LA2)" },
  { code: "me1", region_name: "Middle East (ME1)" },
  { code: "na1", region_name: "North America (NA)" },
  { code: "oc1", region_name: "Oceania (OC)" },
  { code: "ph2", region_name: "Philippines (PH)" },
  { code: "ru", region_name: "Russia (RU)" },
  { code: "sg2", region_name: "Singapore (SG)" },
  { code: "th2", region_name: "Thailand (TH)" },
  { code: "tr1", region_name: "Turkey (TR)" },
  { code: "tw2", region_name: "Taiwan (TW)" },
  { code: "vn2", region_name: "Vietnam (VN)" }
]

export default function LeagueOfLegends({ params, searchParams }) {

  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [region, setRegion] = useState('br1');
  const [tag, setTag] = useState('');
  const [player, setPlayer] = useState('');
  const [msg, setMsg] = useState(`(player): (rank) - (points) points`);

  async function handleSubmit(e) {
    e.preventDefault();
    const submitter = e.nativeEvent.submitter.id;
    submitter === "formatted" ? showFormatted(e) : generateCode(e);
  }

  async function showFormatted(e) {
    e.preventDefault();
    setIsLoading(true);
    document.querySelector("#response").innerText = "";

    const request = await fetch("/api/lol/rank?" +
      new URLSearchParams({
        channel: "$(channel)",
        type: 'json',
        msg: msg,
        player: player,
        tag: tag,
        region: region
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

    const values = `player=${player}&tag=${tag}&region=${region}`;
    const responseCode = `.me $(sender) ► $\{customapi.${origin}/api/lol/rank?channel=$(channel)&type=text&${values}&msg="${msg}"\}`;
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
        <h1>League of Legends Rank</h1>
        <h3>How to use this endpoint on Streamelements</h3>
        <div style={{ paddingTop: "10px" }}><code className="code">$(touser) ► $(customapi.{origin}/api/lol/rank?channel=$(channel)&region=<span className="red">REGION</span>&player=<span className="red">PLAYERNAME</span>&tag=<span className="red">TAG</span>&type=text)</code></div>

        <h3>Regions available:</h3>
        <table style={{ textAlign: "center", padding: "8px", border: "1px solid #ddd" }}>
          <tbody>
            <tr>
              <th>Code</th>
              <th>Region</th>
            </tr>
            {regions.map((region, index) => (
              <tr key={index}>
                <td className="region">{region.code}</td>
                <td>{region.region_name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Configure your message</h2>
        <div>You can use the box below to configure your chat message.</div>
        <form id="form" onSubmit={handleSubmit} className="form" style={{ paddingTop: "10px" }}>
          <input type="text" id="playername" className="playername" placeholder="Playername" onChange={(e) => { setPlayer(e.target.value) }} required={true} />
          <input type="text" id="tagline" className="tagline" placeholder="Tag" onChange={(e) => { setTag(e.target.value) }} required={true} />
          <select id="region" className="regionName" onChange={(e) => { setRegion(e.target.value), console.log("onChange:", e.target.value) }} required={true}>
            {regions.map((region, index) => (<option key={index} value={region.code}>{region.region_name}</option>))}
          </select>

          <input type="text" id="message" className="message" placeholder="Message: (player): (rank) - (points) points" onChange={(e) => { setMsg(e.target.value) }} />
          <h5 className="variables">Available variables: (player), (rank), (points), (wins), (losses)</h5>
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

