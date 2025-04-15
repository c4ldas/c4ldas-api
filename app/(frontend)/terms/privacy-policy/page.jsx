import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

export default async function PrivacyPolicy() {
  return (
    <div className="container">
      <Header />
      <main className="main block">
        <div>
          <h1 className="title">Privacy Policy</h1>
          <h2 className="subtitle">Last Updated: 15-April-2025</h2>
        </div>
        <p>
          We care about your privacy and want you to understand exactly what data we collect and why.
          On c4ldas.com.br, we only collect the minimum information necessary to provide features like Spotify and Twitch integration.
          We don&apos;t sell your data, we don&apos;t track you for ads, and we&apos;re transparent about how everything works.
          Basically, we don&apos;t want any of your info and we are not going to monetize that.
        </p>
        <h3>1. Third-Party Links</h3>
        <p>
          Sometimes we link to other websites (like Spotify or Twitch).
          These sites aren&apos;t operated by us, so we don&apos;t control what they do with your data.
          We recommend checking their privacy policies, as we can&apos;t take responsibility for how they handle your information.
        </p>

        <h3>2. Information We Collect</h3>
        <p>
          We only collect personal information when it&apos;s needed to make a feature work — like linking your Spotify or Twitch account.
          You&apos;ll always know what we&apos;re collecting and why.
          We don&apos;t do anything shady in the background, and we don&apos;t collect anything without your consent.
        </p>

        <h3>3. Data Retention and Security</h3>
        <p>
          We only keep your information for as long as it&apos;s needed to provide the service you asked for — like staying logged in.
          When it&apos;s no longer needed, we remove it.
        </p>
        <p>
          Any data we do store is protected using standard best practices to prevent loss, misuse, or unauthorized access.
          If there are legal reasons to keep something longer (which is rare), we follow those rules. Otherwise, we delete it when it&apos;s no longer relevant.
        </p>
        <p>
          We don&apos;t log your activity across the site or track how you use our APIs beyond what&apos;s necessary to keep things running.
          The only logs we keep are short-term (about 1 hour) and used in the dashboard to monitor API usage and detect issues.
          These logs may include your Twitch channel to show where the API is being used, but they are never used for profiling or stored long-term.
        </p>
        <h3>4. Information Sharing</h3>
        <p>
          We don&apos;t sell or share your personal information with anyone.
          The only time we might share anything is if we&apos;re legally required to do so — for example, by a court order.
          Otherwise, your data stays between you and this server.
        </p>

        <h3>5. Your Choices</h3>
        <p>
          You can always choose not to provide your personal information.
          Just know that if you do, some features (like linking your Spotify or Twitch account) might not work as expected.
        </p>
        <p>
          By continuing to use this server, you&apos;re accepting how we handle your data and privacy.
        </p>

        <h3>6. Account Deletion</h3>
        <p>
          If you want to delete your account, we don&apos;t hold much identifying information to begin with.
          Deleting your account simply removes your integration keys (like access_token, refresh_token, and ID) from our server.
          This means your account will no longer be linked to the server.
        </p>

        <h3>7. Cookies</h3>
        <p>
          We use a small number of cookies to handle integrations with services like Spotify and Twitch.
          These cookies store basic identifiers to confirm you&apos;re authenticated and personalize your experience:
        </p>
        <ul>
          <li><strong>spotify_display_name</strong> and <strong>spotify_id</strong> — used to show your Spotify name and ID once your account is connected.</li>
          <li><strong>twitch_id</strong>, <strong>twitch_username</strong>, and <strong>twitch_code</strong> — used to verify your Twitch integration status.</li>
        </ul>
        <p>
          These cookies are not used for tracking, advertising, or anything else. Only we can access them, and you can delete them anytime through your browser settings.
        </p>


        <h3>8. Related Documents</h3>
        <p>
          Along with this Privacy Policy, your use of this server is also governed by our <a href="/terms/end-user-agreement">End User Agreement</a>,
          which lays out the terms and conditions for using our services.
        </p>
        <p>
          If you have any questions or concerns about this Privacy Policy, feel free to reach out via our <a href="/terms/contact">Contact Page</a>.
        </p>


      </main>
      <FooterComponent />
    </div>
  );
}
