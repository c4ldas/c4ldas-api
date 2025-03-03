import SpotifyNowPlaying from "@/app/components/Spotify";

export default function Spotify({ params }) {
  const id = params.id;
  return (
    <SpotifyNowPlaying userId={id} />
  );
}

