import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Templates',    href: '/templates' },
  { label: 'How it works', href: '/#how-it-works' },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen ? 'navbar-scrolled' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="font-vibes text-4xl text-gold leading-none gold-glow-text flex-shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          Nouivo
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="font-montserrat text-xs tracking-widest uppercase text-white/55 hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA — compact, stays cleanly inside the nav bar */}
        <div className="hidden md:flex items-center">
          <Link
            to="/templates"
            className="font-montserrat tracking-widest uppercase text-gold transition-all duration-300"
            style={{
              border:       '1px solid rgba(201,169,110,0.65)',
              padding:      '0.45rem 1.1rem',
              fontSize:     '0.65rem',
              letterSpacing:'0.15em',
              textDecoration:'none',
              background:   'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background  = '#c9a96e';
              e.currentTarget.style.color       = '#0a0812';
              e.currentTarget.style.borderColor = '#c9a96e';
              e.currentTarget.style.boxShadow   = '0 0 18px rgba(201,169,110,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background  = 'transparent';
              e.currentTarget.style.color       = '#c9a96e';
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.65)';
              e.currentTarget.style.boxShadow   = 'none';
            }}
          >
            Browse Templates
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="md:hidden flex flex-col gap-[5px] p-2 group"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span
            className={`block w-6 h-px bg-gold transition-all duration-300 origin-center ${
              mobileOpen ? 'translate-y-[8.5px] rotate-45' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-gold transition-all duration-300 ${
              mobileOpen ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-gold transition-all duration-300 origin-center ${
              mobileOpen ? '-translate-y-[8.5px] -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      <div
        className="md:hidden border-t border-gold/10"
        style={{
          maxHeight:       mobileOpen ? '280px' : '0',
          overflow:        'hidden',
          transition:      'max-height 0.35s ease',
          backgroundColor: 'rgba(10,8,18,0.97)',
          backdropFilter:  'blur(12px)',
        }}
      >
        <div className="px-6 py-6 flex flex-col gap-5 items-center text-center">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-montserrat text-sm tracking-widest uppercase text-white/60 hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/templates"
            onClick={() => setMobileOpen(false)}
            className="font-montserrat text-xs tracking-widest uppercase text-gold mt-2"
            style={{
              border:      '1px solid rgba(201,169,110,0.55)',
              padding:     '0.6rem 1.5rem',
              textDecoration: 'none',
            }}
          >
            Browse Templates
          </Link>
        </div>
      </div>
    </header>
  );
}
