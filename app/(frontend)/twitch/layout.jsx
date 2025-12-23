export const metadata = {
  title: "c4ldas - Twitch",
  description: "Twitch commands to be used on stream",

  // OpenGraph / Facebook
  openGraph: {
    title: "c4ldas - Twitch",
    description: "Twitch commands to be used on stream",
    url: "https://c4ldas.com.br",
    creator: "@c4ldas",
    images: "/images/cover/twitch.png",
  },

  // Twitter
  twitter: {
    title: "c4ldas - Twitch",
    description: "Twitch commands to be used on stream",
    site: "https://c4ldas.com.br",
    creator: "@c4ldas",
    image: "/images/cover/twitch.png",
  }
};

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}