"use client";

import React, { useEffect, useState } from "react";
import "@/public/css/spotify.css";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function SpotifyNowPlaying({ userId }) {
  const { id: paramId } = useParams();
  const id = userId || paramId; // Use prop if provided, else use URL param

  const [origin, setOrigin] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songName, setSongName] = useState("");
  const [songUrl, setSongUrl] = useState("");
  const [artistName, setArtistName] = useState("");
  const [albumArt, setAlbumArt] = useState("");
  const [albumUrl, setAlbumUrl] = useState("");
  const [nextSong, setNextSong] = useState("");
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [showTimeline, setShowTimeline] = useState(true);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Function to format time (mm:ss)
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Function to fetch data from API
  async function fetchSpotifyData() {
    try {
      const response = await fetch(`${origin}/api/spotify/musica/${id}?type=json`);
      const data = await response.json();

      if (data.status === 204) {
        /* console.log("No song playing (204)"); */
        resetUI("Waiting for song to start...");
        return;
      }

      if (data.status === 401) {
        /* console.log("User not registered (401)"); */
        resetUI("User not registered!");
        return;
      }

      updateUI(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Function to update UI with new song data
  function updateUI(data) {
    setSongName(data.name || "Unknown Song");
    setSongUrl(data.song_url || "");
    setArtistName(data.artists_array.map((artist) => artist.name).join(", ") || "Unknown Artist");
    setAlbumArt(data.album_art?.[1]?.url || "");
    setAlbumUrl(data.album_url || "");
    setNextSong(data.next_song ? `Next song: ${data.next_song}` : "");
    setCurrentTime(data.progress_ms / 1000);
    setDuration(data.duration_ms / 1000);
    setIsPlaying(data.is_playing);
    setShowTimeline(true);
  }

  // Function to reset UI when there's no song or user error
  function resetUI(message) {
    setSongName(message);
    setSongUrl("");
    setArtistName("");
    setAlbumArt("https://placeholder.pics/svg/96x96/646464-A7A7A7/000000/waiting");
    setAlbumUrl("");
    setNextSong("");
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setShowTimeline(false);
  }

  // Function to update the timeline progress bar
  function updateTimeline() {
    if (duration > 0) {
      setTimelineProgress((currentTime / duration) * 100);
    }
  }

  useEffect(() => {
    updateTimeline();
  }, [currentTime, duration]);

  useEffect(() => {
    fetchSpotifyData();
    const interval = setInterval(fetchSpotifyData, 3000);
    return () => clearInterval(interval);
  }, [id]);

  // Auto-increment current time while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div id="spotify-container" className="spotify-container">
      {albumArt && <a href={albumUrl}><Image className="album-art" src={albumArt} alt="Album Art" /></a>}
      <div className="song-info">
        <div className="song-header">
          <p className={`song-name ${songName.length > 20 ? "scroll" : ""}`}>{songName}</p>
        </div>
        <p className="artist">{artistName}</p>
        <p className="next-song">{nextSong}</p>
        {showTimeline &&
          <div id="timeline-container" className="timeline-container">
            <span className="time-label elapsedTime">{formatTime(currentTime)}</span>
            <div className="timeline" style={{ width: `${timelineProgress}%` }}></div>
            <span className="time-label durationTime">{formatTime(duration)}</span>
          </div>
        }
      </div>
      <a href={songUrl}><Image className="spotify-logo" src="/images/spotify_logo_green.svg" alt="Spotify Logo" /></a>
    </div>
  );
}
