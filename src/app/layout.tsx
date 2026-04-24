import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat with KawnAI",
  description: "KawnAI chat — ask anything you want to know.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-[#0b0b0c] font-sans text-zinc-100"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
