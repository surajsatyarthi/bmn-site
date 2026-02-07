import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { GradientDefinitions } from "@/components/ui/GradientDefinitions";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "BMN - Connect Grow Succeed",
  description: "AI-powered global trade platform for verified exporters and importers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${oswald.variable} font-sans antialiased bg-bmn-light-bg text-text-primary`}
      >
        <GradientDefinitions />
        {children}
      </body>
    </html>
  );
}
