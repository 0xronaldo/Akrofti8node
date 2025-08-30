"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AkroftLogo } from "@/components/akroft-logo"
import { MedusaAnimation } from "@/components/medusa-animation"
import { Wallet, Blocks, Brain, TrendingUp, Globe } from "lucide-react"

export default function AkroftLandingPage() {
  const [walletAddress, setWalletAddress] = useState("")
  const [email, setEmail] = useState("")

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setWalletAddress(accounts[0])
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    } else {
      alert("Please install MetaMask to connect your wallet")
    }
  }

  const features = [
    {
      icon: <Blocks className="w-8 h-8" />,
      title: "Collaborative Editor",
      description: "Build DeFi flows with teammates in real-time using a visual node-based interface.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Automation",
      description: "Generate code in Solidity, Rust, Cairo, or Python with AI-driven nodes.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Market Integration",
      description: "Fetch real-time market data (e.g., ETH prices) and export as TXT/JSON.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Blockchain",
      description: "Deploy flows on Arbitrum, Stellar, or Starknet with extensible nodes.",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-background opacity-50" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <AkroftLogo />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            <span className="gradient-text">Akroft i8 Node</span>
          </h1>

          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 text-balance">
            Automate DeFi & AI with Collaborative Flows
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Build, collaborate, and deploy on-chain workflows without coding
          </p>

          <Button
            onClick={connectWallet}
            size="lg"
            className="neon-glow bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold"
          >
            <Wallet className="w-5 h-5 mr-2" />
            Connect Wallet
          </Button>

          {walletAddress && (
            <p className="mt-4 text-sm text-muted-foreground">
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">Platform Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 text-primary group-hover:text-accent transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Medusa Section */}
      <section className="py-20">
        <MedusaAnimation />
      </section>

      {/* Registration Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold gradient-text">Join the Beta</CardTitle>
              <CardDescription className="text-lg">Get early access to Akroft i8 Node</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="wallet" className="block text-sm font-medium mb-2">
                  Wallet Address
                </label>
                <Input
                  id="wallet"
                  type="text"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-input border-border focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email (Optional)
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border focus:border-primary"
                />
              </div>

              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3"
                size="lg"
              >
                Register for Beta
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Ready to Build the Future?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Start creating collaborative DeFi and AI workflows today
          </p>

          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-12 py-4 text-xl font-bold neon-glow"
          >
            Enter Flow Editor
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <AkroftLogo />
          </div>
          <p className="text-muted-foreground mb-4">Built for the Aleph Hackathon</p>
          <p className="text-sm text-muted-foreground">© 2024 Akroft i8 Node. Empowering the Web3 ecosystem.</p>
        </div>
      </footer>
    </div>
  )
}