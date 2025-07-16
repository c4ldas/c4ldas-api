"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState, useEffect } from "react";

const leagues = [
  { code: "first_stand", league_name: "First Stand" },
  { code: "msi", league_name: "MSI" },
  { code: "worlds", league_name: "Worlds" },
  { code: "lta_north", league_name: "LTA North" },
  { code: "lta_south", league_name: "LTA South" },
  { code: "lck", league_name: "LCK" },
  { code: "lpl", league_name: "LPL" },
  { code: "lec", league_name: "LEC" },
  { code: "lcp", league_name: "LCP" },
  { code: "circuito_desafiante", league_name: "Circuito Desafiante" },
]

const moreLeagues = [
  { code: "circuito_desafiante", league_name: "Circuito Desafiante" },
]

export default function LoLSchedule({ params, searchParams }) {

  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [leagueName, setLeagueName] = useState('lta_south');
  const [availableLeagues, setAvailableLeagues] = useState(leagues);
  const [msg, setMsg] = useState("No games for (league) today");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const submitter = event.nativeEvent.submitter.id;
    submitter === "formatted" ? showFormatted(event) : generateCode(event);
  }

  async function showFormatted(event) {
    event.preventDefault();
    setIsLoading(true);
    document.querySelector("#response").innerText = "";

    const request = await fetch("/api/lol/schedule?" +
      new URLSearchParams({
        channel: "$(channel)",
        type: 'text',
        league: leagueName,
        msg: msg
      }), {
      method: "GET",
    })

    const response = await request.text();
    console.log(response)
    document.querySelector('#response').innerText = response;
    setIsLoading(false);
  }

  async function generateCode(event) {
    event.preventDefault();
    document.querySelector('#response-code').style.visibility = 'hidden';
    setTimeout(() => document.querySelector('#response-code').style.visibility = 'visible', 250);

    const responseCode = `.me $(touser) ► $\{customapi.${origin}/api/lol/schedule?channel=$(channel)&league=${leagueName}&msg="${msg}"\}`;
    document.querySelector('#response-code').innerText = responseCode;
  }

  function copyToClipboard(event) {
    const copyText = document.getElementById(event.target.id);
    navigator.clipboard.writeText(copyText.innerText);

    const dialog = document.getElementById("popup");

    // Show the dialog next to the clicked element
    dialog.style.top = (event.pageY - 70) + "px";
    dialog.style.marginLeft = (event.pageX) + "px";
    dialog.show();

    // Close the dialog after 2 seconds
    setTimeout(() => dialog.close(), 2000);
  }

  function collapseMenu(event) {
    const element = event.currentTarget;
    element.classList.toggle("active");
    var item = element.nextElementSibling;
    if (item.style.maxHeight) {
      item.style.maxHeight = null;
    } else {
      item.style.maxHeight = item.scrollHeight + "px";
    }
  }

  function handleLeagueChange(event) {
    if (event.target.value !== 'more_leagues') return setLeagueName(event.target.value);

    setAvailableLeagues(leagues.concat(moreLeagues));
    setLeagueName(moreLeagues[0].code);
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>League of Legends Schedule (under development)</h1>
        <div>This endpoint shows the official League of Legends games of the current day based on the selected league. Games and scores are updated automatically, but can take some minutes to reflect.</div>
        <h3>How to use this endpoint on Streamelements</h3>
        <div style={{ paddingTop: "10px" }}><code onClick={copyToClipboard} id="code" className="code">$(touser) ► $(customapi.{origin}/api/lol/schedule?channel=$(channel)&league=<span className="red">LEAGUE_NAME</span>)</code></div>

        {/* Leagues available */}
        <h3>Leagues available:</h3>
        <table style={{ textAlign: "center", padding: "8px", border: "1px solid #ddd" }}>
          <tbody>
            <tr>
              <th>Code</th>
              <th>League Name</th>
            </tr>
            {leagues.map((league, index) => (
              <tr key={index}>
                <td className="region">{league.code}</td>
                <td>{league.league_name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Load more leagues */}
        <h3>More leagues (click to show):</h3>
        <h3 id="toggle-reset" className="toggle" onClick={collapseMenu}>Show more leagues:</h3>
        <div id="collapsible-reset" className="collapsible">
          <table style={{ textAlign: "center", padding: "8px", border: "1px solid #ddd" }}>
            <tbody>
              <tr>
                <th>Code</th>
                <th>League Name</th>
              </tr>
              {moreLeagues.map((league) => (
                <tr key={league.code}>
                  <td className="region">{league.code}</td>
                  <td>{league.league_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Test the command</h2>
        <div>Select the league you want to use and click on <span className="blue">Show response</span> button to check the response:</div>
        <form id="form" onSubmit={handleSubmit} className="form" style={{ paddingTop: "10px" }}>

          <select id="region" className="regionName" onChange={handleLeagueChange} value={leagueName}>
            {availableLeagues.map((league) => (
              <option key={league.code} value={league.code}>{league.league_name}</option>
            ))}
            {(availableLeagues.length == leagues.length) && <option value="more_leagues">Load more leagues...</option>}
          </select>


          <input type="text" id="message" className="message" placeholder="Message: No games for (league) today" onChange={(e) => { setMsg(e.target.value) }} />
          <h5 className="variables">Optional: Type a message to be shown when there are no games. Available variables: (league)</h5>
          <input type="submit" id="formatted" className="formatted" value="Show response" />
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
