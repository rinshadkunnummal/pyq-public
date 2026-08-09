import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'PYQ - Previous Year Questions Archive',
  description: 'A comprehensive platform for accessing and sharing previous year exam questions. Study smart, prepare better.',
  keywords: 'exam questions, previous year papers, study materials, education',
  openGraph: {
    title: 'PYQ - Previous Year Questions Archive',
    description: 'Access and share previous year exam questions',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-[#0A0A0A] text-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-[#27272A] bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-white mb-4">PYQ</h3>
                <p className="text-zinc-400 text-sm">
                  The platform for sharing and accessing previous year questions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li><a href="/" className="hover:text-white transition">Home</a></li>
                  <li><a href="/papers" className="hover:text-white transition">Papers</a></li>
                  <li><a href="/upload" className="hover:text-white transition">Upload</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Resources</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition">License</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[#27272A] pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-zinc-500 text-sm">&copy; 2026 PYQ. All rights reserved.</p>
              <p className="text-zinc-500 text-sm mt-4 md:mt-0">Built with ❤️ for students</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}