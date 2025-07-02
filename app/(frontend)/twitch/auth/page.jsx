"use client"
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { getCookies } from "cookies-next";
import { useEffect, useState } from "react";
import { twitchScopes } from "@/app/lib/twitch_scopes";

export default function Twitch() {

  const baseURL = 'https://id.twitch.tv/oauth2/authorize?'

  const [cookie, setCookie] = useState({});
  const [origin, setOrigin] = useState();
  const [scopes, setScopes] = useState([]);

  useEffect(() => {
    setOrigin(window.location.origin);
    setCookie(getCookies());
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
          {!cookie.twitch_id && (
            <>
              <p>
                Custom authentication for Twitch
              </p>
              <p>Choose the Twitch scopes you want to add from the list below:</p>
              <div>
                <button onClick={() => setScopes(twitchScopes)}>Select all scopes</button>
                <br /><br />
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

              <p>Click on the button below to login with Twitch.</p>
              <a href={baseURL + urlSearchParams.toString()}>
                <button type="submit">Login with Twitch</button>
              </a>
            </>
          )}
        </div>

      </main>
      <FooterComponent />
    </div>
  );
}