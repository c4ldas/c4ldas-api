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
          <h2 className="subtitle">
            Dive into a collection of tools and utilities designed to elevate
            your Twitch streaming experience with Streamelements. From
            managing predictions to showcasing your gaming ranks in real-time,
            explore a range of features tailored to enrich your
            channel.
          </h2>
        </div>

        <Linkbox
          title="Twitch"
          description="Twitch commands to be used on Stream or overlays."
          link="/twitch"
        />

        <Linkbox
          title="TFT Rank"
          description="Generate a chat command to display your real-time rank and elo in TFT."
          link="/tft"
        />

        <Linkbox
          title="League of Legends"
          description="League of Legends commands to be used on Stream or overlays."
          link="/lol"
        />

        {/* 
        <Linkbox
          title="Marvel Rivals rank"
          description="Create a chat command to display your rank in Marvel Rivals."
          link="/marvel-rivals"
          span=" Unavailable."
          spanClass="red"
        />
        */}

        <Linkbox
          title="Valorant"
          description="Valorant commands to be used on Stream or overlays."
          link="/valorant"
        />

        <Linkbox
          title="Spotify Now Playing"
          description="Inform your viewers about the song title and artist currently playing on your livestream."
          link="/spotify"
          spanClass="red"
        />

        <Linkbox
          title="Youtube - Channel ID"
          description="Retrieve a Youtube channel ID based on its channel name."
          link="/youtube"
        />

        {/*
        <Linkbox
          title="Streamelements Leaderboard CSV download"
          description="Generate and download the Streamelements leaderboard in CSV format."
          link="https://seapi.c4ldas.com.br/leaderboard"
        /> 
        */}

        <Linkbox
          title="Streamelements Widgets"
          description="Discover available widgets to enhance your stream overlays."
          link="/widgets"
        />

        <Linkbox
          title="Streamelements Overlay Sharing Tool"
          description="Webpage to share custom overlays with colleagues or clients using a quick link."
          span="(Open in a new tab)"
          target="_blank"
          link="https://seapi.c4ldas.com.br"
        />

      </main>
      <FooterComponent />
    </div>
  );
}
