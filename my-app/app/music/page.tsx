"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type SongWithId = {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string;
  coverUrl: string | null;
  createdAt: string;
};

export default function MusicPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [songs, setSongs] = useState<SongWithId[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<SongWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const searchParams = useSearchParams();
  const songIdParam = searchParams?.get("songId");

  // Fetch songs safely
  useEffect(() => {
    async function fetchSongs() {
      try {
        const res = await fetch("/api/songs");

        if (!res.ok) {
          console.error("Failed to fetch songs, status:", res.status);
          setSongs([]);
          setFilteredSongs([]);
          return;
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : { songs: [] };

        setSongs(data.songs || []);
        setFilteredSongs(data.songs || []);
      } catch (err) {
        console.error("Error fetching songs:", err);
        setSongs([]);
        setFilteredSongs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  // Filter songs when search changes
  useEffect(() => {
    if (!search.trim()) {
      setFilteredSongs(songs);
    } else {
      setFilteredSongs(
        songs.filter((song) =>
          song.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, songs]);

  // Auto-show a song if shared via URL
  useEffect(() => {
    if (songIdParam && songs.length > 0) {
      const songToPlay = songs.find((s) => s.id.toString() === songIdParam);
      if (songToPlay) {
        setFilteredSongs([songToPlay]);
      }
    }
  }, [songIdParam, songs]);

  // Share handler
  const handleShare = (song: SongWithId) => {
    try {
      // Use site URL with songId query param
      const songUrl = `${window.location.origin}/music?songId=${song.id}`;

      if (navigator.share) {
        navigator
          .share({
            title: song.title,
            text: `Check out this song: ${song.title}`,
            url: songUrl,
          })
          .catch((err) => console.error("Error sharing:", err));
      } else {
        navigator.clipboard.writeText(songUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error generating share URL:", err);
      alert("Unable to share this song.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 relative">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-xl font-bold tracking-widest">LIL 50</h1>

          {/* Desktop Nav */}
          <nav className="hidden gap-8 text-sm uppercase tracking-wide md:flex">
            <Link href="/" className="hover:text-red-500 transition">
              Home
            </Link>
            <Link href="#music" className="text-red-500 font-bold transition">
              Music
            </Link>
            <Link href="/videos" className="hover:text-red-500 transition">
              Videos
            </Link>
            <Link href="/#contact" className="hover:text-red-500 transition">
              Booking
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col gap-1"
          >
            <span className="h-[2px] w-6 bg-white"></span>
            <span className="h-[2px] w-6 bg-white"></span>
            <span className="h-[2px] w-6 bg-white"></span>
          </button>
        </div>

        {/* Mobile Side Menu */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/70 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
              />

              <motion.div
                className="fixed top-0 right-0 h-full w-64 bg-zinc-900 z-50 p-8 flex flex-col gap-6 uppercase tracking-wide"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                <button
                  onClick={() => setMenuOpen(false)}
                  className="self-end text-white text-xl"
                >
                  ✕
                </button>

                <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">
                  Home
                </Link>
                <Link href="#music" onClick={() => setMenuOpen(false)} className="text-red-500 font-bold transition">
                  Music
                </Link>
                <Link href="#videos" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">
                  Videos
                </Link>
                <Link href="#contact" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">
                  Booking
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Music Section */}
      <motion.section
        id="music"
        className="bg-zinc-950 py-24"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="mx-auto max-w-6xl px-6">
          {/* Heading + Back */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-3xl font-bold uppercase tracking-wide text-white">
              Latest Releases
            </h3>
            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search songs by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/2 p-3 rounded bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </div>

          {loading ? (
            <p className="text-white text-center">Loading songs...</p>
          ) : filteredSongs.length === 0 ? (
            <p className="text-white text-center">No songs found.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {filteredSongs.map((song) => (
                <div
                  key={song.id}
                  className="relative rounded-lg bg-zinc-900 p-6 flex flex-col justify-between overflow-hidden"
                  style={{
                    backgroundImage: `url("${song.coverUrl ?? "/images/default_cover.jpg"}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/50"></div>
                  <div className="relative z-10 flex flex-col">
                    <h4 className="text-xl font-semibold text-white">{song.title}</h4>
                    {song.description && (
                      <p className="mt-2 text-white/80">{song.description}</p>
                    )}
                    <audio
                      controls
                      className="mt-4 w-full rounded bg-black/50"
                      src={song.fileUrl}
                      preload="none"
                    >
                      Your browser does not support the audio element.
                    </audio>
                    <div className="mt-2 flex justify-center gap-4">
                      <a
                        href={song.fileUrl}
                        download
                        className="inline-block text-red-500 hover:underline"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleShare(song)}
                        className="inline-block text-red-500 hover:underline"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Lil 50. All rights reserved.
      </footer>
    </div>
  );
}