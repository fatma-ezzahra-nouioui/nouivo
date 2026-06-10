import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TemplateCard from '../components/TemplateCard';
import { mockTemplates, CATEGORY_GRADIENTS, CATEGORY_LABELS } from '../data/mockTemplates';
import { getTemplateComponent } from '../templates';

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const FIELD_LABELS = {
  bride_name:     "Bride's Name",
  groom_name:     "Groom's Name",
  date:           'Date',
  time:           'Time',
  venue:          'Venue',
  name:           'Name',
  age:            'Age',
  sender_name:    "Sender's Name",
  recipient_name: "Recipient's Name",
  message:        'Message',
  child_name:     "Child's Name",
  event_name:     'Event Name',
  company:        'Company',
  dress_code:     'Dress Code',
  full_name:      'Full Name',
  title:          'Title',
  phone:          'Phone',
  email:          'Email',
  website:        'Website',
};

const CATEGORY_TAGLINES = {
  wedding:       'Two hearts, one forever',
  birthday:      'A day to remember, always',
  engagement:    'The beginning of forever',
  eid:           'Blessed moments shared',
  circumcision:  'A blessed milestone',
  corporate:     'An event worth attending',
  business_card: 'Making lasting impressions',
  valentine:     'Love, written in gold',
};

/* ─── Breadcrumb ────────────────────────────────────────────────────────────── */

function Breadcrumb({ templateTitle }) {
  return (
    <nav
      className="px-4 md:px-6 lg:px-10 py-5"
      style={{ borderBottom: '1px solid rgba(201,169,110,0.08)' }}
      aria-label="Breadcrumb"
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%' }}>
        <ol className="flex items-center gap-2 font-montserrat text-[0.65rem] tracking-wider text-white/30">
          <li>
            <Link to="/" className="hover:text-gold transition-colors duration-300">Home</Link>
          </li>
          <li className="text-gold/25">/</li>
          <li>
            <Link to="/templates" className="hover:text-gold transition-colors duration-300">Templates</Link>
          </li>
          <li className="text-gold/25">/</li>
          <li className="text-white/50 truncate" style={{ maxWidth: '180px' }}>{templateTitle}</li>
        </ol>
      </div>
    </nav>
  );
}

/* ─── Phone mockup ──────────────────────────────────────────────────────────── */

function PhonePreview({ template }) {
  const gradient          = CATEGORY_GRADIENTS[template.category];
  const TemplateComponent = getTemplateComponent(template.component_name);
  const PREVIEW_SLUGS = { WhiteRoseWedding: 'white-rose-demo', EntranceVideoWedding: 'grand-entrance-demo' };
  const previewSlug   = PREVIEW_SLUGS[template.component_name] ?? null;

  const openLaptopPreview = () => {
    if (!previewSlug) return;
    window.open(
      `/i/${previewSlug}`,
      'nouivo-template-preview',
      'width=1280,height=900,noopener,noreferrer',
    );
  };

  return (
    <div className="flex flex-col items-center">
      {/* Label */}
      <button
        type="button"
        onClick={openLaptopPreview}
        disabled={!previewSlug}
        className="font-montserrat text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-5"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: previewSlug ? 'pointer' : 'default',
          opacity: previewSlug ? 1 : 0.6,
          transition: 'text-shadow 0.25s ease, transform 0.25s ease',
        }}
        onMouseEnter={e => {
          if (!previewSlug) return;
          e.currentTarget.style.textShadow = '0 0 18px rgba(201,169,110,0.45)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.textShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        aria-label="Open full screen laptop preview"
        title="Open full screen preview"
      >
        ✦ LIVE PREVIEW ✦
      </button>

      {/* Phone frame */}
      <div style={{
        width: '100%', maxWidth: '390px',
        background: '#191919',
        borderRadius: '44px',
        padding: '14px',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 0 0 3px rgba(0,0,0,0.6), 0 30px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Top pill */}
        <div style={{ height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '88px', height: '16px', background: '#0f0f0f', borderRadius: '8px', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }} />
        </div>

        {/* Screen — 9:16 portrait */}
        <div style={{ background: gradient, borderRadius: '28px', overflow: 'hidden', aspectRatio: '9/16', position: 'relative' }}>
          {TemplateComponent ? (
            <TemplateComponent
              data={{}}
              standalone={false}
            />
          ) : (
            <FallbackPreview template={template} />
          )}
        </div>

        {/* Home bar */}
        <div style={{ height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '88px', height: '4px', background: 'rgba(255,255,255,0.18)', borderRadius: '2px' }} />
        </div>
      </div>

      {/* Caption */}
      <p className="font-montserrat text-[0.6rem] text-white/25 mt-3 text-center" style={{ maxWidth: '200px' }}>
        This is how your guests will see it on their phones
      </p>
    </div>
  );
}

function FallbackPreview({ template }) {
  const tagline = CATEGORY_TAGLINES[template.category] ?? 'A magical invitation';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', position: 'relative', textAlign: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', width: '100%' }}>
        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.48rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.65)', marginBottom: '10px' }}>
          {CATEGORY_LABELS[template.category]}
        </p>
        <h2 style={{ fontFamily: '"Great Vibes", cursive', fontSize: '2.1rem', color: '#faf6f0', lineHeight: 1.15, textShadow: '0 0 24px rgba(201,169,110,0.45)', marginBottom: '10px' }}>
          {template.title}
        </h2>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.6), transparent)', margin: '0 auto 10px' }} />
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
          {tagline}
        </p>
      </div>
    </div>
  );
}

