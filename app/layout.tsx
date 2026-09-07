import "./globals.css";
import { Inter, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Pipely — CRM for modern sales teams",
  description: "Track leads, automate follow-ups, and close deals faster.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" className={cn("font-sans", geist.variable)}>
        <body>
          <ClerkProvider>{children}</ClerkProvider>
        </body>
      </html>
  );
}