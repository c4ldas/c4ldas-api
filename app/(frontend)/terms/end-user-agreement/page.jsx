import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

export default async function EndUserAgreement() {
  return (
    <div className="container">
      <Header />
      <main className="main block">
        <div>
          <h1 className="title">End User Agreement</h1>
          <h2 className="subtitle">Last Updated: 02-April-2025</h2>
        </div>

        <p>
          Welcome to <strong>c4ldas.com.br</strong> (&quot;Website&quot;). By accessing or using our Website and services, you agree to be bound by this End User Agreement (&quot;Agreement&quot;). If you do not agree, please refrain from using our Website.
        </p>

        <h3>1. Description of Services</h3>
        <p>
          Our Website provides various tools, widgets, and integrations that interact with third-party services, including but not limited to <strong>Spotify, Twitch, League of Legends, Valorant, Steam, and Teamfight Tactics (TFT)</strong>. These integrations are subject to the respective terms and conditions of each third-party provider.
        </p>

        <h3>2. License and Acceptable Use</h3>
        <ul>
          <li>We grant you a limited, non-exclusive, non-transferable right to use our Website and its services for personal, non-commercial purposes.</li>
          <li>You may <strong>not</strong> modify, distribute, or sell any part of our Website or its content.</li>
          <li>You agree to <strong>comply with all applicable laws</strong> and the terms of any third-party services we integrate with.</li>
        </ul>

        <h3>3. Third-Party Services &amp; APIs</h3>
        <ul>
          <li>Our Website interacts with third-party APIs (e.g., Spotify, Twitch, Riot Games). We do <strong>not own</strong> or control the data and content provided by these services.</li>
          <li>We are <strong>not responsible</strong> for any disruptions, errors, or limitations imposed by third-party API providers.</li>
        </ul>

        <h3>4. Data Collection and Privacy</h3>
        <p>
          Your use of the Website is also governed by our <a href="/terms/privacy-policy">Privacy Policy</a>, which explains how we handle your data.
          We may collect authentication tokens for third-party services to provide our integrations. These tokens are stored securely and are not shared.
        </p>

        <h3>5. User Responsibilities</h3>
        <ul>
          <li>Provide accurate and lawful information when required.</li>
          <li>Not attempt to reverse-engineer, exploit, or bypass security measures on our Website.</li>
          <li>Not use our services to violate the terms of third-party platforms.</li>
        </ul>

        <h3>6. Limitation of Liability</h3>
        <ul>
          <li>Our Website is provided <strong>&quot;as is&quot;</strong> without warranties of any kind.</li>
          <li>We are <strong>not liable</strong> for any losses, damages, or disruptions caused by the use of our Website or third-party services.</li>
        </ul>

        <h3>7. Termination</h3>
        <ul>
          <li>We reserve the right to suspend or terminate your access to the Website if you violate this Agreement.</li>
          <li>Third-party services may also revoke access based on their own policies.</li>
        </ul>

        <h3>8. Changes to the Agreement</h3>
        <p>
          We may update this Agreement at any time. Continued use of the Website after changes constitutes acceptance of the revised terms.
          We encourage you to review this Agreement periodically.
        </p>

        <h3>9. Spotify Specific Conditions</h3>
        <p> If you use features on our Website that involve Spotify, you acknowledge and agree to the following terms as required by Spotify: </p> <ul> <li>We do <strong>not make any warranties or representations</strong> on behalf of Spotify and expressly disclaim all implied warranties with respect to the Spotify Platform, Spotify Service, and Spotify Content, including the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</li> <li>You are prohibited from <strong>modifying or creating derivative works</strong> based on the Spotify Platform, Spotify Service, or Spotify Content.</li> <li>You are prohibited from <strong>decompiling, reverse-engineering, disassembling, or otherwise reducing</strong> the Spotify Platform, Spotify Service, or Spotify Content to a human-perceivable form, to the fullest extent permitted by law.</li> <li><strong>You are solely responsible</strong> for your use of our Website and services. Spotify shall not be held liable for any issues arising from your use of the Website or its Spotify-integrated features.</li> <li>Spotify is a <strong>third-party beneficiary</strong> of this Agreement and our Privacy Policy, and is entitled to directly enforce the terms against you.</li> </ul>

        <h3>10. Contact Information</h3>
        <p>
          If you have any questions about this Agreement, please contact us via our <a href="/terms/contact">Contact Page</a>.
        </p>
      </main>


      <FooterComponent />
    </div>
  );
}
