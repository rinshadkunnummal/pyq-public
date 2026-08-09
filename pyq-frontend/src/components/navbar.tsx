"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#27272A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-zinc-300 to-zinc-500 rounded-lg flex items-center justify-center font-bold text-black text-sm group-hover:from-zinc-200 group-hover:to-zinc-400 transition-all">
              PYQ
            </div>
            <span className="font-bold text-white text-lg hidden sm:inline">
              PYQ
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className={`text-sm ${
                  isActive("/")
                    ? "bg-zinc-700 text-white hover:bg-zinc-600"
                    : "text-zinc-400 hover:text-white hover:bg-[#111111]"
                }`}
              >
                Home
              </Button>
            </Link>
            <Link href="/papers">
              <Button
                variant={isActive("/papers") ? "default" : "ghost"}
                className={`text-sm ${
                  isActive("/papers")
                    ? "bg-zinc-700 text-white hover:bg-zinc-600"
                    : "text-zinc-400 hover:text-white hover:bg-[#111111]"
                }`}
              >
                Papers
              </Button>
            </Link>
            <Link href="/upload">
              <Button
                variant={isActive("/upload") ? "default" : "ghost"}
                className={`text-sm ${
                  isActive("/upload")
                    ? "bg-zinc-700 text-white hover:bg-zinc-600"
                    : "text-zinc-400 hover:text-white hover:bg-[#111111]"
                }`}
              >
                Upload
              </Button>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* GitHub Icon Button */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              Github
            </a>

            {/* Mobile Menu - could be expanded with a dropdown */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-[#111111]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 border-t border-[#27272A]">
          <div className="flex flex-col gap-2 pt-4">
            <Link href="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className={`w-full justify-start text-sm ${
                  isActive("/")
                    ? "bg-zinc-700 text-white hover:bg-zinc-600"
                    : "text-zinc-400 hover:text-white hover:bg-[#111111]"
                }`}
              >
                Home
              </Button>
            </Link>
            <Link href="/papers">
              <Button
                variant={isActive("/papers") ? "default" : "ghost"}
                className={`w-full justify-start text-sm ${
                  isActive("/papers")
                    ? "bg-zinc-700 text-white hover:bg-zinc-600"
                    : "text-zinc-400 hover:text-white hover:bg-[#111111]"
                }`}
              >
                Papers
              </Button>
            </Link>
            <Link href="/upload">
              <Button
                variant={isActive("/upload") ? "default" : "ghost"}
                className={`w-full justify-start text-sm ${
                  isActive("/upload")
                    ? "bg-zinc-700 text-white hover:bg-zinc-600"
                    : "text-zinc-400 hover:text-white hover:bg-[#111111]"
                }`}
              >
                Upload
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
