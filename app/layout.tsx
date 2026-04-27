import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Roboto_Flex } from "next/font/google";

import { QueryProvider } from "@/providers";
import { LocationProvider, ShortcutProvider } from "@/contexts";

import "./globals.css";
import "../node_modules/flag-icons/css/flag-icons.min.css";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-roboto-flex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weather Info",
  description:
    "Simple weather information app built with Next.js 13 and Tailwind CSS",
};

export async function getInitialCity() {
  const cookieStore = await cookies();
  return cookieStore.get("user-city")?.value || "";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const city = await getInitialCity();

  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${robotoFlex.className} min-h-full flex flex-col text-gray-800`}
      >
        <QueryProvider>
          <ShortcutProvider>
            <LocationProvider initialLocation={city}>
              {children}
            </LocationProvider>
          </ShortcutProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
