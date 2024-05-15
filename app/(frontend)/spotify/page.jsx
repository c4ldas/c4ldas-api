"use client"

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

export default function Spotify({ params, searchParams }) {

  const path = usePathname();

  return (
    <div className="container">
      <Header />
      <main className="main">

        <h1>This is the {path} page</h1>
        <h2>{searchParams.hello}</h2>
      </main>
      <FooterComponent />
    </div>
  );
}
