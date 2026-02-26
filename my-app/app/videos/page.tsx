"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type VideoWithId = {
  id: number;
  title: string | null;
  description: string | null;
  fileUrl: string;
  createdAt: string;
};

export default function VideosPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [videos, setVideos] = useState<VideoWithId[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const searchParams = useSearchParams();
  const videoIdParam = searchParams?.get("videoId");

  // Fetch videos
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) {
          console.error("Failed to fetch videos, status:", res.status);
          setVideos([]);
          setFilteredVideos([]);
          return;
        }
        const data = await res.json();
        setVideos(data.videos || []);
        setFilteredVideos(data.videos || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideos([]);
        setFilteredVideos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  // Filter videos
  useEffect(() => {
    if (!search.trim()) setFilteredVideos(videos);
    else
      setFilteredVideos(
        videos.filter((v) => v.title?.toLowerCase().includes(search.toLowerCase()))
      );
  }, [search, videos]);

  // Auto-show video if shared via URL
  useEffect(() => {
    if (videoIdParam && videos.length > 0) {
      const videoToPlay = videos.find((v) => v.id.toString() === videoIdParam);
      if (videoToPlay) setFilteredVideos([videoToPlay]);
    }
  }, [videoIdParam, videos]);

  // Share handler
  const handleShare = (video: VideoWithId) => {
    const videoUrl = `${window.location.origin}/videos?videoId=${video.id}`;
    if (navigator.share) {
      navigator
        .share({ title: video.title || "Video", text: `Check out this video: ${video.title}`, url: videoUrl })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(videoUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Load AdSense script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4188387479952764"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Header */}
      <header className="border-b border-zinc-800 relative">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-xl font-bold tracking-widest">LIL 50</h1>

          {/* Desktop Nav */}
          <nav className="hidden gap-8 text-sm uppercase tracking-wide md:flex">
            <Link href="/" className="hover:text-red-500 transition">Home</Link>
            <Link href="/music" className="hover:text-red-500 transition">Music</Link>
            <Link href="#videos" className="text-red-500 font-bold transition">Videos</Link>
          </nav>

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(true)} className="md:hidden flex flex-col gap-1">
            <span className="h-[2px] w-6 bg-white"></span>
            <span className="h-[2px] w-6 bg-white"></span>
            <span className="h-[2px] w-6 bg-white"></span>
          </button>
        </div>

        {/* Mobile Menu */}
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
                <button onClick={() => setMenuOpen(false)} className="self-end text-white text-xl">✕</button>
                <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">Home</Link>
                <Link href="/music" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">Music</Link>
                <Link href="#videos" onClick={() => setMenuOpen(false)} className="text-red-500 font-bold transition">Videos</Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Videos Section */}
      <motion.section
        id="videos"
        className="mx-auto max-w-6xl px-6 py-24"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-12 flex items-center justify-between">
          <h3 className="text-3xl font-bold uppercase tracking-wide">Videos</h3>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">← Back to Home</Link>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search videos by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 p-3 rounded bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />
        </div>

        {loading ? (
          <p className="text-white text-center">Loading videos...</p>
        ) : filteredVideos.length === 0 ? (
          <p className="text-white text-center">No videos found.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {filteredVideos.map((video, index) => (
              <div key={video.id}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="group relative aspect-video bg-zinc-800 flex flex-col items-center justify-center overflow-hidden rounded-lg p-4"
                >
                  <video controls className="w-full aspect-video object-cover rounded-lg" src={video.fileUrl}>
                    Your browser does not support the video tag.
                  </video>

                  <div className="mt-2 flex justify-center gap-4 w-full">
                    <a href={video.fileUrl} download className="inline-block text-red-500 hover:underline">Download</a>
                    <button onClick={() => handleShare(video)} className="inline-block text-red-500 hover:underline">Share</button>
                  </div>
                </motion.div>

                {/* AdSense after every 3 videos */}
                {index > 0 && (index + 1) % 3 === 0 && (
                  <div className="my-4 w-full">
                    <ins
                      className="adsbygoogle"
                      style={{ display: "block" }}
                      data-ad-client="ca-pub-4188387479952764"
                      data-ad-slot="1936850158"
                      data-ad-format="auto"
                      data-full-width-responsive="true"
                    ></ins>
                    <Script
                      id={`adsense-${index}`}
                      strategy="afterInteractive"
                      dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Lil 50. All rights reserved.
      </footer>
    </div>
  );
}