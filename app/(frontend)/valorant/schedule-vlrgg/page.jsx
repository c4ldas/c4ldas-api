"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState, useEffect } from "react";
import leagues from "@/app/lib/vlrgg_leagues";

export default function Valorant({ params, searchParams }) {

  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [leagueName, setLeagueName] = useState('challengers_br');
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

    const request = await fetch("/api/valorant/schedule/vlr?" +
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

    const responseCode = `.me $(touser) ► $\{customapi.${origin}/api/valorant/schedule/vlr?channel=$(channel)&league=${leagueName}&msg="${msg}"\}`;
    const formattedResponseCode = responseCode
      .replace(/\//g, '\u200B/')
      .replace(/&/g, '\u200B&')
      .replace(/\?/g, '\u200B?');
    /* document.querySelector('#response-code').innerText = responseCode; */
    document.querySelector('#response-code').innerText = formattedResponseCode;
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

  function handleLeagueChange(event) {
    if (event.target.value !== 'more_leagues') return setLeagueName(event.target.value);

    setAvailableLeagues(leagues.concat(moreLeagues));
    setLeagueName(moreLeagues[0].code);
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>Valorant Schedule</h1>
        <div>This endpoint shows the official Valorant games of the current day based on the selected league. Games and scores are updated automatically, but can take some minutes to reflect.</div>
        <h3>How to use this endpoint on Streamelements</h3>
        <div style={{ paddingTop: "10px" }}><code onClick={copyToClipboard} id="code" className="code">$(touser) ► $(customapi.{origin}/api/valorant/schedule/vlr?channel=$(channel)&league=<span className="red">LEAGUE_NAME</span>)</code></div>

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
                <td>{league.displayName}</td>
              </tr>
            ))}
          </tbody>
        </table>


        <h2>Test the command</h2>
        <div>Select the league you want to use and click on <span className="blue">Show response</span> button to check the response:</div>
        <form id="form" onSubmit={handleSubmit} className="form" style={{ paddingTop: "10px" }}>

          <select id="region" className="regionName" onChange={handleLeagueChange} value={leagueName}>
            {availableLeagues.map((league) => (
              <option key={league.code} value={league.code}>{league.displayName}</option>
            ))}
            {(availableLeagues.length == leagues.length) /* && <option value="more_leagues">Load more leagues...</option> */}
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
