export function AkroftLogo() {
  return (
    <div className="relative w-16 h-16 mx-auto">
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Flowing lines */}
        <path
          d="M8 32 Q32 8 56 32 Q32 56 8 32"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
        />
        <path
          d="M16 32 Q32 16 48 32 Q32 48 16 32"
          stroke="url(#gradient2)"
          strokeWidth="1.5"
          fill="none"
          className="animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Glowing nodes */}
        <circle cx="32" cy="32" r="4" fill="url(#nodeGradient)" className="animate-pulse" />
        <circle
          cx="16"
          cy="24"
          r="2"
          fill="url(#nodeGradient)"
          className="animate-pulse"
          style={{ animationDelay: "0.3s" }}
        />
        <circle
          cx="48"
          cy="40"
          r="2"
          fill="url(#nodeGradient)"
          className="animate-pulse"
          style={{ animationDelay: "0.7s" }}
        />
        <circle
          cx="24"
          cy="48"
          r="2"
          fill="url(#nodeGradient)"
          className="animate-pulse"
          style={{ animationDelay: "0.2s" }}
        />
        <circle
          cx="40"
          cy="16"
          r="2"
          fill="url(#nodeGradient)"
          className="animate-pulse"
          style={{ animationDelay: "0.9s" }}
        />

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.15 195)" />
            <stop offset="100%" stopColor="oklch(0.65 0.25 330)" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.25 330)" />
            <stop offset="100%" stopColor="oklch(0.7 0.15 195)" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="oklch(0.9 0.2 195)" />
            <stop offset="100%" stopColor="oklch(0.7 0.15 195)" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}