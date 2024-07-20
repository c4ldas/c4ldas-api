"use client"

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

export default function Twitch({ params, searchParams }) {
  const [origin, setOrigin] = useState();
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const path = usePathname();
  const { id, display_name, code, error } = searchParams;

  const baseURL = 'https://id.twitch.tv/oauth2/authorize?'
  const urlSearchParams = new URLSearchParams({
    response_type: 'code',
    client_id: '1mhvnqfp2xtswwqz1p8ol3doqm4t26',
    scope: '',
    redirect_uri: `${origin}/api/twitch/callback`,
    force_verify: false
  });

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>This is the {path} page</h1>
        {display_name && (
          <>
            <p>Display name: {display_name} </p>
            <p>ID: {id}</p>
            <p>Code: {code}</p>
          </>
        )}
        {error && <p>Error: {error}</p>}
        {!display_name && (
          <a href={baseURL + urlSearchParams.toString()}>
            <button type="submit">Login with Twitch</button>
          </a>

        )}
      </main>
      <FooterComponent />
    </div >
  );
}
