/** Calm garden scene for the welcome screen (original SVG). */
export function WelcomeHero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 220" className={className} role="img" aria-label="Taman kecil dengan matahari, pohon, dan bunga">
      <rect x="0" y="0" width="320" height="220" rx="32" fill="#dceaf3" />
      <circle cx="252" cy="58" r="26" fill="#f3e6b5" stroke="#e5cf86" strokeWidth="4" />
      <path d="M0 160c60-26 120-26 170-8s110 14 150-6v42a32 32 0 0 1-32 32H32A32 32 0 0 1 0 188z" fill="#dde7d5" />
      <path d="M0 184c70-16 150-10 210 4 40 9 80 6 110-6v6a32 32 0 0 1-32 32H32A32 32 0 0 1 0 188z" fill="#b9cfae" />
      {/* tree */}
      <rect x="78" y="104" width="14" height="56" rx="6" fill="#9a6f4c" />
      <circle cx="85" cy="92" r="34" fill="#8fb487" stroke="#405641" strokeWidth="3" />
      <circle cx="74" cy="84" r="5" fill="#d9705a" />
      <circle cx="98" cy="98" r="5" fill="#d9705a" />
      <circle cx="88" cy="74" r="5" fill="#d9705a" />
      {/* flowers */}
      {[150, 186, 222].map((x, i) => (
        <g key={x} transform={`translate(${x} ${154 + (i % 2) * 8})`}>
          <path d="M0 0v22" stroke="#405641" strokeWidth="3" strokeLinecap="round" />
          {[0, 72, 144, 216, 288].map((d) => (
            <ellipse key={d} cx="0" cy="-8" rx="5" ry="7" transform={`rotate(${d})`} fill={["#f2b8c6", "#f3e6b5", "#dceaf3"][i]} stroke="#405641" strokeWidth="2" />
          ))}
          <circle cx="0" cy="0" r="4" fill="#d58c70" />
        </g>
      ))}
      {/* letter blocks */}
      <g fontFamily="inherit" fontWeight="800" fontSize="20" textAnchor="middle">
        <rect x="236" y="136" width="32" height="32" rx="8" fill="#ffffff" stroke="#405641" strokeWidth="3" />
        <text x="252" y="159" fill="#405641">A</text>
        <rect x="272" y="136" width="32" height="32" rx="8" fill="#f3e6b5" stroke="#405641" strokeWidth="3" />
        <text x="288" y="159" fill="#405641">1</text>
        <rect x="254" y="104" width="32" height="32" rx="8" fill="#e9ddc9" stroke="#405641" strokeWidth="3" />
        <text x="270" y="127" fill="#405641">b</text>
      </g>
    </svg>
  );
}
