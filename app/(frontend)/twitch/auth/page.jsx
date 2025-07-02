"use client"
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { getCookies } from "cookies-next";
import { useEffect, useState } from "react";
import { twitchScopes } from "@/app/lib/twitch_scopes";

export default function Twitch() {

  const baseURL = 'https://id.twitch.tv/oauth2/authorize?'

  const [origin, setOrigin] = useState();
  const [scopes, setScopes] = useState([]);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);


  const urlSearchParams = new URLSearchParams({
    response_type: 'code',
    client_id: '1mhvnqfp2xtswwqz1p8ol3doqm4t26',
    scope: scopes.join(" "),
    redirect_uri: `${origin}/api/twitch/callback`,
    state: 'custom_auth_twitch',
    force_verify: false
  });

  return (
    <div className="container">
      <Header />
      <main className="main">
        <div className="block">
          <h1 className="title">Twitch auth</h1>
          <>
            <p>
              Custom authentication for tests with Twitch. Choose the Twitch scopes you want to add and click on Login with Twitch:</p>

            {/* Button to toggle all scopes at once */}
            <button onClick={() => {
              if (scopes.length === 0) setScopes(twitchScopes);
              else setScopes([]);
            }}>
              {scopes.length === 0 ? "Select all scopes" : "Deselect all scopes"}
            </button>

            <br /><br />

            <a href={baseURL + urlSearchParams.toString()}>
              <button type="submit" className="formatted">Login with Twitch</button>
            </a>

            <br /><br />

            {/* Checkbox for each scope */}
            <div style={{
              fontSize: "0.8rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "0.5rem 1rem"
            }}>
              {twitchScopes.map((scope) => (
                <div key={scope}>
                  <input
                    type="checkbox"
                    id={scope}
                    value={scope}
                    checked={scopes.includes(scope)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setScopes([...scopes, scope]);
                      } else {
                        setScopes(scopes.filter((s) => s !== scope));
                      }
                    }}
                  />
                  <label htmlFor={scope}>{scope}</label>
                </div>
              ))}
            </div>
          </>
        </div>

      </main>
      <FooterComponent />
    </div>
  );
}