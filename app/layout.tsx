import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mouse-Driven Section Resizer for Next.js",
  description: "Mouse-Driven Div Group Resizing for Responsive Layouts. with Next.js, Tailwind CSS and TypeScript, inspired by CodeSandbox Websites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
