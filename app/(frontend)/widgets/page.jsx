"use client"

import Header from "@/app/components/Header";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";
import { useEffect, useState } from "react";

export default function Home() {

  const [widgets, setWidgets] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await fetch("/api/github/widgets");
        const response = await request.json();

        if (response.error) throw new Error(response.error);
        setWidgets(response);
        setError(null);

      } catch (error) {
        setError(error.message);
        setWidgets(null);
      }
    }

    fetchData();
  }, []);

  function collapseMenu(event) {
    const element = event.currentTarget;
    element.classList.toggle("active");
    var item = element.nextElementSibling;
    if (item.style.maxHeight) {
      item.style.maxHeight = null;
    } else {
      item.style.maxHeight = item.scrollHeight + "px";
    }
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>Streamelements Custom Widgets</h1>
        <p>Widgets created by me (or at least the ones I tried to create) for Streamelements overlays.</p>
        <p>Those widgets are mainly for Twitch streamers.</p>
        <h2 id="toggle-install" className="toggle" onClick={collapseMenu}>How to install:</h2>
        <div id="collapsible-install" className="collapsible">
          <p>You have two options to install the widget on your account, use the one you feel beter:</p>
          <h3>Option 1 (recommended):</h3>
          <p>Click on the link in the description of each widget for 1-click install.</p>
          <p>This will create a new overlay in your Streamelements account.</p>
          <p>You can just use the overlay created and add to your OBS, or edit the overlay and duplicate the widget to an overlay you already have. After that, you can remove the overlay that was created when you clicked on the link.</p>

          <h3>Option 2:</h3>
          <p>Go to the Github repository and copy each content to the specific tab in a Custom Widget:</p>
          <ol>
            <li>Create a custom widget on Streamelements Overlay Editor (+ icon &gt; Static/Custom &gt; Custom widget)</li>
            <li>Click on Open Editor</li>
            <li>Replace each tab with the respective content</li>
          </ol>
          <p>Each folder will contain 4 files:</p>
          <p><em>widget.html</em></p>
          <p><em>widget.css</em></p>
          <p><em>widget.js</em></p>
          <p><em>widget.json</em></p>
          <p>Each file goes directly to the corresponding tab in the custom widget on Streamelements. The only difference is the <em>widget.json</em>, which should be copied to FIELDS tab.</p>
          <p><img src="https://user-images.githubusercontent.com/75918726/219300427-f0d2a41e-7a66-4baf-8e5b-d2cd716a78d3.png" alt="image" /></p>
        </div>
        <h2 id="toggle-reset" className="toggle" onClick={collapseMenu}>How to reset the fields:</h2>
        <div id="collapsible-reset" className="collapsible">
          <p>In case you want to reset the configuration of the widget to its default, you can go to DATA tab and replace the contents with { }</p>
          <p><img src="https://user-images.githubusercontent.com/75918726/219302604-7b0d556f-fdc4-45ae-8484-f5edcfadd441.png" alt="image" /></p>
        </div>
        <div className="main">
          {error && <p className="red">{error}</p>}
          {widgets && widgets.map((widget) => (
            <Linkbox
              key={widget.widgetFolder}
              title={widget.widgetName}
              description={widget.widgetDescription}
              link={`https://github.com/c4ldas/streamelements-widgets/tree/main/${widget.widgetFolder}`}
            />
          ))}
        </div>
      </main >
      <FooterComponent />
    </div >
  );
}

/*
export default async function Home() {
  return (
    <div className="container">
      {renderFromGithub()}
      <Header />
      <main className="main">
        <div>
          <h1 className="title">Streamelements Custom Widgets</h1>
          <h2 className="subtitle">
            Widgets created by me (or at least the ones I tried to create) for Streamelements overlays.
            Those widgets are mainly for Twitch streamers.
          </h2>
        </div>

        <Linkbox
          title="Windows Activation Prank"
          description="This widget emulates an activation Windows screen using Twitch Channel Points, which will appear in your stream."
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/windows-activation-prank"
        />

        <Linkbox
          title="TFT Rank"
          description="Show off your TFT elo on your stream with this widget! Just put your game name and it will give you your current ranked badge and points to be seen on stream."
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/tft-rank"
        />

        <Linkbox
          title="League of Legends Rank"
          description="Show off your LOL elo on your stream with this widget! Just put your game name and it will give you your current ranked badge and points to be seen on stream."
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/league-of-legends-rank"
        />

        <Linkbox
          title="League of Legends Scoreboard"
          description="This widget shows the scoreboard on top of the screen, so it is easier to the viewers have data of each champion in the game."
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/league-of-legends-scoreboard"
        />

        <Linkbox
          title="Twitch Channel Points"
          description="This widget shows information about the Channel Points redemption redeemed by an user. "
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/twitch-channel-points"
          span="Focused to developers to create their own widgets as Streamelements doesn't native support it."
          spanClass="red"
        />

        <Linkbox
          title="Valorant Rank"
          description="Show off your Valorant elo on your stream with this widget! Just put your game name and it will give you your current badge and points to use on stream."
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/valorant-rank"
        />

        <Linkbox
          title="Voicemod and Channel Points"
          description="This widget allows your viewers to use Channel Points to change your voice when using Voicemod."
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/voicemod-and-channel-points"
        />

        <Linkbox
          title="Current Steam Game"
          description="This widget shows the game you are currently playing on Steam. It shows the game name, price, hours played and the game image as a background"
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/current-steam-game"
        />

        <Linkbox
          title="Latest Patreon Member label"
          description="Add a label of the latest patreon backer on your overlay. This widget is a simple label that gets the newest user who subscribed to your Patreon page."
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/latest-patreon-member-label"
        />

        <Linkbox
          title="Top Subgifters by Session"
          description="This widget shows the top subgifters during the stream. You can choose how many subgifters you want to show and some more customization options."
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/top-subgifters-by-session"
        />

        <Linkbox
          title="Weather widget"
          description="This widget allows you to add weather information to your Streamelements overlay. It will show your city, temperature, description and current time."
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/weather-widget"
        />

        <Linkbox
          title="Charity Follower Counter"
          description="With this widget you can set an amount to donate to charity based on the amount of followers you receive."
          link="https://github.com/c4ldas/streamelements-widgets/tree/main/charity-follower-counter"
        />
      </main>
      <FooterComponent />
    </div>
  );
}
*/