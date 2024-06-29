"use client"

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

export default function Spotify({ params, searchParams }) {
  const [origin, setOrigin] = useState();
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const path = usePathname();
  const { id, display_name } = searchParams;

  const baseURL = 'https://accounts.spotify.com/authorize?'
  const urlSearchParams = new URLSearchParams({
    response_type: 'code',
    client_id: '70b6001beb514083889ab4905dbf1384',
    scope: 'user-read-currently-playing user-modify-playback-state',
    redirect_uri: `${origin}/api/spotify/callback`,
    show_dialog: false
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
          </>
        )}
        {!display_name && (
          <a href={baseURL + urlSearchParams.toString()}>
            <button type="submit">Login with Spotify</button>
          </a>

        )}
      </main>
      <FooterComponent />
    </div >
  );
}
