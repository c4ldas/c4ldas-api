"use client"

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { GET } from "@/app/api/valorant/lastgame/route";

export default async function Valorant({ params, searchParams }) {

  const path = usePathname();

  const player = await GET();
  console.log(player)

  return (
    <div className="container">
      <Header />
      <main className="main">
        <h1>This is the {path} page</h1>
      </main>
      <FooterComponent />
    </div>
  );
}
