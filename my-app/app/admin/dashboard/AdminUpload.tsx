"use client";

import { useState } from "react";

export default function AdminUpload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null); // ✅ new state
  const [type, setType] = useState<"song" | "video">("song");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // If song, cover is required
    if (type === "song" && !cover) {
      alert("Please upload a cover image for the song.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);

    if (type === "song" && cover) {
      formData.append("cover", cover); // ✅ append cover
    }

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert(
        `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`
      );
      setTitle("");
      setDescription("");
      setFile(null);
      setCover(null);
    } else {
      const data = await res.json();
      alert(`Upload failed: ${data.error || "Unknown error"}`);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Upload Media</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <select
          value={type}
          onChange={(e) => {
            const selected = e.target.value as "song" | "video";
            setType(selected);

            // Reset files when switching type
            setFile(null);
            setCover(null);
          }}
          className="w-full p-2 rounded bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="song">Song</option>
          <option value="video">Video</option>
        </select>

        {/* Main File Input */}
        <input
          type="file"
          accept={type === "song" ? "audio/*" : "video/*"}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
          className="text-white"
        />

        {/* ✅ Cover input only for songs */}
        {type === "song" && (
          <div>
            <label className="block mb-1 text-sm text-gray-300">
              Song Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCover(e.target.files?.[0] ?? null)}
              required
              className="text-white"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-black py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}