/* ─── Template info ─────────────────────────────────────────────────────────── */

const GOLD_DIVIDER = { height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.28), transparent)', margin: '1.5rem 0' };

function TemplateInfo({ template }) {
  return (
    <div>
      <span
        className="font-montserrat text-[0.6rem] tracking-wider uppercase text-gold inline-block mb-4"
        style={{ border: '1px solid rgba(201,169,110,0.4)', padding: '0.3rem 0.75rem' }}
      >
        {CATEGORY_LABELS[template.category]}
      </span>

      <h1 className="font-cormorant text-cream font-light leading-tight mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', letterSpacing: '0.02em' }}>
        {template.title}
      </h1>

      <p className="font-montserrat text-sm text-white/50 leading-relaxed font-light mb-5">
        {template.description}
      </p>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-0.5 text-gold" aria-label="5 stars" style={{ fontSize: '0.9rem' }}>★★★★★</div>
        <span className="font-montserrat text-xs text-white/32">124 celebrations created</span>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-cormorant text-gold font-light" style={{ fontSize: '2.6rem', lineHeight: 1 }}>
          {template.price.toFixed(3)}
        </span>
        <span className="font-montserrat text-sm text-white/40">TND</span>
      </div>

      <div style={GOLD_DIVIDER} />
    </div>
  );
}

/* ─── What you receive ──────────────────────────────────────────────────────── */

const INCLUDES = [
  'Shareable link — valid for 3 months',
  'PDF version — yours forever',
  'Instant delivery after payment',
];

