import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CANVION — Where Minds Collaborate",
  description: "AI-powered collaborative canvas where human and Brains create together. HTML-native, numerologically aligned (33).",
  icons: {
    icon: "✦",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
