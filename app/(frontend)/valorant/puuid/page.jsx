"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState } from "react";
import Image from "next/image";

export default function Puuid() {

  const [puuid, setPuuid] = useState();
  const [image, setImage] = useState();
  const [error, setError] = useState();

  async function getPuuid(event) {
    event.preventDefault();
    try {
      const player = document.getElementById("player").value;
      const tag = document.getElementById("tag").value;
      const request = await fetch(`/api/valorant/puuid?player=${player}&tag=${tag}`);
      const response = await request.json();

      if (!response.data) throw new Error("Error: Could not find this player on the platform");

      setPuuid(response.data.puuid);
      setImage(response.data.card.large);
      setError(null);

    } catch (error) {
      console.log("Error: ", error.message);
      setError(error.message);
      setPuuid(null);
      setImage(null);
    }
  }

  function clearFields() {
    document.getElementById("player").value = "";
    document.getElementById("tag").value = "";
    setPuuid(null);
    setImage(null);
    setError(null);
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>Find the puuid of your Valorant account</h1>

        <form onSubmit={getPuuid}>
          <input type="text" id="player" name="player" placeholder="Username" required style={{ padding: "5px", fontSize: "1.2rem" }} />
          <span>#</span>
          <input type="text" id="tag" name="tag" placeholder="Tagline" required style={{ padding: "5px", fontSize: "1.2rem", width: "80px" }} />
          <button type="submit" style={{ padding: "5px", fontSize: "1.1rem", margin: "0 5px" }}>Get PUUID</button>
          <button type="reset" onClick={clearFields} style={{ padding: "5px", fontSize: "1.1rem", margin: "05px" }}>Clear Fields</button>
        </form>
        {puuid && (
          <>
            <div id="puuid" style={{ fontSize: "1.2rem", margin: "25px 0" }}>puuid: {puuid}</div>
            <Image id="banner" src={image} alt="valorant account banner" width={268} height={640} />
          </>
        )}

        {error && <div id="output" style={{ fontSize: "1.2rem", margin: "25px 0" }}>{error}</div>}

      </main>
      <FooterComponent />
    </div >
  );
}