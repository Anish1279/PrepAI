import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "PrepAI",
  description:
    "Premium AI mock interviews, coding rounds, and interview preparation workflows.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} app-scrollbar antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
};
