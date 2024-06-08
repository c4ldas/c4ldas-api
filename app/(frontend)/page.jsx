import Header from "@/app/components/Header";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";


export default async function Home() {
  return (
    <div className="container">
      <Header />
      <main className="main">
        <div>
          <h1 className="title">Welcome!</h1>
          <p className="subtitle">
            Dive into a collection of tools and utilities designed to elevate
            your Twitch streaming experience with Streamelements. From
            managing predictions to showcasing your gaming ranks in real-time,
            explore a range of features tailored to enrich your
            channel.
          </p>
        </div>

        <Linkbox
          title="Twitch Prediction"
          description="Effectively control Twitch predictions using intuitive chat commands, facilitating creation, closure, or cancellation."
          link="/twitch"
        />

        <Linkbox
          title="TFT Rank"
          description="Generate a chat command to display your real-time rank and elo in TFT."
          link="/tft"
        />

        <Linkbox
          title="League of Legends Rank"
          description="Create a chat command to instantly showcase your rank and elo in League of Legends."
          link="/lol"
        />

        <Linkbox
          title="Valorant Rank"
          description="Craft a chat command to reveal your real-time rank and elo in Valorant."
          link="/valorant"
        />

        <Linkbox
          title="Valorant - Find your PUUID"
          description="Discover your Valorant account ID or someone else's. Helpful when configuring a Valorant rank command."
          link="/valorant/puuid"
        />

        <Linkbox
          title="Valorant - Official games of the day"
          description="Set up a chat command to display real-time scores of today's official Valorant tournament matches."
          link="/valorant/scheduler"
        />

        <Linkbox
          title="Spotify Now Playing"
          description="Inform your viewers about the song title and artist currently playing on your livestream."
          link="/spotify"
          span=" Currently undergoing maintenance."
          spanClass="red"
        />

        <Linkbox
          title="Steam Game"
          description="Widget to show Steam game information."
          link="/steam"
        />

        <Linkbox
          title="Youtube - Channel ID"
          description="Retrieve a Youtube channel ID based on its channel name."
          link="/youtube"
        />

        <Linkbox
          title="Streamelements Leaderboard CSV download"
          description="Generate and download the Streamelements leaderboard in CSV format."
          link="https://seapi.c4ldas.com.br/leaderboard"
        />

        <Linkbox
          title="Streamelements Overlay Sharing Tool"
          description="Share custom overlays with colleagues using one-time-use codes for effortless installation in their Streamelements accounts."
          link="https://seapi.c4ldas.com.br/overlays"
        />

        <Linkbox
          title="Streamelements Widgets"
          description="Discover available widgets to enhance your stream overlays."
          link="https://github.com/c4ldas/streamelements-widgets"
        />
      </main>
      <FooterComponent />
    </div>
  );
}


/* 
<!--
<body>
  <div class="container">
    <header class="header">
      <a href="#"><img src="https://static-cdn.jtvnw.net/jtv_user_pictures/451dd285-491d-49e0-b1e0-20147f3ab56b-profile_image-300x300.png" class="image" alt="Logo da página" alt="home"></a>
      <nav class="navigation">
        <a href="#"><img class="icons" src="./images/home.svg" alt="home"></a> 
        <a href="https://twitch.tv/c4ldas" target="_blank"><img class="icons" src="./images/twitch.svg"></a> 
        <a href="https://youtube.com/c4ldas" target="_blank"><img class="icons" src="./images/youtube.svg" alt="youtube"></a> 
        <a href="https://instagram.com/c4ldas" target="_blank"><img class="icons" src="./images/instagram.svg" alt="instagram"></a> 
        <a href="https://github.com/c4ldas" target="_blank"><img class="icons" src="./images/github.svg" alt="github"></a> 
      </nav>
    </header>
    
    <main class="main">
      <h2 class="login-title">Seja bem-vindo! Aqui você encontrará alguns endpoints para usar na Twitch em conjunto com o Streamelements. Além de mais alguns outros projetos</h2>
      <h3><a href='https://seapi.c4ldas.com.br/'>Streamelements Overlay Sharing Tool</a></h3>
      <h3><a href='https://seapi.c4ldas.com.br/leaderboard/'>Streamelements Leaderboard CSV download</a></h3>
      <h3><a href='./api/twitch/'>Twitch Prediction</a></h3>
      <h3><a href='./api/spotify/'>Spotify Now Playing</a></h3>
      <h3><a href='./api/steam/'>Steam Current Game Widget</a></h3>
      <h3><a href='./api/tft/'>TFT Rank</a></h3>
      <h3><a href='./api/lol/'>League of legends Rank</a></h3>
      <h3><a href='./api/valorant/'>Valorant Rank</a></h3>
      <h3><a href='./api/valorant/puuid'>Valorant - Encontrar puuid da sua conta</a></h3>
      <h3><a href='./api/valorant/scheduler'>Valorant - Jogos do dia dos torneios oficiais</a></h3>
      <h3><a href='./api/youtube/'>Youtube - Obter ID de um canal</a></h3>
      
    </main>
    
  </div>
</body>
-->
*/