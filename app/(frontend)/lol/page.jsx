import Header from "@/app/components/Header";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";

export default function LeagueOfLegends() {
  return (
    <div className="container">
      <Header />
      <main className="main">
        <div className="block">
          <h1 className="title">League of Legends</h1>
          <h2 className="subtitle">
            Here you will find League of Legends commands to be used on stream.
            These commands can be used to display your real-time rank and elo in League of Legends, and games schedule for championships.
          </h2>
        </div>
        <Linkbox title="League of Legends Rank" link="/lol/rank" description="Craft a chat command to display your real-time rank and elo in League of Legends." />
        {/* <Linkbox title="League of Legends Games Schedule" link="/lol/schedule" description="Set up a chat command to display real-time scores of todays's League of Legends tournament matches." /> */}
        <Linkbox title="League of Legends EWC Schedule" link="/lol/schedule/ewc" description="Set up a chat command to display real-time scores of todays's EWC games." />
      </main>
      <FooterComponent />
    </div>
  );
}