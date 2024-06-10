"use client"

import { useState, useEffect } from 'react';
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import Image from 'next/image';

async function fetchPlayerData() {
  const response = await fetch('/api/valorant/lastgame?id=7cd4994f-3255-5575-b8a2-968f428bf9a1&region=br');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
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



  return (
    <div className="container">
      <Header />
      <main className="main">
        <h1>Player Data</h1>
        <Image src={player?.assets.agent.killfeed} alt={player?.name} width={256} height={128} />
        <p>{player?.name} as {player?.character}</p>
        <p>Rank: {player?.currenttier_patched}</p>
        <p>KDA: {player?.stats.kills} / {player?.stats.deaths} / {player?.stats.assists}</p>
        <p>Headshots: {player?.stats.headshots}</p>
        <p>Duration: {Math.floor(player?.gameDuration / 60)} min</p>
        <p>Map: {player?.map}</p>
        <p>Total rounds: {player?.rounds_played}</p>
        <p>Winner: {player?.hasWon.toString()}</p>
        <pre>{JSON.stringify(player, null, 4)}</pre>
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