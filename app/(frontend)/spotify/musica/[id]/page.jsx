import SpotifyNowPlaying from "@/app/components/Spotify";

export default async function Spotify(props) {
  const params = await props.params;
  const id = params.id;
  return (
    <SpotifyNowPlaying userId={id} />
  );
}

