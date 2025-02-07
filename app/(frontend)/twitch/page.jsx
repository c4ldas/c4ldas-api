import Header from "@/app/components/Header";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";

export default function Twitch() {
  return (
    <div className="container">
      <Header />
      <main className="main">
        <div className="block">
          <h1 className="title">Twitch</h1>
          <h2 className="subtitle">
            Here you will find Twitch options to be used on stream.
            It can be used to create predictions and more.
          </h2>
        </div>
        <Linkbox title="Twitch Prediction" link="/twitch/prediction" description="Effectively control Twitch predictions using intuitive chat commands, facilitating creation, closure, or cancellation." />
        {/* <Linkbox title="Twitch Commercial (ads)" link="/twitch/commercial" description="Configure your Twitch commercial (ads) to be run at specified times." /> */}
        <Linkbox title="Twitch Clip" link="/twitch/clip" description="Create Twitch clips for your channel using chat command" />

      </main>
      <FooterComponent />
    </div>
  );
}