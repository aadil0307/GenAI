import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { DashboardProvider } from "@/contexts/dashboard-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "CraftConnect - AI-Powered Artisan Marketplace",
  description: "Discover authentic handcrafted goods and connect with local artisans through AI-driven storytelling and digital reach expansion",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <DashboardProvider>
                  {children}
                </DashboardProvider>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
