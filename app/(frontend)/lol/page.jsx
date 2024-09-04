"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState, useEffect } from "react";

export default function LeagueOfLegends({ params, searchParams }) {

  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>League of Legends Rank</h1>
        <h3>How to use this endpoint on Streamelements</h3>
        <code>$(touser) ► $(customapi.{origin}/api/lol/rank?channel=$(channel)&region=<span className="red">REGION</span>&player=<span className="red">PLAYERNAME</span>&tag=<span className="red">TAG</span>&type=text)</code>
        <br />
        <h3>Example:</h3>
        <div><strong>Username: </strong>c4ldas#na10</div>
        <br />
        <div><strong>Player: </strong>c4ldas</div>
        <div><strong>Tag: </strong>na10</div>
        <h3>Regions available:</h3>
        <table style={{ textAlign: "center", padding: "8px", border: "1px solid #ddd" }}>
          <tbody>
            <tr>
              <th>Code</th>
              <th>Region</th>
            </tr>
            <tr>
              <td className="region">br1</td>
              <td>Brazil (BR)</td>
            </tr>
            <tr>
              <td className="region">eun1</td>
              <td>Europe Nordic & East (EUN)</td>

            </tr>
            <tr>
              <td className="region">euw1</td>
              <td>Europe West (EUW)</td>
            </tr>
            <tr>
              <td className="region">jp1</td>
              <td>Japan (JP)</td>
            </tr>
            <tr>
              <td className="region">kr</td>
              <td>Korea (KR)</td>
            </tr>
            <tr>
              <td className="region">la1</td>
              <td>Latin America North (LA1)</td>
            </tr>
            <tr>
              <td className="region">la2</td>
              <td>Latin America South (LA2)</td>
            </tr>
            <tr>
              <td className="region">me1</td>
              <td>Middle East (ME1)</td>
            </tr>
            <tr>
              <td className="region">na1</td>
              <td>North America (NA)</td>
            </tr>
            <tr>
              <td className="region">oc1</td>
              <td>Oceania (OC)</td>
            </tr>
            <tr>
              <td className="region">ph2</td>
              <td>Philippines (PH)</td>
            </tr>
            <tr>
              <td className="region">ru</td>
              <td>Russia (RU)</td>
            </tr>
            <tr>
              <td className="region">sg2</td>
              <td>Singapore (SG)</td>
            </tr>
            <tr>
              <td className="region">th2</td>
              <td>Thailand (TH)</td>
            </tr>
            <tr>
              <td className="region">tr1</td>
              <td>Turkey (TR)</td>
            </tr>
            <tr>
              <td className="region">tw2</td>
              <td>Taiwan (TW)</td>
            </tr>
            <tr>
              <td className="region">vn2</td>
              <td>Vietnam (VN)</td>
            </tr>
          </tbody>
        </table>
      </main>
      <FooterComponent />
    </div >
  );
}
