import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Fireflies    from '../components/Fireflies';
import TemplateCard from '../components/TemplateCard';
import { mockTemplates } from '../data/mockTemplates';

const FILTERS = [
  { key: 'all',           label: 'All ✦'           },
  { key: 'wedding',       label: 'Wedding 💍'       },
  { key: 'birthday',      label: 'Birthday 🎂'      },
  { key: 'engagement',    label: 'Engagement 💌'    },
  { key: 'eid',           label: 'Eid & Ramadan ☪️'  },
  { key: 'circumcision',  label: 'Circumcision 🌙'  },
  { key: 'corporate',     label: 'Corporate 🏢'     },
  { key: 'business_card', label: 'Business Card 💼' },
  { key: 'valentine',     label: 'Valentine ❤️'      },
];

/* ─── Page header ───────────────────────────────────────────────────────────── */
function PageHeader() {
  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden text-center"
      style={{
        paddingTop:    '9rem',
        paddingBottom: '6rem',
        background:    'linear-gradient(180deg, #0a0812 0%, #110d1f 100%)',
      }}
    >
      {/* Radial gold glow */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div style={{
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, rgba(201,169,110,0.03) 50%, transparent 70%)',
        }} />
      </div>

      <Fireflies />

      <div className="relative z-10 px-6 max-w-2xl mx-auto">
        <p
          className="font-montserrat text-gold text-[0.65rem] tracking-[0.3em] uppercase mb-6"
          style={{ animation: 'fade-up 0.7s ease 0.1s both' }}
        >
          ✦ OUR COLLECTION ✦
        </p>

        <h1
          className="font-cormorant text-cream font-light leading-none mb-6 gold-glow-text"
          style={{
            animation:    'fade-up 0.7s ease 0.3s both',
            fontSize:     'clamp(2.8rem, 7vw, 4.5rem)',
            letterSpacing: '0.04em',
          }}
        >
          Enchanted Templates
        </h1>

        <p
          className="font-montserrat text-sm text-white/45 leading-relaxed font-light"
          style={{ animation: 'fade-up 0.7s ease 0.5s both' }}
        >
          Each design is a handcrafted world waiting for your story.
          <br className="hidden md:block" />
          Find the perfect invitation for your most magical moments.
        </p>
      </div>
    </section>
  );
}

/* ─── Filter bar ────────────────────────────────────────────────────────────── */
function FilterBar({ activeCategory, onFilter }) {
  return (
    <div
      className="sticky top-16 md:top-20 z-40"
      style={{
        background:   'var(--color-deep)',
        borderBottom: '1px solid rgba(201,169,110,0.18)',
      }}
    >
      <div className="overflow-x-auto hide-scrollbar">
        <div
          className="flex gap-2 py-3 px-4 md:px-6 lg:px-10"
          style={{ minWidth: 'max-content', maxWidth: '72rem', margin: '0 auto' }}
        >
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => onFilter(f.key)}
              className="font-montserrat text-[0.7rem] tracking-wider uppercase px-4 py-2 rounded-sm transition-all duration-300 flex-shrink-0 whitespace-nowrap"
              style={
                f.key === activeCategory
                  ? { background: '#c9a96e',               color: '#0a0812',               border: '1px solid #c9a96e' }
                  : { background: 'transparent',            color: 'rgba(201,169,110,0.8)', border: '1px solid rgba(201,169,110,0.28)' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Empty state ───────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="font-cormorant text-gold mb-6 select-none"
        style={{ fontSize: '3.5rem', opacity: 0.3, lineHeight: 1 }}
        aria-hidden="true"
      >
        ✦
      </div>
      <h3 className="font-cormorant italic text-2xl text-cream/50 mb-3 font-light">
        No enchanted designs in this category yet
      </h3>
      <p className="font-montserrat text-xs text-white/30 tracking-widest uppercase">
        Check back soon — magic is being crafted
      </p>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function Templates() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get('category') || 'all'
  );
  const [gridOpacity, setGridOpacity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilter = (category) => {
    if (category === activeCategory) return;
    setGridOpacity(0);
    setTimeout(() => {
      setActiveCategory(category);
      setSearchParams(category === 'all' ? {} : { category });
      setGridOpacity(1);
    }, 200);
  };

  const filtered = activeCategory === 'all'
    ? mockTemplates
    : mockTemplates.filter(t => t.category === activeCategory);

  return (
    <>
      <PageHeader />

      <FilterBar activeCategory={activeCategory} onFilter={handleFilter} />

      <main
        style={{ background: '#0a0812', minHeight: '60vh' }}
        className="py-12 md:py-16 px-4 md:px-6 lg:px-10"
      >
        <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%' }}>

          {/* Count */}
          <p className="font-montserrat text-[0.65rem] text-gold/50 tracking-widest uppercase mb-8">
            Showing {filtered.length} template{filtered.length !== 1 ? 's' : ''}
          </p>

          {/* Grid with fade transition */}
          <div style={{ opacity: gridOpacity, transition: 'opacity 0.2s ease' }}>
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((template, i) => (
                  <TemplateCard
                    key={`${activeCategory}-${template.id}`}
                    template={template}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
