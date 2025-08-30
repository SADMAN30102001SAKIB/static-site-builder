import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Static Site Builder - Create Beautiful Websites Without Code",
  description: "A drag-and-drop Static Site Builder for non-technical users",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
