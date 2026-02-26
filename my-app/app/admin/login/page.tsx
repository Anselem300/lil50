"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-zinc-900 rounded-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {error && <p className="text-red-500">{error}</p>}

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1">Email</label>
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-black/50 text-white"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-black/50 text-white"
            required
          />
          {/* Show password toggle */}
          <label className="mt-2 text-sm flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="mr-2"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-black py-2 rounded font-bold"
        >
          Login
        </button>
      </form>
    </div>
  );
}