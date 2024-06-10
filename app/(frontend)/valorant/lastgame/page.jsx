"use client"

import { useState, useEffect } from 'react';
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";


// const id = "9fe721ed-4a11-5549-8387-e2d3d5ea76d9"; // Danny Jones
// const id = "7cd4994f-3255-5575-b8a2-968f428bf9a1"; // Otsuka
// const id = "10726a29-ce65-5471-a794-32733f309a16"; // Coreano
// const id = "19071032-691d-55a3-8529-4fbbbd867eaf" // Aprendendo

async function fetchPlayerData(url) {
  const response = await fetch(url);
  /*   if (!response.ok) {
      throw new Error('Failed to fetch data', { status: response.status });
    } */
  const player = await response.json();
  // console.log("Player: ", player);
  return player;
}

export default function Valorant({ params, searchParams }) {
  /*     const id = searchParams.id || 0
      const region = searchParams.region || "br" */
  const { id, region, player: playerName, tag } = searchParams;
  let url;
  if (id) url = `/api/valorant/lastgame?id=${id}&region=${region}`
  if (playerName) url = `/api/valorant/lastgame?player=${playerName}&tag=${tag}&region=${region}`

  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPlayerData(url);
        setPlayer(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  let colour;

  if (player?.outcome == "Draw") {
    colour = "rgba(128, 128, 128, 0.60)"; // black
  }

  if (player?.outcome == "Victory") {
    colour = "rgba(0, 64, 0, 0.60)"; // green
  }

  if (player?.outcome == "Defeat") {
    colour = "rgba(64, 0, 0, 0.90)"; // red
  }

  // rgba(0, 0, 0, 0.60)
  const style = {
    box: {
      display: "block",
      background: `url('${player?.assets?.agent.full || ''}') 85px top no-repeat,
                  linear-gradient(90deg, rgba(0, 0, 0, 0.90) 20%, ${colour} 80%)
                  center center no-repeat`,
      // backgroundSize: "100%",
      backgroundSize: "100%",
      borderRadius: "10px",
      minHeight: "150px",
      minWidth: "500px",
      maxWidth: "500px",
    },

    text: {
      minWidth: "55%",
      maxWidth: "55%",
      height: "100%",
      padding: "5% 0px 5% 20px", // top, right, bottom, left
      color: "white",
    },

    title: {
      fontWeight: "bold",
      fontSize: "1.4rem",
    },

    infos: {
      color: "gray",
      fontWeight: "bold",
      alignItems: "space-around",
    },

    light: {
      color: "white",
      fontWeight: "lighter",
      paddingRight: "0.5rem",
    }
  }


  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>Player Data</h1>
        {!player && <span id="title">Loading...</span>}
        {player?.error ? (
          <span id="title">{player.error.message}</span>
        ) : (player && (
          <div id="box" style={style.box}>
            <div id="text" style={style.text}>
              <h2 style={style.title}>{player.name}</h2>
              <div style={style.infos}>Rank: <span style={style.light}>{player.currenttier_patched} - {player.ranking_in_tier} points</span></div>
              <div style={style.infos}>KDA: <span style={style.light}>{player.stats.kills} / {player.stats.deaths} / {player.stats.assists}</span></div>
              <div style={style.infos}>Headshots: <span style={style.light}>{player?.stats.headshots}</span></div>
              <div style={style.infos}>Duration: <span style={style.light}>{Math.floor(player.game_duration_minutes)} min</span></div>
              <div style={style.infos}>Map: <span style={style.light}>{player.map}</span></div>
              <div style={style.infos}>Score: <span style={style.light}>{player.rounds_won} / {player.rounds_lost}</span></div>
              <div style={style.infos}>Outcome: <span style={style.light}>{player.outcome}</span></div>
            </div>
          </div>
        )
        )}
      </main >
      <FooterComponent />
    </div >
  );
}