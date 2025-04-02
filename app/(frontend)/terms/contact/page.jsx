import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

export default async function PrivacyPolicy() {
  return (
    <div className="container">
      <Header />
      <main className="main block">
        <div>
          <h1 className="title">Contact page</h1>
          <h2 className="subtitle">Last Updated: 02-April-2025</h2>
        </div>

        <p>
          You can contact me at any links in the footer of the page (GitHub, Twitter, Twitch, etc) or simply look for me on Discord as <strong>c4ldas</strong>.
        </p>

      </main>


      <FooterComponent />
    </div>
  );
}
