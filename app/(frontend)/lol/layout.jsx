export const metadata = {
  title: "c4ldas - League of Legends",
  description: "League of Legends commands to be used on stream",

  // OpenGraph / Facebook
  openGraph: {
    title: "c4ldas - League of Legends",
    description: "League of Legends commands to be used on stream",
    url: "https://c4ldas.com.br",
    creator: "@c4ldas",
    images: "/images/cover/lol.png",
  },

  // Twitter
  twitter: {
    title: "c4ldas - League of Legends",
    description: "League of Legends commands to be used on stream",
    site: "https://c4ldas.com.br",
    creator: "@c4ldas",
    image: "/images/cover/lol.png",
  }
};

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}