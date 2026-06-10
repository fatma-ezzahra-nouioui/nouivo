import { useMemo } from 'react';

// Generated once per module load — stable across re-renders
const FIREFLY_DATA = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left:    Math.random() * 100,
  top:     15 + Math.random() * 70,
  duration: 3.5 + Math.random() * 5,
  glowDur:  1.5 + Math.random() * 2,
  delay:    Math.random() * 6,
  drift:    (Math.random() - 0.5) * 70,
  size:     2 + Math.random() * 2.5,
}));

export default function Fireflies({ className = '' }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {FIREFLY_DATA.map(f => (
        <div
          key={f.id}
          className="firefly"
          style={{
            left:        `${f.left}%`,
            top:         `${f.top}%`,
            width:       `${f.size}px`,
            height:      `${f.size}px`,
            '--duration': `${f.duration}s`,
            '--glow-dur': `${f.glowDur}s`,
            '--delay':    `${f.delay}s`,
            '--drift':    `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
