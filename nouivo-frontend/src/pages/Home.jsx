import { Fragment } from 'react';
import heroImg   from '../assets/hero-bg.jpg';
import Fireflies from '../components/Fireflies';
import { useInView } from '../hooks/useInView';
import { mockTemplates as MOCK_TEMPLATES } from '../data/mockTemplates';

/* ─── Static data ───────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { name: 'Wedding',       emoji: '💍', slug: 'wedding' },
  { name: 'Birthday',      emoji: '🎂', slug: 'birthday' },
  { name: 'Engagement',    emoji: '💌', slug: 'engagement' },
  { name: 'Eid & Ramadan', emoji: '☪️',  slug: 'eid' },
  { name: 'Circumcision',  emoji: '🌙', slug: 'circumcision' },
  { name: 'Corporate',     emoji: '🏢', slug: 'corporate' },
  { name: 'Business Card', emoji: '💼', slug: 'business_card' },
  { name: 'Valentine',     emoji: '❤️',  slug: 'valentine' },
];

const STEPS = [
  {
    number: '01',
    icon: '✨',
    title: 'Choose Your Template',
    description: 'Browse our enchanted collection of handcrafted designs for every occasion.',
  },
  {
    number: '02',
    icon: '✍️',
    title: 'Personalize the Details',
    description: 'Add your names, date, venue and personal touch to make it uniquely yours.',
  },
  {
    number: '03',
    icon: '🔗',
    title: 'Share the Magic',
    description: 'Receive your shareable link and PDF instantly. Your guests will be enchanted.',
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    quote: 'Our guests couldn\'t stop asking where we found our invitation. It felt like something out of a fairy tale — absolutely breathtaking.',
    name: 'Yasmine & Karim',
    occasion: 'Wedding · Tunis',
  },
  {
    id: 2,
    quote: 'I sent beautiful invitations to 200 guests in minutes. The design left everyone speechless — they thought we hired a top designer.',
    name: 'Sarah M.',
    occasion: 'Birthday Celebration · Sousse',
  },
  {
    id: 3,
    quote: 'Elegant, professional and incredibly easy. Our corporate event invitation was stunning and the link worked perfectly for all our guests.',
    name: 'Ahmed B.',
    occasion: 'Corporate Event · Sfax',
  },
];

/* ─── Decorative SVG sparkle ────────────────────────────────────────────────── */
function Sparkle({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

/* ─── Section header helper ─────────────────────────────────────────────────── */
function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-14 md:mb-20 px-4">
      {eyebrow && (
        <p className="font-montserrat text-gold text-xs tracking-[0.3em] uppercase mb-4">
          ✦ {eyebrow} ✦
        </p>
      )}
      <h2 className="section-title">{title}</h2>
      <span className="section-divider" />
      {subtitle && (
        <p className="font-montserrat text-sm text-white/45 mt-5 max-w-md mx-auto leading-relaxed font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Section 1 — Hero
   ═══════════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background photo */}
      <img
        src={heroImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />

      {/* Dark overlay — layered for depth */}
      <div className="absolute inset-0 bg-midnight/65" />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center bottom, rgba(201,169,110,0.06) 0%, transparent 70%)' }}
      />

      {/* Fireflies */}
      <Fireflies />

      {/* Center content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p
          className="font-montserrat text-gold text-[0.65rem] tracking-[0.35em] uppercase mb-7"
          style={{ animation: 'fade-up 0.8s ease 0.2s both' }}
        >
          ✦ the magic of celebrations ✦
        </p>

        <h1
          className="font-vibes text-[80px] md:text-[96px] lg:text-[110px] text-white leading-none mb-3 gold-glow-text"
          style={{ animation: 'fade-up 0.8s ease 0.45s both' }}
        >
          Nouivo
        </h1>

        <p
          className="font-cormorant italic text-xl md:text-2xl lg:text-3xl mb-10 font-light"
          style={{ color: 'var(--color-white-soft)', animation: 'fade-up 0.8s ease 0.65s both' }}
        >
          Digital invitations that feel like a dream
        </p>

        <div
          className="flex items-center justify-center gap-4 flex-wrap"
          style={{ animation: 'fade-up 0.8s ease 0.85s both' }}
        >
          <a href="/templates" className="btn-gold-outline">
            Browse Templates
          </a>
          <a
            href="#how-it-works"
            className="font-montserrat text-xs tracking-widest uppercase px-6 py-3 transition-colors duration-300"
            style={{ color: 'var(--color-white-dim)' }}
            onMouseEnter={e => (e.target.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={e => (e.target.style.color = 'var(--color-white-dim)')}
          >
            How it works
          </a>
        </div>
      </div>

      {/* Animated scroll arrow */}
      <a
        href="#categories"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-gold"
        aria-label="Scroll down"
      >
        <div style={{ animation: 'bounce-arrow 2.2s ease-in-out infinite' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </a>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Section 2 — Categories
   ═══════════════════════════════════════════════════════════════════════════════ */
function CategoriesSection() {
  const [ref, isInView] = useInView();

  return (
    <section id="categories" className="py-24 md:py-32 bg-deep">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="explore"
          title="Every Occasion, Enchanted"
          subtitle="From intimate gatherings to grand celebrations, find the perfect design for your moment."
        />

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <a
              key={cat.slug}
              href={`/templates?category=${cat.slug}`}
              className="category-card rounded-sm p-6 md:p-8 flex flex-col items-center gap-4 no-underline"
              style={{
                opacity:    isInView ? 1 : 0,
                transform:  isInView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s ease ${i * 0.07}s, transform 0.6s ease ${i * 0.07}s`,
              }}
            >
              <span className="text-4xl md:text-5xl leading-none" role="img" aria-label={cat.name}>
                {cat.emoji}
              </span>
              <span className="font-montserrat text-xs tracking-widest uppercase text-white/60 text-center">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Section 3 — Featured Templates
   ═══════════════════════════════════════════════════════════════════════════════ */
function TemplateCard({ template, delay }) {
  const BADGE_LABELS = {
    wedding:       'Wedding',
    birthday:      'Birthday',
    business_card: 'Business Card',
  };

  return (
    <div className="template-card rounded-sm overflow-hidden group relative" style={{ transitionDelay: `${delay}s` }}>

      {/* Thumbnail — 16:9 gradient placeholder */}
      <div
        className="relative w-full overflow-hidden"
        style={{ paddingBottom: '56.25%' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: template.gradient }}
        />

        {/* Decorative inner glow */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Sparkle size={64} className="text-gold" />
        </div>

        {/* Hover overlay with preview button */}
        <div className="template-overlay absolute inset-0 flex items-end justify-between p-5">
          <div />
          <button className="btn-gold-outline text-[0.65rem] py-2 px-4">
            Preview
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 bg-deep/80 border-t border-gold/10">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-cormorant text-lg text-cream font-light leading-tight">
            {template.title}
          </h3>
          <span className="font-montserrat text-[0.6rem] tracking-wider uppercase text-gold border border-gold/40 px-2 py-0.5 flex-shrink-0">
            {BADGE_LABELS[template.category] ?? template.category}
          </span>
        </div>
        <p className="font-montserrat text-sm text-gold mt-2">
          {template.price.toFixed(3)} <span className="text-xs text-white/40">TND</span>
        </p>
      </div>
    </div>
  );
}

function FeaturedTemplatesSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-24 md:py-32 bg-midnight relative overflow-hidden">
      {/* Corner sparkles */}
      <Sparkle size={32} className="corner-decor text-gold top-8 left-8" />
      <Sparkle size={20} className="corner-decor text-gold top-8 right-8" />
      <Sparkle size={20} className="corner-decor text-gold bottom-8 left-8" />
      <Sparkle size={32} className="corner-decor text-gold bottom-8 right-8" />

      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="designs"
          title="Our Most Beloved Designs"
          subtitle="Each template is a handcrafted world waiting for your story."
        />

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {MOCK_TEMPLATES.map((template, i) => (
            <div
              key={template.id}
              style={{
                opacity:    isInView ? 1 : 0,
                transform:  isInView ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
              }}
            >
              <TemplateCard template={template} delay={i * 0.15} />
            </div>
          ))}
        </div>

        {/* See all link */}
        <div className="text-center mt-12">
          <a href="/templates" className="btn-gold-outline">
            View All Templates
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Section 4 — How it works
   ═══════════════════════════════════════════════════════════════════════════════ */
function HowItWorksSection() {
  const [ref, isInView] = useInView();

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 relative"
      style={{ background: 'linear-gradient(180deg, #110d1f 0%, #0f0b1a 100%)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          eyebrow="process"
          title="Three Magical Steps"
          subtitle="From choosing your design to sharing the magic — it takes minutes, not days."
        />

        {/* Steps grid */}
        <div ref={ref} className="flex flex-col md:flex-row md:items-start gap-12 md:gap-0">
          {STEPS.map((step, i) => (
            <Fragment key={step.number}>
              {/* Step */}
              <div
                className="w-full flex-1 flex flex-col items-center text-center px-4 md:px-8"
                style={{
                  opacity:    isInView ? 1 : 0,
                  transform:  isInView ? 'translateY(0)' : 'translateY(28px)',
                  transition: `opacity 0.7s ease ${i * 0.2}s, transform 0.7s ease ${i * 0.2}s`,
                }}
              >
                {/* Large number */}
                <div
                  className="font-cormorant leading-none mb-3 select-none"
                  style={{ fontSize: '5rem', color: 'rgba(201,169,110,0.18)', fontWeight: 300 }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-3xl mb-5">{step.icon}</div>

                {/* Title */}
                <h3 className="font-cormorant text-2xl text-gold-light font-light mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="font-montserrat text-xs leading-relaxed font-light" style={{ color: 'var(--color-white-dim)' }}>
                  {step.description}
                </p>
              </div>

              {/* Connector line — between steps, desktop only */}
              {i < 2 && (
                <div
                  className="hidden md:flex items-center flex-shrink-0 self-start"
                  style={{ marginTop: '2.8rem', width: '3rem' }}
                >
                  <div className="w-full border-t border-dashed border-gold/25" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Section 5 — Testimonials
   ═══════════════════════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-24 md:py-32 bg-deep">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="stories"
          title="Moments We've Helped Create"
          subtitle="Real celebrations, real magic."
        />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className="testimonial-card rounded-sm p-8 flex flex-col gap-5 items-center text-center md:items-start md:text-left"
              style={{
                opacity:    isInView ? 1 : 0,
                transform:  isInView ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 text-gold text-lg" aria-label="5 stars">
                {'★★★★★'}
              </div>

              {/* Quote */}
              <blockquote className="font-cormorant italic text-lg text-cream/80 leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>

              {/* Attribution */}
              <div>
                <p className="font-montserrat text-sm text-gold-light font-medium">{t.name}</p>
                <p className="font-montserrat text-xs text-white/40 mt-0.5">{t.occasion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Section 6 — CTA
   ═══════════════════════════════════════════════════════════════════════════════ */
function CTASection() {
  const [ref, isInView] = useInView();

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-midnight py-24">

      {/* Radial gold glow */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          style={{
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0.04) 45%, transparent 70%)',
          }}
        />
      </div>

      {/* Fireflies */}
      <Fireflies />

      {/* Content */}
      <div
        ref={ref}
        className="relative z-10 text-center px-6 max-w-2xl mx-auto"
        style={{
          opacity:    isInView ? 1 : 0,
          transform:  isInView ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <p className="font-montserrat text-gold text-[0.65rem] tracking-[0.3em] uppercase mb-6">
          ✦ begin your story ✦
        </p>

        <h2
          className="font-vibes text-[64px] md:text-[80px] text-white leading-none mb-6 gold-glow-text"
        >
          Your story begins here
        </h2>

        <p className="font-cormorant italic text-xl text-white/70 mb-10">
          Create an invitation as enchanting as your celebration.
        </p>

        <a href="/templates" className="btn-gold-solid">
          Start Creating
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Footer
   ═══════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-midnight border-t border-gold/10 py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <p className="font-vibes text-4xl text-gold leading-none mb-2">Nouivo</p>
            <p className="font-montserrat text-xs text-white/35 leading-relaxed max-w-xs">
              Enchanted digital invitations for every celebration — delivered instantly, treasured forever.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3 items-center text-center md:items-start md:text-left">
            <p className="font-montserrat text-[0.6rem] tracking-widest uppercase text-gold/60 mb-1">
              Explore
            </p>
            {['Templates', 'How it works', 'Contact'].map(link => (
              <a
                key={link}
                href={`/${link.toLowerCase().replace(/ /g, '-')}`}
                className="font-montserrat text-xs text-white/40 hover:text-gold transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Tunisia badge */}
          <div className="flex flex-col items-center justify-center md:items-end md:justify-end">
            <p className="font-montserrat text-xs text-white/30">
              Made with ✨ in Tunisia
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gold/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-montserrat text-[0.65rem] text-white/25">
            © {new Date().getFullYear()} Nouivo. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Use'].map(link => (
              <a
                key={link}
                href="#"
                className="font-montserrat text-[0.65rem] text-white/25 hover:text-gold/60 transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Page export
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedTemplatesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </>
  );
}
