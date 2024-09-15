import Header from "@/app/components/Header";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";

export default function Valorant() {
  return (
    <div className="container">
      <Header />
      <main className="main">
        <div className="block">
          <h1 className="title">Valorant</h1>
          <h2 className="subtitle">
            Here you will find Valorant commands to be used on stream.
            These commands can be used to display your real-time rank and elo in VALORANT, your last game results,
            and your account ID which is really helpful when configuring your Valorant rank command.
          </h2>
        </div>
        <Linkbox title="Valorant Rank" link="/valorant/rank" description="Craft a chat command to display your real-time rank and elo in VALORANT." />
        <Linkbox title="Valorant Official games of the day" link="/valorant/schedule" description="Set up a chat command to display real-time scores of todays's official Valorant tournament matches." />
        <Linkbox title="Valorant Last Game" link="/valorant/lastgame" description="Have your last VALORANT ranked game results displayed in chat." />
        <Linkbox title="Valorant Puuid" link="/valorant/puuid" description="Find your Valorant Account ID or someone elses's. Helpful when configuring Valorant rank command." />

      </main>
      <FooterComponent />
    </div>
  );
}