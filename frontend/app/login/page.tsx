"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  return (
    <main className="flex min-h-screen p-4">
      <div className="w-full bg-white overflow-hidden flex flex-col lg:flex-row">
        {/* Left Column - Visual Section */}
        <div className="relative w-full lg:w-3/5">
          {/* Background Image */}
          <Image
            src="/images/event-image.jpg"
            alt=""
            fill
            className="object-cover rounded-4xl"
            priority
          />

          {/* Logo Overlay */}
          <div className="hidden absolute top-6 left-6 lg:flex items-center gap-2 z-10">
            <Image
              src="/images/eventflow.png"
              alt=""
              width={100}
              height={20}
            />
          </div>

          {/* Bottom Text Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
              Experience the Magic
            </h2>
            <p className="text-white/80 text-sm sm:text-base">
              Join thousands of events lovers discovering amazing events every day.
            </p>
          </div>
        </div>

        {/* Right Column - Form Section */}
        <div className="w-full lg:w-2/5 p-6 sm:p-10 lg:p-20 flex flex-col justify-center">
          {/* Header */}
          <div className="flex justify-center mb-6 lg:mb-8">
            <div className="flex items-center gap-2">
              <Image
                src="/images/eventflow.png"
                alt=""
                width={60}
                height={20}
              />
            </div>
          </div>

          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Hi Events Lovers 👋
            </h1>
            <p className="text-gray-500">
              Welcome back! Please login to your account.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-field"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-colors cursor-pointer"
                />
                <span className="text-sm text-gray-600">Remember Me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button type="submit" className="btn-primary">
              Login
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
