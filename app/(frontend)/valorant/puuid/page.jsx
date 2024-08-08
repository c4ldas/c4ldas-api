"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState } from "react";
import Image from "next/image";

export default function Puuid() {

  const [puuid, setPuuid] = useState();
  const [image, setImage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  async function getPuuid(event) {
    try {
      event.preventDefault();
      const player = document.getElementById("player").value;
      const tag = document.getElementById("tag").value;
      setIsLoading(true);
      clearResponse();

      const request = await fetch(`/api/valorant/puuid?player=${player}&tag=${tag}`);
      const response = await request.json();

      if (!response.data) throw new Error("Not found, please check the username and tagline are correct");

      setPuuid(response.data.puuid);
      setImage(response.data.card.large);
      setError(null);
      setIsLoading(false);

    } catch (error) {
      setError(error.message);
      setPuuid(null);
      setImage(null);
      setIsLoading(false);
    }
  }

  function clearFields() {
    document.getElementById("player").value = "";
    document.getElementById("tag").value = "";
    setPuuid(null);
    setImage(null);
    setError(null);
  }

  function clearResponse() {
    setPuuid(null);
    setImage(null);
    setError(null);
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Valorant Puuid</h1>
        <h2 className="subtitle">Enter your username and tagline to show your Puuid</h2>

        <form onSubmit={getPuuid}>
          <input type="text" id="player" name="player" placeholder="Username" required style={{ padding: "5px", fontSize: "1.2rem" }} />
          <span>#</span>
          <input type="text" id="tag" name="tag" placeholder="Tagline" required style={{ padding: "5px", fontSize: "1.2rem", width: "80px" }} />
          <button type="submit" style={{ padding: "5px", fontSize: "1.1rem", margin: "0 5px" }}>Get PUUID</button>
          <button type="reset" onClick={clearFields} style={{ padding: "5px", fontSize: "1.1rem", margin: "05px" }}>Clear Fields</button>
        </form>

        {isLoading && <div id="loading" style={{ fontSize: "1.2rem", margin: "25px 0" }}>Loading...</div>}

        {error && <div id="error" style={{ fontSize: "1.2rem", margin: "25px 0" }}>{error}</div>}

        {puuid && (
          <>
            <div id="puuid" style={{ fontSize: "1.2rem", margin: "25px 0" }}>puuid: {puuid}</div>
            <Image id="banner" src={image} alt="valorant account banner" width={268} height={640} />
          </>
        )}
      </main>
      <FooterComponent />
    </div >
  );
}