import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppProvider } from "@/context/AppContext";
import { UserProvider } from "@/context/UserContext";
import { RecipesProvider } from "@/context/RecipesContext";
import { SavedProvider } from "@/context/SavedContext";

import DynamicNavigation from "../components/layout/DynamicNavigation";
import DynamicHeader from "../components/layout/DynamicHeader";
import DynamicFooter from "../components/layout/DynamicFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cook Social - Share Your Recipes",
  description: "A social platform for sharing and discovering recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AppProvider>
          <UserProvider>
            <RecipesProvider>
              <SavedProvider>
                <div className="flex flex-col min-h-screen">
                  <DynamicHeader />
                  <main className="flex-1 flex w-full">
                    {children}
                  </main>
                  <DynamicNavigation />
                  <DynamicFooter />
                </div>
              </SavedProvider>
            </RecipesProvider>
          </UserProvider>
        </AppProvider>
      </body>
    </html>
  );
}