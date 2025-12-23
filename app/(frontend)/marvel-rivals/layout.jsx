export const metadata = {
  title: "c4ldas - Marvel Rivals",
  description: "Marvel Rivals commands to be used on stream",

  // OpenGraph / Facebook
  openGraph: {
    title: "c4ldas - Marvel Rivals",
    description: "Marvel Rivals commands to be used on stream",
    url: "https://c4ldas.com.br",
    creator: "@c4ldas",
    images: "/images/cover/marvel-rivals.png",
  },

  // Twitter
  twitter: {
    title: "c4ldas - Marvel Rivals",
    description: "Marvel Rivals commands to be used on stream",
    site: "https://c4ldas.com.br",
    creator: "@c4ldas",
    image: "/images/cover/marvel-rivals.png",
  }
};

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}