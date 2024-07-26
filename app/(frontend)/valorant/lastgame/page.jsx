"use client"

import { usePathname } from "next/navigation";
import { useState, useEffect } from 'react';
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

// const id = "9fe721ed-4a11-5549-8387-e2d3d5ea76d9"; // Danny Jones
// const id = "7cd4994f-3255-5575-b8a2-968f428bf9a1"; // Otsuka
// const id = "10726a29-ce65-5471-a794-32733f309a16"; // Coreano
// const id = "19071032-691d-55a3-8529-4fbbbd867eaf" // Aprendendo

async function fetchPlayerData(playerName, tag, region, id) {

  let url;
  if (id) url = `/api/valorant/lastgame?id=${id}&region=${region}`;
  if (playerName && tag) url = `/api/valorant/lastgame?player=${playerName}&tag=${tag}&region=${region}`;

  const response = await fetch(url);
  const player = await response.json();
  return player;
}

export default function Valorant({ searchParams }) {

  const path = usePathname();
  const [player, setPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(searchParams.id || '');
  const [playerName, setPlayerName] = useState(searchParams.player || '');
  const [tag, setTag] = useState(searchParams.tag || '');
  const [region, setRegion] = useState(searchParams.region || 'br');

  /* const { id, region, player: playerName, tag } = searchParams; */


  /* const [player, setPlayer] = useState(null); */



  /*   useEffect(() => {
      if ((id && id.trim() !== '') || (playerName && playerName.trim() !== '' && tag && tag.trim() !== '')) {
        const fetchData = async () => {
          try {
            const data = await fetchPlayerData(playerName, tag, region, id);
            setPlayer(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }
    }, [id, playerName, tag, region]); */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set isLoading to true when fetching data
    setPlayer(null); // Reset player data
    if ((id && id.trim() !== '') || (playerName && playerName.trim() !== '' && tag && tag.trim() !== '')) {
      try {
        const data = await fetchPlayerData(playerName, tag, region, id);
        setPlayer(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Set isLoading to false when data is fetched
      }
    }
  }


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

  // console.log("Image URL:", player?.assets?.agent.full);

  const style = {
    box: {
      display: "block",
      height: "290px",
      background: `url('${player?.agent_portrait || ''}') 85px top no-repeat,
                      linear-gradient(90deg, rgba(0, 0, 0, 0.90) 20%, ${colour} 80%) center center / 100% 100% no-repeat`,
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
        <h1>This is the {path} page</h1>
        <h2>Last Game Status</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>
              ID:
              <input
                type="text"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setPlayerName('');
                  setTag('');
                }}
                disabled={playerName || tag}
              />
            </label>
          </div>
          <div>
            <label>
              Player Name:
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setId('');
                }}
                disabled={id}
                required={!id}
              />
            </label>
          </div>
          <div>
            <label>
              Tag:
              <input
                type="text"
                value={tag}
                onChange={(e) => {
                  setTag(e.target.value);
                  setId('');
                }}
                disabled={id}
                required={!id}
              />
            </label>
          </div>
          <div>
            <label>
              Region:
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Fetch Player Data</button>
        </form>




        {isLoading && <span id="title">Loading...</span>} {/* Render "Loading..." message if isLoading is true */}
        {/* !isLoading && !player && <span id="title">Please enter player data</span> */} {/* Render message if player data is not available and not loading */}
        {player?.error ? (
          <span id="title">{player.error.message}</span>
        ) : (player && (
          <div id="box" style={style.box}>
            <div id="text" style={style.text}>
              <h2 style={style.title}>{player.name}</h2>
              <div style={style.infos}>Rank: <span style={style.light}>{player.tier_name} - {player.ranking_in_tier} points</span></div>
              <div style={style.infos}>KDA: <span style={style.light}>{player.kills} / {player.deaths} / {player.assists}</span></div>
              { /* <div style={style.infos}>Headshots: <span style={style.light}>{player?.stats.headshots}</span></div> 
              <div style={style.infos}>Duration: <span style={style.light}>{Math.floor(player.game_duration_minutes)} min</span></div> */ }
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
