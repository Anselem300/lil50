"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Header */}
      <header className="border-b border-zinc-800 relative">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-xl font-bold tracking-widest">LIL 50</h1>

          {/* Desktop Nav */}
          <nav className="hidden gap-8 text-sm uppercase tracking-wide md:flex">
            <Link href="#about" className="hover:text-red-500 transition">
              About
            </Link>
            <Link href="#music" className="hover:text-red-500 transition">
              Music
            </Link>
            <Link href="#videos" className="hover:text-red-500 transition">
              Videos
            </Link>
            <Link href="#contact" className="hover:text-red-500 transition">
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
              {/* Overlay */}
              <motion.div
                className="fixed inset-0 bg-black/70 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
              />

              {/* Drawer */}
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

                <Link
                  href="#about"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-red-500 transition"
                >
                  About
                </Link>

                <Link
                  href="#music"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-red-500 transition"
                >
                  Music
                </Link>

                <Link
                  href="#videos"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-red-500 transition"
                >
                  Videos
                </Link>

                <Link
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-red-500 transition"
                >
                  Booking
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[85vh] w-full">
          <Image
            src="/lil_50.jpeg"
            alt="Lil 50"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-5xl font-extrabold tracking-tight md:text-7xl">
              LIL 50
            </h2>
            <p className="mt-4 text-lg text-zinc-300">
              New Single Out Now
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="#music"
                className="rounded-full bg-red-600 px-8 py-3 font-semibold uppercase tracking-wide transition hover:bg-red-700"
              >
                Stream Now
              </Link>
              <Link
                href="#contact"
                className="rounded-full border border-white px-8 py-3 uppercase tracking-wide transition hover:bg-white hover:text-black"
              >
                Book Show
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <motion.section
        id="about"
        className="mx-auto max-w-5xl px-6 py-24"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="mb-8 text-3xl font-bold uppercase tracking-wide">
          About Lil 50
        </h3>

        <div className="space-y-6 text-lg leading-8 text-zinc-400">
          <p>
            Lil 50 is an emerging voice in the rap scene, blending raw street
            storytelling with melodic flows and high-energy performances. His
            sound reflects ambition, hustle, and authenticity — delivering music
            that resonates beyond the beat.
          </p>

          <p>
            Raised in an environment where pressure creates diamonds, Lil 50
            channels lived experiences into lyrics that are both vivid and
            calculated. His storytelling captures the realities of survival,
            loyalty, ambition, and elevation — turning personal struggle into
            powerful narratives that connect deeply with listeners.
          </p>

          <p>
            What separates Lil 50 from the crowd is versatility. He transitions
            seamlessly between aggressive punchlines and melodic hooks,
            balancing intensity with emotion. Whether it’s a hard-hitting street
            anthem or a reflective late-night record, his delivery carries
            conviction and presence.
          </p>

          <p>
            On stage, that same intensity transforms into electrifying
            performances. High energy, crowd control, and authenticity define
            every show. With a growing fanbase and a relentless work ethic,
            Lil 50 is building more than buzz — he’s building longevity.
          </p>
        </div>
      </motion.section>

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
    <h3 className="mb-12 text-3xl font-bold uppercase tracking-wide">
      Latest Releases
    </h3>

    <div className="grid gap-8 md:grid-cols-3">
      {/* Track 1 */}
      <div
        className="relative rounded-lg bg-zinc-900 p-6 flex flex-col justify-between overflow-hidden"
        style={{
          backgroundImage: 'url("/images/lil_50_ft_hotboi.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10">
          <h4 className="text-xl font-semibold text-white">Block Lit feat. Hotboii</h4>
          <p className="mt-2 text-white/80">Single • 2026</p>

          <audio
            controls
            className="mt-4 w-full rounded bg-black/50"
            src="/music/Lil_50_-_Block_Lit_feat._Hotboii_(mp3.pm).mp3"
          >
            Your browser does not support the audio element.
          </audio>

          {/* Centered Download */}
          <div className="mt-2 flex justify-center">
            <a
              href="/music/Lil_50_-_Block_Lit_feat._Hotboii_(mp3.pm).mp3"
              download
              className="inline-block text-red-500 hover:underline"
            >
              Download
            </a>
          </div>
        </div>
      </div>

      {/* Track 2 */}
      <div
        className="relative rounded-lg bg-zinc-900 p-6 flex flex-col justify-between overflow-hidden"
        style={{
          backgroundImage: 'url("/images/lil_50_song.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10">
          <h4 className="text-xl font-semibold text-white">Green Hearts</h4>
          <p className="mt-2 text-white/80">Single • 2026</p>

          <audio
            controls
            className="mt-4 w-full rounded bg-black/50"
            src="/music/LIL_50_-_Green_Hearts_(mp3.pm).mp3"
          >
            Your browser does not support the audio element.
          </audio>

          {/* Centered Download */}
          <div className="mt-2 flex justify-center">
            <a
              href="/music/LIL_50_-_Green_Hearts_(mp3.pm).mp3"
              download
              className="inline-block text-red-500 hover:underline"
            >
              Download
            </a>
          </div>
        </div>
      </div>

      {/* Track 3 */}
      <div
        className="relative rounded-lg bg-zinc-900 p-6 flex flex-col justify-between overflow-hidden"
        style={{
          backgroundImage: 'url("/images/lil.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10">
          <h4 className="text-xl font-semibold text-white">Life Today</h4>
          <p className="mt-2 text-white/80">EP • 2025</p>

          <audio
            controls
            className="mt-4 w-full rounded bg-black/50"
            src="/music/Lil_50_-_Life_Today_(mp3.pm).mp3"
          >
            Your browser does not support the audio element.
          </audio>

          {/* Centered Download */}
          <div className="mt-2 flex justify-center">
            <a
              href="/music/Lil_50_-_Life_Today_(mp3.pm).mp3"
              download
              className="inline-block text-red-500 hover:underline"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* See More Tab */}
    <div className="mt-12 flex justify-center">
      <Link
        href="/music"
        className="group inline-flex items-center gap-2 text-lg font-semibold uppercase tracking-wide text-red-500 transition hover:text-red-400"
      >
        See More
        <span className="transition-transform duration-300 group-hover:translate-x-2">
          →
        </span>
      </Link>
    </div>
  </div>
</motion.section>

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
  <div className="flex items-center justify-between mb-12">
    <h3 className="text-3xl font-bold uppercase tracking-wide">
      Videos
    </h3>

    {/* See More Link */}
    <Link
      href="/videos"
      className="group flex items-center gap-2 text-red-500 font-semibold uppercase tracking-wide"
    >
      <span className="relative">
        See More
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 transition-all duration-300 group-hover:w-full"></span>
      </span>

      <motion.span
        initial={{ x: 0 }}
        whileHover={{ x: 6 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <ArrowRight size={18} />
      </motion.span>
    </Link>
  </div>

  <div className="grid gap-8 md:grid-cols-2">
    {/* Video 1 */}
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="group relative aspect-video bg-zinc-800 flex flex-col items-center justify-center overflow-hidden rounded-lg"
    >
      <video
        controls
        className="w-full h-full object-cover rounded-lg"
        src="/videos/tommy_shelby.mp4"
      >
        Your browser does not support the video tag.
      </video>

      {/* Centered Download */}
      <div className="mt-2 flex justify-center w-full">
        <a
          href="/videos/tommy_shelby.mp4"
          download
          className="inline-block text-red-500 hover:underline"
        >
          Download
        </a>
      </div>
    </motion.div>

    {/* Video 2 */}
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="group relative aspect-video bg-zinc-800 flex flex-col items-center justify-center overflow-hidden rounded-lg"
    >
      <video
        controls
        className="w-full h-full object-cover rounded-lg"
        src="/videos/peaky_blinder.mp4"
      >
        Your browser does not support the video tag.
      </video>

      {/* Centered Download */}
      <div className="mt-2 flex justify-center w-full">
        <a
          href="/videos/peaky_blinder.mp4"
          download
          className="inline-block text-red-500 hover:underline"
        >
          Download
        </a>
      </div>
    </motion.div>
  </div>
</motion.section>

      {/* Booking Section */}
      <motion.section
        id="contact"
        className="bg-red-600 py-20 text-center text-black"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-3xl px-6">
          <h3 className="text-3xl font-bold uppercase">
            Booking & Features
          </h3>
          <p className="mt-4 text-lg">
            For bookings, features, and collaborations:
          </p>

          <a
            href="mailto:booking@lil50.com"
            className="mt-6 inline-block rounded-full bg-black px-8 py-3 font-semibold text-white transition hover:bg-zinc-900"
          >
            Contact Management
          </a>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Lil 50. All rights reserved.
      </footer>
    </div>
  );
}