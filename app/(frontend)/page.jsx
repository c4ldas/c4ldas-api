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
          link="/valorant/rank"
        />

        <Linkbox
          title="Valorant Last Game"
          description="Have your last Valorant ranked game results displayed in chat."
          link="/valorant/lastgame"
        />

        <Linkbox
          title="Valorant - Find your PUUID"
          description="Discover your Valorant account ID or someone else's. Helpful when configuring a Valorant rank command."
          link="/valorant/puuid"
        />

        <Linkbox
          title="Valorant - Official games of the day"
          description="Set up a chat command to display real-time scores of today's official Valorant tournament matches."
          link="/valorant/schedule"
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
          link="/widgets"
        />
      </main>
      <FooterComponent />
    </div>
  );
}
