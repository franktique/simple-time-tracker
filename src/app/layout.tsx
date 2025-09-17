import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple Time Tracker",
  description: "A simple time tracking application for managing tasks and time entries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getStoredTheme() {
                  try {
                    const stored = localStorage.getItem('theme');
                    return stored && ['light', 'dark', 'system'].includes(stored) ? stored : 'system';
                  } catch (e) {
                    return 'system';
                  }
                }

                function getSystemTheme() {
                  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }

                function calculateActualTheme(theme) {
                  return theme === 'system' ? getSystemTheme() : theme;
                }

                const theme = getStoredTheme();
                const actualTheme = calculateActualTheme(theme);

                if (actualTheme !== 'light') {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add(actualTheme);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
