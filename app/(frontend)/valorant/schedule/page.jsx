"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState, useEffect } from "react";


const leagues = [
  { code: "challengers_br", league_name: "Challengers BR" },
  { code: "vct_lock_in", league_name: "VCT LOCK//IN" },
  { code: "game_changers_series_brazil", league_name: "Game Changers BR" },
  { code: "last_chance_qualifier_br_and_latam", league_name: "Last Chance Qualifier BR & Latam" },
  { code: "vct_americas", league_name: "VCT Americas" },
  { code: "vct_masters", league_name: "Masters" },
  { code: "champions", league_name: "Champions" },
  { code: "ascension_americas", league_name: "Ascension Americas" },
  { code: "last_chance_qualifier_americas", league_name: "Last Chance Qualifier Americas" },
  { code: "game_changers_championship", league_name: "Game Changers Championship" },
  { code: "vct_emea", league_name: "VCT EMEA" },
  { code: "game_changers_emea", league_name: "Game Changers EMEA" }
]

const moreLeagues = [
  { code: "game_changers_na", league_name: "Game Changers NA" },
  { code: "challengers_na", league_name: "Challengers NA" },
  { code: "vct_pacific", league_name: "VCT Pacific" },
  { code: "challengers_jpn", league_name: "Challengers Japan" },
  { code: "challengers_kr", league_name: "Challengers Korea" },
  { code: "challengers_latam", league_name: "Challengers LATAM" },
  { code: "challengers_latam_n", league_name: "Challengers LATAM North" },
  { code: "challengers_latam_s", league_name: "Challengers LATAM South" },
  { code: "challengers_apac", league_name: "Challengers APAC" },
  { code: "challengers_sea_id", league_name: "Challengers SEA Indonesia" },
  { code: "challengers_sea_ph", league_name: "Challengers SEA Philippines" },
  { code: "challengers_sea_sg_and_my", league_name: "Challengers SEA Singapore & Malaysia" },
  { code: "challengers_sea_th", league_name: "Challengers SEA Thailand" },
  { code: "challengers_sea_hk_and_tw", league_name: "Challengers SEA Hong Kong & Taiwan" },
  { code: "challengers_sea_vn", league_name: "Challengers SEA Vietnam" },
  { code: "valorant_oceania_tour", league_name: "Valorant Oceania Tour" },
  { code: "challengers_south_asia", league_name: "Challengers South Asia" },
  { code: "game_changers_sea", league_name: "Game Changers SEA" },
  { code: "game_changers_east_asia", league_name: "Game Changers East Asia" },
  { code: "game_changers_jpn", league_name: "Game Changers Japan" },
  { code: "game_changers_kr", league_name: "Game Changers Korea" },
  { code: "game_changers_latam", league_name: "Game Changers LATAM" },
  { code: "masters", league_name: "Masters" },
  { code: "last_chance_qualifier_apac", league_name: "Last Chance Qualifier APAC" },
  { code: "last_chance_qualifier_east_asia", league_name: "Last Chance Qualifier East Asia" },
  { code: "last_chance_qualifier_emea", league_name: "Last Chance Qualifier EMEA" },
  { code: "last_chance_qualifier_na", league_name: "Last Chance Qualifier NA" },
  { code: "vrl_spain", league_name: "VRL Spain" },
  { code: "vrl_northern_europe", league_name: "VRL Northern Europe" },
  { code: "vrl_dach", league_name: "VRL DACH" },
  { code: "vrl_france", league_name: "VRL France" },
  { code: "vrl_east", league_name: "VRL East" },
  { code: "vrl_turkey", league_name: "VRL Turkey" },
  { code: "vrl_cis", league_name: "VRL CIS" },
  { code: "mena_resilence", league_name: "MENA Resilience" },
  { code: "challengers_italy", league_name: "Challengers Italy" },
  { code: "challengers_portugal", league_name: "Challengers Portugal" }
]

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

    const request = await fetch("/api/valorant/schedule?" +
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

    const responseCode = `.me $(touser) ► $\{customapi.${origin}/api/valorant/schedule?channel=$(channel)&league=${leagueName}&msg="${msg}"\}`;
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
        <h1>Valorant Schedule</h1>
        <div>This endpoint shows the official Valorant games of the current day based on the selected league. Games and scores are updated automatically, but can take some minutes to reflect.</div>
        <h3>How to use this endpoint on Streamelements</h3>
        <div style={{ paddingTop: "10px" }}><code onClick={copyToClipboard} id="code" className="code">$(touser) ► $(customapi.{origin}/api/valorant/schedule?channel=$(channel)&league=<span className="red">LEAGUE_NAME</span>)</code></div>

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
