import type { Metadata } from "next";
import "./globals.css";
import { tiamatFont } from "./ui/fonts";


export const metadata: Metadata = {
  title: "DnD Maker",
  description: "Page dedicated to create characters and campaigns for role playing games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${tiamatFont.variable} antialiased`}
        style={{ backgroundColor: "#090809", minHeight: "100vh", margin: 0 }}
      >
        {/* Header visible to everyone */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1rem",
            height: 64,
            color: "#fff",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            backgroundColor: "#090809",
            backdropFilter: "saturate(180%) blur(6px)",
          }}
        >
          {/* Left: Logo */}
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "inherit",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 18,
            }}
            aria-label="DnD Maker home"
          >
            {/* Simple inline SVG logo */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="11" stroke="#E6E6E6" strokeWidth="1.2" />
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                fontSize="10"
                fill="#E6E6E6"
                fontFamily="sans-serif"
                fontWeight="700"
              >
                D&D
              </text>
            </svg>
            <span>D&amp;D Maker</span>
          </a>

          {/* Right: Icons */}
          <nav aria-label="User menu" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              aria-label="Messages"
              title="Messages"
              style={iconButtonStyle}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H8l-5 3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#E6E6E6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              aria-label="Notifications"
              title="Notifications"
              style={iconButtonStyle}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" stroke="#E6E6E6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#E6E6E6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              aria-label="Profile"
              title="Profile"
              style={iconButtonStyle}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#E6E6E6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="#E6E6E6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}

/* Helper style injected as a JS object so no extra CSS file is required */
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
