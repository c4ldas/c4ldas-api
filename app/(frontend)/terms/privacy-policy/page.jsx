import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

export default async function PrivacyPolicy() {
  return (
    <div className="container">
      <Header />
      <main className="main">
        <div>
          <h1 className="title">Privacy Policy</h1>
          <h2 className="subtitle">Last Updated: 02-April-2025</h2>
        </div>
        <p>
          Your privacy is important to us. It is c4ldas.com.br policy to
          respect your privacy regarding any information we may collect from
          you across our website and other services we own and operate.
        </p>
        <p>
          Our website may link to external sites that are not operated by
          us. Please be aware that we have no control over the content and
          practices of these sites, and cannot accept responsibility or
          liability for their respective privacy policies.
        </p>
        <p>
          We only ask for personal information when we truly need it to
          provide a service to you. We collect it by fair and lawful means,
          with your knowledge and consent. We also let you know why we're
          collecting it and how it will be used.
        </p>
        <p>
          We only retain collected information for as long as necessary to
          provide you with your requested service. What data we store, we'll
          protect within commercially acceptable best-practice means to
          prevent loss and theft, as well as unauthorised access,
          disclosure, copying, use or modification. The time period for
          which we keep information varies according to what the information
          is used for. In some cases, there are legal requirements to keep
          data for a minimum period. Unless there is a specific legal
          requirement for us to keep the information, we will retain it for
          no longer than is necessary for the purposes for which the data
          was collected or for which it is to be further processed.
        </p>
        <p>
          We don't share any personally identifying information publicly or
          with third-parties, except when required to by law.
        </p>
        <p>
          You are free to refuse our request for your personal information,
          with the understanding that we may be unable to provide you with
          some of your desired services.
        </p>
        <p>
          Your continued use of our website will be regarded as acceptance
          of our practices around privacy and personal information.
        </p>
        <p>
          If you wish to delete your account, please be aware that we do not
          hold much, if any, identifying information. The process to delete
          your account will simply be your integration keys (access_token,
          refresh_token and id) be removed from the database. This
          functionally will result in your account not linked to the website
          anymore.
        </p>
        <h3>Related Documents</h3>
        <p>
          In addition to this Privacy Policy, your use of our Website is also governed by our <a href="/terms/end-user-agreement">End User Agreement</a>, which outlines the terms and conditions for using our services.
        </p>
        <p>
          If you have any questions about this Privacy Policy, please contact us via our <a href="/terms/contact">Contact Page</a>.
        </p>


      </main>
      <FooterComponent />
    </div>
  );
}