function WhatYouReceive() {
  return (
    <div className="mb-7">
      <h3 className="font-cormorant italic text-xl text-cream/80 font-light mb-4">What you receive</h3>
      <ul className="flex flex-col gap-3">
        {INCLUDES.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-gold flex-shrink-0" style={{ fontSize: '0.6rem', marginTop: '3px' }}>✦</span>
            <span className="font-montserrat text-xs text-white/55 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
      <p className="font-montserrat text-[0.65rem] text-white/28 mt-4 italic">
        Need more time? Extend your link for 5 TND / 3 months
      </p>
      <div style={GOLD_DIVIDER} />
    </div>
  );
}

/* ─── Text field pills ──────────────────────────────────────────────────────── */

function TextFieldPills({ template }) {
  if (!template.text_fields?.length) return null;
  return (
    <div className="mb-8">
      <h3 className="font-cormorant italic text-xl text-cream/80 font-light mb-4">You will personalize</h3>
      <div className="flex flex-wrap gap-2">
        {template.text_fields.map((field, i) => (
          <span
            key={i}
            className="font-montserrat text-[0.6rem] tracking-wide text-gold"
            style={{ border: '1px solid rgba(201,169,110,0.3)', padding: '0.35rem 0.75rem', borderRadius: '2px', background: 'rgba(201,169,110,0.04)' }}
          >
            {FIELD_LABELS[field] ?? field.replace(/_/g, ' ')}
          </span>
        ))}
      </div>
      <div style={GOLD_DIVIDER} />
    </div>
  );
}

/* ─── CTA block ─────────────────────────────────────────────────────────────── */

function CTABlock({ template }) {
  const navigate = useNavigate();
  return (
    <div className="mb-4">
      <button
        onClick={() => navigate(`/order/${template.id}`)}
        style={{
          display:         'block',
          width:           '100%',
          padding:         '1.1rem 1rem',
          background:      'linear-gradient(135deg, #c9a96e 0%, #e8d5a3 50%, #c9a96e 100%)',
          backgroundSize:  '200% auto',
          color:           '#0a0812',
          border:          'none',
          fontFamily:      '"Montserrat", sans-serif',
          fontSize:        '0.78rem',
          letterSpacing:   '0.18em',
          textTransform:   'uppercase',
          fontWeight:      600,
          cursor:          'pointer',
          transition:      'background-position 0.5s ease, box-shadow 0.3s ease, transform 0.25s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget;
          el.style.backgroundPosition = 'right center';
          el.style.boxShadow = '0 0 40px rgba(201,169,110,0.5), 0 0 80px rgba(201,169,110,0.18)';
          el.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget;
          el.style.backgroundPosition = '0 center';
          el.style.boxShadow = 'none';
          el.style.transform = 'translateY(0)';
        }}
      >
        Get This Template — {template.price.toFixed(3)} TND
      </button>

      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="text-white/22" style={{ fontSize: '0.7rem' }}>🔒</span>
        <span className="font-montserrat text-[0.6rem] text-white/25 tracking-wider">
          Secure payment via Konnect
        </span>
      </div>
    </div>
  );
}

/* ─── Related templates ─────────────────────────────────────────────────────── */

function RelatedTemplates({ template }) {
  const related = mockTemplates
    .filter(t => t.category === template.category && t.id !== template.id)
    .slice(0, 3);

  if (!related.length) return null;

  return (
    <section
      className="py-16 md:py-20 px-4 md:px-6 lg:px-10"
      style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%' }}>
        <h2
          className="font-cormorant text-cream font-light mb-10"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '0.02em' }}
        >
          You might also love
        </h2>
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-5 pb-2" style={{ width: 'max-content' }}>
            {related.map((t, i) => (
              <div key={t.id} style={{ width: '260px', flexShrink: 0 }}>
                <TemplateCard template={t} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Not found ─────────────────────────────────────────────────────────────── */

function NotFound() {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-6"
      style={{ minHeight: '80vh', background: '#0a0812' }}
    >
      <div
        className="font-cormorant text-gold select-none"
        style={{ fontSize: '4rem', opacity: 0.22, lineHeight: 1, marginBottom: '1.5rem' }}
        aria-hidden="true"
      >
        ✦
      </div>
      <h2 className="font-cormorant italic text-3xl text-cream/50 font-light mb-3">
        This design does not exist
      </h2>
      <p className="font-montserrat text-xs text-white/25 mb-10 tracking-widest uppercase">
        The template you're looking for may have been moved or removed
      </p>
      <button onClick={() => navigate('/templates')} className="btn-gold-outline">
        Return to Templates
      </button>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function TemplateDetail() {
  const { id }   = useParams();
  const template = mockTemplates.find(t => t.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!template) return <NotFound />;

  return (
    <div style={{ background: '#0a0812', minHeight: '100vh' }} className="pt-16 md:pt-20">
      <Breadcrumb templateTitle={template.title} />

      {/* Two-column layout */}
      <div className="px-4 md:px-6 lg:px-10 pt-8 pb-16">
        <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%' }}>
          <div className="flex flex-col md:flex-row gap-10 lg:gap-14 md:items-start">

            {/* Left — sticky phone preview (55% on desktop, full on mobile) */}
            <div
              className="md:w-[55%] shrink-0 md:sticky"
              style={{ top: '100px' }}
            >
              <PhonePreview key={template.id} template={template} />
            </div>

            {/* Right — details */}
            <div className="flex-1 min-w-0 py-2">
              <TemplateInfo    template={template} />
              <WhatYouReceive />
              <TextFieldPills  template={template} />
              <CTABlock        template={template} />
            </div>
          </div>
        </div>
      </div>

      <RelatedTemplates template={template} />
    </div>
  );
}
