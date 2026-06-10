import { useNavigate } from 'react-router-dom';
import { CATEGORY_GRADIENTS, CATEGORY_LABELS } from '../data/mockTemplates';

function Sparkle({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export default function TemplateCard({ template, index = 0 }) {
  const navigate  = useNavigate();
  const gradient  = CATEGORY_GRADIENTS[template.category] ?? 'linear-gradient(135deg, #1a1a1a, #3a3a3a)';
  const label     = CATEGORY_LABELS[template.category]    ?? template.category;

  const handleClick = () => navigate(`/templates/${template.id}`);

  return (
    <div
      className="template-card rounded-sm overflow-hidden cursor-pointer"
      style={{
        animation:      'fade-up 0.5s ease both',
        animationDelay: `${Math.min(index * 0.06, 0.42)}s`,
      }}
      onClick={handleClick}
    >
      {/* Portrait thumbnail — 9:16 aspect ratio */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '177.78%' }}>
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={`${template.title} thumbnail`}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: gradient }} />

            {/* Central sparkle */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0.2 }}>
              <Sparkle size={72} className="text-gold" />
            </div>
          </>
        )}

        {/* Hover overlay */}
        <div className="template-overlay absolute inset-0 flex items-center justify-center">
          <button
            className="btn-gold-outline text-xs py-2.5 px-5"
            onClick={e => { e.stopPropagation(); handleClick(); }}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 bg-deep/80 border-t border-gold/10">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-cormorant text-xl text-cream font-light leading-tight">
            {template.title}
          </h3>
          <span className="font-montserrat text-[0.6rem] tracking-wider uppercase text-gold border border-gold/40 px-2 py-0.5 flex-shrink-0 whitespace-nowrap">
            {label}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-montserrat text-sm text-gold">
            {template.price.toFixed(3)}{' '}
            <span className="text-xs text-white/40">TND</span>
          </p>
          <span className="font-montserrat text-xs text-gold/70">
            Get this template →
          </span>
        </div>
      </div>
    </div>
  );
}
