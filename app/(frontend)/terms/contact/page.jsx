"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

export default function Contact({ params, searchParams }) {

  async function sendMessage(e) {
    e.preventDefault();
    const request = await fetch("/api/contact", {
      method: "POST"
    });

    const response = await request.json();

    console.log(response);
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <div>
          <h1 className="title">Contact page</h1>
          <h2 className="subtitle">Last Updated: 14-April-2025</h2>
        </div>

        <p>
          You can contact me at any links in the footer of the page (GitHub, Twitter, Twitch, etc) or simply look for me on Discord as <strong>c4ldas</strong>.
        </p>

        <form id="form" onSubmit={sendMessage} className="form" style={{ paddingTop: "10px" }}>
          <input type="submit" value="Send message" />
        </form>

      </main>


      <FooterComponent />
    </div>
  );
}

