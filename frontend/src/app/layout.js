import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Huff-a-Puff",
  description: "Experience the Ritual.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Forcing the browser to fetch the custom fonts directly */}
        <link 
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400,300&f[]=general-sans@700,600,500,400,300,200&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}