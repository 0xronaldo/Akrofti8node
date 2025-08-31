import { Inter, Orbitron } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import "../styles/medusa.css"

const inter = Inter({ subsets: ["latin"] })
const orbitron = Orbitron({ 
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron"
})

export const metadata = {
  title: "Akroft i8 Node",
  description:
    "Build, collaborate, and deploy on-chain workflows without coding. Automate DeFi & AI with collaborative flows.",
  generator: "Ronaldo developer hard code | v0.app",
  icons: {
    icon: ['/favicon.ico'],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${orbitron.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}