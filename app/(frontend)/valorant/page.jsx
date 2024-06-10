"use client"

import { useState, useEffect } from 'react';
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";


const id = "9fe721ed-4a11-5549-8387-e2d3d5ea76d9"; // Danny Jones
// const id = "7cd4994f-3255-5575-b8a2-968f428bf9a1"; // Otsuka

async function fetchPlayerData() {
  const response = await fetch(`/api/valorant/lastgame?id=${id}&region=br`);
  if (!response.ok) {
    console.log(response)
    throw new Error('Failed to fetch data', { status: response.status });
  }
  const player = await response.json();
  return player;
}

export default function Valorant() {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPlayerData();
        setPlayer(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const style = {
    box: {
      display: "block",
      background: `linear-gradient(90deg, rgba(0, 0, 0, 0.60) 60%, rgba(0,212,255,0) 100%), 
                  url('${player?.assets.agent.full || ''}') top no-repeat`,
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
      color: "white",
      // display: "inline-flex",
      alignItems: "space-around",
      // verticalAlign: "middle",
      // alignItems: "center",
    },

    green: {
      color: "green",
      paddingRight: "0.5rem",
    }
  }


  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>Player Data</h1>
        {console.log(player)}
        {!player && <span id="title">Loading...</span>}

        {player && (
          <div id="box" style={style.box}>
            <div id="text" style={style.text}>
              <h2 style={style.title}>{player.name}</h2>
              <div style={style.infos}>Rank: <span style={style.green}>{player.currenttier_patched}</span></div>
              <div style={style.infos}>KDA: <span style={style.green}>{player.stats.kills} / {player.stats.deaths} / {player.stats.assists}</span></div>
              <div style={style.infos}>Headshots: <span style={style.green}>{player?.stats.headshots}</span></div>
              <div style={style.infos}>Duration: <span style={style.green}>{Math.floor(player.game_duration_minutes)} min</span></div>
              <div style={style.infos}>Map: <span style={style.green}>{player.map}</span></div>
              <div style={style.infos}>Total rounds: <span style={style.green}>{player.rounds_played}</span></div>
              <div style={style.infos}>Winner: <span style={style.green}>{player.has_won.toString()}</span></div>
            </div>

            {/* <Image src={player.assets.agent.killfeed} alt={player.name} width={500} height={256} quality={100} placeholder="empty" />
            <p>{player.name} as {player.character}</p>
            <p>Rank: {player.currenttier_patched}</p>
            <p>KDA: {player.stats.kills} / {player.stats.deaths} / {player.stats.assists}</p>
            <p>Headshots: {player?.stats.headshots}</p>
            <p>Duration: {Math.floor(player.game_duration_minutes)} min</p>
            <p>Map: {player.map}</p>
            <p>Total rounds: {player.rounds_played}</p>
            <p>Winner: {player.has_won.toString()}</p>
            */}
          </div>
        )}
      </main>
      <FooterComponent />
    </div>
  );
}



/* 
{
    "puuid": "7cd4994f-3255-5575-b8a2-968f428bf9a1",
    "name": "FURIA Otsuka",
    "tag": "fome",
    "team": "Blue",
    "level": 760,
    "character": "Skye",
    "currenttier": 27,
    "currenttier_patched": "Radiant",
    "player_card": "9bdef801-49f4-51c5-c7b8-a1b14007fcb8",
    "player_title": "703cd95a-4624-16f3-fdd9-f4a881993577",
    "party_id": "2fecbe71-500a-4265-ba36-1dc5b5da1d77",
    "session_playtime": {
        "minutes": 394,
        "seconds": 23640,
        "milliseconds": 23640000
    },
    "behavior": {
        "afk_rounds": 0,
        "friendly_fire": {
            "incoming": 0,
            "outgoing": 0
        },
        "rounds_in_spawn": 0
    },
    "platform": {
        "type": "PC",
        "os": {
            "name": "Windows",
            "version": "10.0.19045.1.256.64bit"
        }
    },
    "ability_casts": {
        "c_cast": 4,
        "q_cast": 12,
        "e_cast": 33,
        "x_cast": 2
    },
    "assets": {
        "card": {
            "small": "https://media.valorant-api.com/playercards/9bdef801-49f4-51c5-c7b8-a1b14007fcb8/smallart.png",
            "large": "https://media.valorant-api.com/playercards/9bdef801-49f4-51c5-c7b8-a1b14007fcb8/largeart.png",
            "wide": "https://media.valorant-api.com/playercards/9bdef801-49f4-51c5-c7b8-a1b14007fcb8/wideart.png"
        },
        "agent": {
            "small": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png",
            "bust": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/fullportrait.png",
            "full": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/fullportrait.png",
            "killfeed": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/killfeedportrait.png"
        }
    },
    "stats": {
        "score": 3785,
        "kills": 13,
        "deaths": 17,
        "assists": 9,
        "bodyshots": 53,
        "headshots": 11,
        "legshots": 17
    },
    "economy": {
        "spent": {
            "overall": 60500,
            "average": 2630
        },
        "loadout_value": {
            "overall": 88600,
            "average": 3852
        }
    },
    "damage_made": 2261,
    "damage_received": 3216,
    "hasWon": true,
    "gameDuration": 2233,
    "map": "Lotus",
    "rounds_played": 23
}
*/