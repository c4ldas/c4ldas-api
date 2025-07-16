/**
* This is the future front page for schedule
* The old page will be removed soon in the future and replaced with this one
* This page uses vlr.gg as a data source
* Currently, there are 3 endpoints for schedule:
* - /valorant/schedule
* - /valorant/schedule/vlr
* - /valorant/schedule/vlr.gg
* The idea is to move /api/valorant/schedule/vlr.gg to /api/valorant/schedule and use it for all requests
* So, in the future, only one endpoint will be used (/api/valorant/schedule) and it will gather data from vlr.gg website
* 
* TO DO:  
* - Check how many people are using /api/valorant/schedule endpoint
* - If not many (or none at all), just put the /vlr.gg code directly on /api/valorant/schedule
* - Move the endpoint /api/valorant/schedule/vlr.gg to /api/valorant/schedule
* - Remove the page /valorant/schedule-vlrgg
* - Remove page.jsx from this folder
* - Rename this file to page.jsx
* - Add a response (for a limited time) on /api/valorant/schedule/vlr.gg to use /api/valorant/schedule instead (just remove the /vlr.gg from the URL)
* - Remove any /api/valorant/schedule/vlr.gg from the this page (lines 46, 68, 95, and 102) and use /api/valorant/schedule
*
* Future TO DO:
* - Remove the route /api/valorant/schedule/vlr and /api/valorant/schedule/vlr.gg
*/

"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState, useEffect } from "react";

export default function ValorantSchedule({ params, searchParams }) {

  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [id, setId] = useState('');
  const [seriesId, setSeriesId] = useState('all');
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

    const request = await fetch("/api/valorant/schedule?" +
      new URLSearchParams({
        channel: "$(channel)",
        type: 'text',
        id: id,
        series_id: seriesId,
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

    const responseCode = `.me $(touser) ► $\{customapi.${origin}/api/valorant/schedule?channel=$(channel)&id=${id}&msg="${msg}"\}`;
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


  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>Valorant Games Schedule</h1>
        <div>This endpoint shows the Valorant games of the current day (obtained from https://vlr.gg). Games and scores are updated automatically.</div>
        <h2>How to use this endpoint on StreamElements</h2>
        <div style={{ paddingTop: "10px" }}><code onClick={copyToClipboard} id="code" className="code">$(touser) ► $(customapi.{origin}/api/valorant/schedule?channel=$(channel)&id=<span className="red">LEAGUE_ID</span>)</code></div>

        <h2>How to get the League ID</h2>

        <p>In order to get the League ID, go to <a href="https://vlr.gg/events">https://vlr.gg/events</a> and click on the league you want to use. You will find the League ID in the URL of the page, right after the /event/ part.</p>
        <p>As an example, we can use the <strong>Esports World Cup 2025</strong>, which we can find at <a href="https://www.vlr.gg/event/2449/esports-world-cup-2025">https://www.vlr.gg/event/<span className="red">2449</span>/esports-world-cup-2025</a>.</p>
        <p>The League ID is <span className="red">2449</span>, so the code would be:</p>
        <code onClick={copyToClipboard} id="code" className="code">$(touser) ► $(customapi.{origin}/api/valorant/schedule?channel=$(channel)&id=<span className="red">2449</span>)</code>

        <h2>Optional parameters</h2>
        <div>There are 3 optional parameters you can use to customize the response:</div>
        <ul>
          <li><code className="blue" style={{ fontSize: "1rem" }}>&msg</code> - Message to be shown when there are no games. Available variables: <code>(league)</code>.</li>
          <li><code className="blue" style={{ fontSize: "1rem" }}>&type</code> - Type of response. Available values: <code>json / text</code></li>
          <li><code className="blue" style={{ fontSize: "1rem" }}>&series_id</code> - If the league has many stages/series, you can filter the games at a stage/series. Choose the stages/series from the drop-down menu on the event page and the <code className="blue">series_id</code> will be available in the URL.</li>
        </ul>

        <h2>Test the command</h2>
        <div>Select the league you want to use and click on <span className="blue">Show response</span> button to check the response:</div>
        <form id="form" onSubmit={handleSubmit} className="form" style={{ paddingTop: "10px" }}>
          <input type="text" id="league-id" className="playername" placeholder="League ID: 2449" onChange={(e) => { setId(e.target.value) }} required={true}></input>
          <input type="text" id="series-id" className="tagline" placeholder="Series ID (optional): all" onChange={(e) => { setSeriesId(e.target.value) }}></input>
          <input type="text" id="message" className="message" placeholder="Message (optional): No games for (league) today" onChange={(e) => { setMsg(e.target.value) }} />
          <h5 className="variables">Optional: Type a message to be shown when there are no games. Available variables: <code>(league)</code></h5>
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
