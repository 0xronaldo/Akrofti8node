export function MedusaAnimation() {
  return (
    <div className="relative w-full h-96 overflow-hidden bg-gradient-to-b from-background to-muted">
      {/* Medusa 1 */}
      <div className="absolute top-8 left-1/4 medusa">
        <svg width="120" height="160" viewBox="0 0 120 160" className="opacity-60">
          {/* Body */}
          <ellipse cx="60" cy="40" rx="25" ry="35" fill="url(#medusaGradient1)" />

          {/* Tentacles */}
          <path
            d="M35 70 Q20 90 25 120 Q30 140 15 155"
            stroke="url(#tentacleGradient1)"
            strokeWidth="3"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M45 75 Q30 95 35 125 Q40 145 25 160"
            stroke="url(#tentacleGradient1)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M60 80 Q60 100 55 130 Q50 150 60 160"
            stroke="url(#tentacleGradient1)"
            strokeWidth="3"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M75 75 Q90 95 85 125 Q80 145 95 160"
            stroke="url(#tentacleGradient1)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M85 70 Q100 90 95 120 Q90 140 105 155"
            stroke="url(#tentacleGradient1)"
            strokeWidth="3"
            fill="none"
            opacity="0.8"
          />

          <defs>
            <radialGradient id="medusaGradient1">
              <stop offset="0%" stopColor="oklch(0.7 0.15 195 / 0.6)" />
              <stop offset="100%" stopColor="oklch(0.65 0.25 330 / 0.3)" />
            </radialGradient>
            <linearGradient id="tentacleGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.7 0.15 195 / 0.8)" />
              <stop offset="100%" stopColor="oklch(0.65 0.25 330 / 0.4)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Medusa 2 */}
      <div className="absolute top-16 right-1/4 medusa" style={{ animationDelay: "2s" }}>
        <svg width="100" height="140" viewBox="0 0 100 140" className="opacity-50">
          <ellipse cx="50" cy="35" rx="20" ry="30" fill="url(#medusaGradient2)" />

          <path
            d="M30 60 Q15 80 20 110 Q25 130 10 140"
            stroke="url(#tentacleGradient2)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M40 65 Q25 85 30 115 Q35 135 20 140"
            stroke="url(#tentacleGradient2)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M50 70 Q50 90 45 120 Q40 140 50 140"
            stroke="url(#tentacleGradient2)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M60 65 Q75 85 70 115 Q65 135 80 140"
            stroke="url(#tentacleGradient2)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M70 60 Q85 80 80 110 Q75 130 90 140"
            stroke="url(#tentacleGradient2)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.7"
          />

          <defs>
            <radialGradient id="medusaGradient2">
              <stop offset="0%" stopColor="oklch(0.65 0.25 330 / 0.5)" />
              <stop offset="100%" stopColor="oklch(0.6 0.2 240 / 0.3)" />
            </radialGradient>
            <linearGradient id="tentacleGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.65 0.25 330 / 0.7)" />
              <stop offset="100%" stopColor="oklch(0.6 0.2 240 / 0.3)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Medusa 3 */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 medusa" style={{ animationDelay: "4s" }}>
        <svg width="80" height="120" viewBox="0 0 80 120" className="opacity-40">
          <ellipse cx="40" cy="30" rx="18" ry="25" fill="url(#medusaGradient3)" />

          <path
            d="M22 50 Q7 70 12 100 Q17 115 2 120"
            stroke="url(#tentacleGradient3)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M32 55 Q17 75 22 105 Q27 120 12 120"
            stroke="url(#tentacleGradient3)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M40 60 Q40 80 35 110 Q30 120 40 120"
            stroke="url(#tentacleGradient3)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M48 55 Q63 75 58 105 Q53 120 68 120"
            stroke="url(#tentacleGradient3)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M58 50 Q73 70 68 100 Q63 115 78 120"
            stroke="url(#tentacleGradient3)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />

          <defs>
            <radialGradient id="medusaGradient3">
              <stop offset="0%" stopColor="oklch(0.6 0.2 240 / 0.4)" />
              <stop offset="100%" stopColor="oklch(0.7 0.15 195 / 0.2)" />
            </radialGradient>
            <linearGradient id="tentacleGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.6 0.2 240 / 0.6)" />
              <stop offset="100%" stopColor="oklch(0.7 0.15 195 / 0.2)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Overlay text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Visualize Your Flows</h3>
          <p className="text-muted-foreground text-lg">Nodes that Connect and Automate</p>
        </div>
      </div>
    </div>
  )
}