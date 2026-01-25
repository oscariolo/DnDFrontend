import type { Metadata } from 'next';
import './globals.css';
import { tiamatFont } from './ui/fonts';
import Link from 'next/link';
import Menu from './shared/components/Menu';
import { AuthProvider } from './lib/context/AuthContext'


export const metadata: Metadata = {
  title: "D&D Campaign Manager",
  description: "Manage your Dungeons & Dragons campaigns, characters, and game sessions",
  manifest: "/manifest.json",
  themeColor: "#16213e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "D&D Manager",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${tiamatFont.variable} antialiased`}
        style={{ backgroundColor: "#fefcfb", minHeight: "100vh", margin: 0, display: "flex", flexDirection: "column" }}
      >
        <AuthProvider>
          {/* Fondo papel */}
          <div className="fixed inset-0 z-0 pointer-events-none"
          style={{ 
            backgroundImage: "url('/images/background-bone.jpg')",
            backgroundRepeat: "repeat",
          }}/>
          {/* Header */}
          <header className="relative z-10"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
            height: 64,
            color: '#fff',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            backgroundColor: '#090809',
            backdropFilter: 'saturate(180%) blur(6px)',
          }}>
            <Link href="/" aria-label="D&D Maker home" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'inherit', textDecoration: 'none', fontWeight: 700, fontSize: 18 }}>
              <img src="/images/logo.png" alt="D&D Maker Logo" style={{ width: 50, height: 50 }} />
              <span>D&D Maker</span>
            </Link>

            <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button aria-label="Messages" title="Messages" style={iconButtonStyle} type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21 15a2 2 0 0 1-2 2H8l-5 3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#E6E6E6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <button aria-label="Notifications" title="Notifications" style={iconButtonStyle} type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" stroke="#E6E6E6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#E6E6E6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <Link href="/profile" aria-label="Profile" title="Profile" style={iconButtonStyle as React.CSSProperties}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#E6E6E6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="#E6E6E6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </nav>
          </header>

          {/* Menu */}
          <Menu className="relative z-10"/>

          {/* Main content (flex: 1 to push footer down) */}
          <main className="relative z-10" style={{ flex: 1 }}>
            {children}
          </main>

          {/* Footer */}
          <footer className="relative z-10 w-full bg-[#0d0d0d] text-gray-400 py-16">
            {/* Main footer content */}
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
                <div className="md:col-span-1">
                  <div className="mb-8">
                    <img src="/images/logo.png" alt="D&D Maker Logo" style={{ width: 120, height: 120, marginBottom: 16 }} />
                  </div>

                  <nav className="flex flex-col gap-4 text-sm">
                    <Link href="/help" className="text-gray-400 hover:text-white hover:underline transition">
                      Help Portal
                    </Link>
                    <Link href="/forum" className="text-gray-400 hover:text-white hover:underline transition">
                      Support Forum
                    </Link>
                    <Link href="/privacy-choices" className="text-gray-400 hover:text-white hover:underline transition">
                      Do Not Sell or Share My Personal Information
                    </Link>
                    <Link href="/privacy-choices" className="text-gray-400 hover:text-white hover:underline transition">
                      Your Privacy Choices
                    </Link>
                    <Link href="/cookie-notice" className="text-gray-400 hover:text-white hover:underline transition">
                      Cookie Notice
                    </Link>
                    <Link href="/srd" className="text-gray-400 hover:text-white hover:underline transition">
                      System Reference Document (SRD)
                    </Link>
                  </nav>
                </div>

                <div className="md:col-span-1">
                  <h3 className="text-xs uppercase font-semibold text-white tracking-widest mb-6">About</h3>
                  <nav className="flex flex-col gap-4 text-sm">
                    <Link href="/contact" className="text-gray-400 hover:text-white hover:underline transition">
                      Contact Us
                    </Link>
                    <Link href="/careers" className="text-gray-400 hover:text-white hover:underline transition">
                      Careers
                    </Link>
                    <Link href="/wizards-coast" className="text-gray-400 hover:text-white hover:underline transition">
                      Wizards of the Coast
                    </Link>
                  </nav>
                </div>

                <div className="md:col-span-1">
                  <h3 className="text-xs uppercase font-semibold text-white tracking-widest mb-6">Find Us On Social Media</h3>
                  <div className="flex gap-5">
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="text-white hover:text-gray-300 transition"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>

                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="text-white hover:text-gray-300 transition"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2.458" y="2.458" width="19.084" height="19.084" rx="4.291" />
                        <circle cx="12" cy="12" r="3.5" />
                        <circle cx="18.087" cy="5.913" r="0.913" fill="currentColor" />
                      </svg>
                    </a>

                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="text-white hover:text-gray-300 transition"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>

                    <a
                      href="https://twitch.tv"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitch"
                      className="text-white hover:text-gray-300 transition"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.571 4.714h1.429v4.286h-1.429V4.714zM17.143 4.714h1.429v4.286h-1.429V4.714z" />
                        <path d="M6.857 0L4 2.857v16.571h5.714V24l2.857-2.857h4.286L24 12.571V0H6.857zm15.429 11.429l-3.429 3.429h-4.286l-3.429 3.429v-3.429H7.143V1.429h14.143v10z" />
                      </svg>
                    </a>

                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X (Twitter)"
                      className="text-white hover:text-gray-300 transition"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.868 6.75h-3.308l7.732-8.835L2.882 2.25h6.6l4.67 6.168L18.244 2.25zM17.41 20.452h1.828L6.718 3.975H4.78l12.63 16.477z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-xs uppercase font-semibold text-white tracking-widest mb-6">Download the D&D Beyond App</h3>
                  <div className="flex flex-col gap-4">
                    <a
                      href="https://play.google.com/store"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition group"
                    >
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.609-.914V2.728c0-.393.22-.756.609-.914zm16.959 8.726c-.95-.65-5.738-3.956-5.738-3.956l-8.772 8.724 8.772 8.724s4.788-3.306 5.738-3.956c.95-.65 1.631-1.739 1.631-2.768 0-1.03-.681-2.118-1.631-2.768z" />
                      </svg>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-300">GET IT ON</span>
                        <span className="text-sm font-semibold text-white">Google Play</span>
                      </div>
                    </a>

                    <a
                      href="https://apps.apple.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition group"
                    >
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.3-3.14-2.53C4.25 17.12 2.94 12.75 4.7 9.47c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.08 3.81-.91.64.1 2.45.44 3.61 3.3-.87.53-1.76 1.56-1.83 2.75-.08 1.3 1.03 2.47 2.27 3.04.55.3 1.38.55 1.46 1.3-.08 1.3-1.27 1.7-2.2 2.16z" />
                      </svg>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-300">DOWNLOAD ON THE</span>
                        <span className="text-sm font-semibold text-white">App Store</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 my-8"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 text-center md:text-left mb-3">
                    © 2017–2025 Wizards of the Coast LLC | All Rights Reserved
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed text-center md:text-left max-w-2xl">
                    Dungeons &amp; Dragons, D&amp;D, their respective logos, and all Wizards titles and characters are property of Wizards of the Coast LLC in the U.S.A. and other countries. ©2024 Wizards. All rights reserved. This web site is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC.
                  </p>
                </div>

                <div className="flex items-center gap-6 md:flex-col lg:flex-row">
                  <div className="flex gap-4 text-xs">
                    <Link href="/privacy-policy" className="text-gray-400 hover:text-white hover:underline transition uppercase font-semibold">
                      Privacy Policy
                    </Link>
                    <span className="text-gray-600">|</span>
                    <Link href="/terms-of-service" className="text-gray-400 hover:text-white hover:underline transition uppercase font-semibold">
                      Terms of Service
                    </Link>
                  </div>
                  <div className="flex items-center justify-center bg-white p-1 rounded">
                    <span className="text-xs font-bold text-black">T</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

const iconButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 8,
  background: "transparent",
  border: "none",
  color: "inherit",
  cursor: "pointer",
  transition: "background 0.12s ease",
  padding: 0,
};
