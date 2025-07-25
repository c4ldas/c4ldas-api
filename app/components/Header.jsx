"use client"

import Image from "next/image";
import Link from "next/link";
import DarkMode from "./DarkMode";

export default function Header() {

  return (
    <header className="header">
      <Link href="/">
        <Image
          src="/images/logo.webp"
          className="image"
          alt="Avatar image"
          width={300}
          height={300}
          quality={100}
          priority={true}
          placeholder="empty"
        />
      </Link>
      <div className="header-links">
        <Link id="home" href="/" className="home"><div style={{ color: "var(--color)" }}>Home</div></Link>
        <Link id="twitch" href="/twitch" className="twitch"><div style={{ color: "var(--color)" }}>Twitch</div></Link>
        <Link id="tft" href="/tft" className="tft"><div style={{ color: "var(--color)" }}>TFT</div></Link>
        <Link id="lol" href="/lol" className="lol"><div style={{ color: "var(--color)" }}>League of Legends</div></Link>
        <Link id="valorant" href="/valorant" className="valorant"><div style={{ color: "var(--color)" }}>Valorant</div></Link>
        <Link id="spotify" href="/spotify" className="spotify"><div style={{ color: "var(--color)" }}>Spotify</div></Link>
        <Link id="youtube" href="/youtube" className="youtube"><div style={{ color: "var(--color)" }}>Youtube</div></Link>
      </div>
      <DarkMode />
    </header>
  )
}

