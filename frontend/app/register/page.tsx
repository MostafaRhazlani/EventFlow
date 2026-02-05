"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { registerAction } from "@/lib/actions/register";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerAction({ firstName, lastName, email, password });
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
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

          {/* Gradient Overlay */}
          <div className="absolute inset-0 rounded-4xl bg-gradient-to-t from-purple-900/80 via-purple-800/40 to-transparent" />

          {/* Logo Overlay */}
          <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
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
        <div className="w-full lg:w-2/5 p-6 sm:p-10 lg:p-12 lg:px-20 flex flex-col justify-center">
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
              Create an Account
            </h1>
            <p className="text-gray-500">
              Join us today! Enter your details to register.
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
             {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}
             {/* First Name & Last Name */}
             <div className="flex gap-4">
                <div className="w-1/2">
                    <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        First Name
                    </label>
                    <Input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="w-1/2">
                    <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Last Name
                    </label>
                    <Input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                        disabled={loading}
                    />
                </div>
             </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
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
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-12"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <Button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
