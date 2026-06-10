import { Fragment, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link }          from 'react-router-dom';
import { CATEGORY_GRADIENTS, CATEGORY_LABELS }   from '../data/mockTemplates';
import { getTemplate }                           from '../api/templates';
import { createOrder, initiatePayment }          from '../api/orders';

/* ─── Field config ───────────────────────────────────────────────────────────── */

const FIELD_CONFIG = {
  bride_name:     { label: "Bride's Name",     placeholder: 'e.g. Yasmine' },
  groom_name:     { label: "Groom's Name",     placeholder: 'e.g. Karim' },
  date:           { label: 'Event Date',        placeholder: 'e.g. Saturday, 12 July 2025' },
  time:           { label: 'Event Time',        placeholder: 'e.g. 8:00 PM' },
  venue:          { label: 'Venue',             placeholder: 'e.g. Palais des Roses, Gammarth' },
  name:           { label: 'Name',              placeholder: 'e.g. Sarra' },
  age:            { label: 'Age',               placeholder: 'e.g. 25' },
  sender_name:    { label: "Sender's Name",     placeholder: 'e.g. The Ben Ali Family' },
  recipient_name: { label: "Recipient's Name",  placeholder: 'e.g. My Love' },
  message:        { label: 'Personal Message',  placeholder: 'Write something from the heart…', multiline: true },
  full_name:      { label: 'Full Name',         placeholder: 'e.g. Ahmed Ben Salah' },
  title:          { label: 'Job Title',         placeholder: 'e.g. Software Engineer' },
  phone:          { label: 'Phone Number',      placeholder: 'e.g. +216 55 123 456' },
  email:          { label: 'Email Address',     placeholder: 'e.g. ahmed@email.com' },
  website:        { label: 'Website',           placeholder: 'e.g. www.ahmed.com' },
  event_name:     { label: 'Event Name',        placeholder: 'e.g. Annual Gala 2025' },
  company:        { label: 'Company Name',      placeholder: 'e.g. Tech Solutions Tunisia' },
  dress_code:     { label: 'Dress Code',        placeholder: 'e.g. Black Tie' },
  child_name:     { label: "Child's Name",      placeholder: 'e.g. Mohamed' },
};

const BUYER_FIELDS = ['buyer_name', 'buyer_email', 'buyer_phone'];

const BUYER_CONFIG = {
  buyer_name:  { label: 'Your Full Name',    placeholder: 'e.g. Fatma Nouioui',   optional: false },
  buyer_email: { label: 'Email Address',     placeholder: 'e.g. you@email.com',   optional: false },
  buyer_phone: { label: 'Phone (WhatsApp)',  placeholder: 'e.g. +216 55 000 000', optional: true  },
};

const INCLUDES = [
  'Shareable link — valid for 3 months',
  'PDF version — yours to keep forever',
  'Instant delivery after payment',
];

const STEP_LABELS = ['Your Details', 'Review', 'Payment'];

/* ─── Validation ─────────────────────────────────────────────────────────────── */

function validate(values, templateFields) {
  const errs = {};
  templateFields.forEach(f => {
    if (!values[f]?.trim()) errs[f] = 'This field is required';
  });
  if (!values.buyer_name?.trim()) {
    errs.buyer_name = 'Please enter your name';
  }
  if (!values.buyer_email?.trim()) {
    errs.buyer_email = 'Please enter your email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.buyer_email)) {
    errs.buyer_email = 'Please enter a valid email address';
  }
  return errs;
}

/* ─── Spinner ────────────────────────────────────────────────────────────────── */

function Spinner({ color = '#0a0812', size = 17 }) {
  return (
    <span
      aria-hidden
      style={{
        display:       'inline-block',
        width:         `${size}px`,
        height:        `${size}px`,
        border:        `2px solid ${color}44`,
        borderTop:     `2px solid ${color}`,
        borderRadius:  '50%',
        animation:     'spin-slow 0.7s linear infinite',
        verticalAlign: 'middle',
        flexShrink:    0,
      }}
    />
  );
}

/* ─── Loading screen ─────────────────────────────────────────────────────────── */

function LoadingScreen() {
  return (
    <div style={{ minHeight: '80vh', background: '#0a0812', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner color="#c9a96e" size={34} />
    </div>
  );
}

/* ─── Step indicator ─────────────────────────────────────────────────────────── */

function StepIndicator({ step }) {
  return (
    <div className="flex items-center mb-10">
      {STEP_LABELS.map((label, i) => {
        const num      = i + 1;
        const isActive = num === step;
        const isDone   = num < step;
        return (
          <Fragment key={num}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div style={{
                width:          '30px',
                height:         '30px',
                borderRadius:   '50%',
                border:         `1px solid ${isActive || isDone ? '#c9a96e' : 'rgba(201,169,110,0.22)'}`,
                background:     isActive ? '#c9a96e' : isDone ? 'rgba(201,169,110,0.14)' : 'transparent',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
              }}>
                {isDone ? (
                  <span style={{ color: '#c9a96e', fontSize: '0.65rem' }}>✓</span>
                ) : (
                  <span style={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize:   '0.65rem',
                    fontWeight: 600,
                    color:      isActive ? '#0a0812' : 'rgba(201,169,110,0.35)',
                  }}>
                    {num}
                  </span>
                )}
              </div>
              <span style={{
                fontFamily:    '"Montserrat", sans-serif',
                fontSize:      '0.52rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color:         isActive ? '#c9a96e' : isDone ? 'rgba(201,169,110,0.45)' : 'rgba(255,255,255,0.22)',
                marginTop:     '6px',
                whiteSpace:    'nowrap',
              }}>
                {label}
              </span>
            </div>

            {i < STEP_LABELS.length - 1 && (
              <div style={{
                flex:         1,
                height:       '1px',
                borderTop:    `1px dashed ${isDone ? 'rgba(201,169,110,0.45)' : 'rgba(201,169,110,0.22)'}`,
                margin:       '0 8px',
                marginBottom: '20px',
              }} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

/* ─── Field input ────────────────────────────────────────────────────────────── */

function FieldInput({ field, config, value, error, onChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!config?.multiline || !textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value, config?.multiline]);

  const inputType =
    field === 'email' || field === 'buyer_email' ? 'email' :
    field === 'buyer_phone'                       ? 'tel'   : 'text';

  const cls = `nouivo-input${error ? ' error' : ''}`;

  return (
    <div className="mb-5">
      <label style={{
        display:       'block',
        fontFamily:    '"Montserrat", sans-serif',
        fontSize:      '0.6rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color:         error ? 'rgba(220,80,80,0.9)' : 'rgba(201,169,110,0.75)',
        marginBottom:  '8px',
      }}>
        {config?.label ?? field.replace(/_/g, ' ')}
        {config?.optional && (
          <span style={{ color: 'rgba(255,255,255,0.22)', fontStyle: 'italic', fontSize: '0.58rem', textTransform: 'none', letterSpacing: 0, marginLeft: '6px' }}>
            (optional)
          </span>
        )}
      </label>

      {config?.multiline ? (
        <textarea
          ref={textareaRef}
          className={cls}
          value={value}
          rows={3}
          placeholder={config?.placeholder}
          style={{ resize: 'none', overflow: 'hidden' }}
          onChange={e => {
            onChange(e.target.value);
            const el = textareaRef.current;
            if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; }
          }}
        />
      ) : (
        <input
          className={cls}
          type={inputType}
          value={value}
          placeholder={config?.placeholder}
          onChange={e => onChange(e.target.value)}
        />
      )}

      {error && (
        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.58rem', color: 'rgba(220,80,80,0.85)', marginTop: '5px' }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Gold CTA button (shared) ───────────────────────────────────────────────── */

function GoldButton({ children, onClick, disabled, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '10px',
        width:          '100%',
        padding:        '1.05rem',
        background:     disabled
          ? 'rgba(201,169,110,0.45)'
          : 'linear-gradient(135deg, #c9a96e 0%, #e8d5a3 50%, #c9a96e 100%)',
        backgroundSize:  '200% auto',
        color:           '#0a0812',
        border:          'none',
        fontFamily:      '"Montserrat", sans-serif',
        fontSize:        '0.78rem',
        letterSpacing:   '0.18em',
        textTransform:   'uppercase',
        fontWeight:      600,
        cursor:          disabled ? 'not-allowed' : 'pointer',
        transition:      'background-position 0.5s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        if (disabled) return;
        e.currentTarget.style.backgroundPosition = 'right center';
        e.currentTarget.style.boxShadow = '0 0 40px rgba(201,169,110,0.45)';
      }}
      onMouseLeave={e => {
        if (disabled) return;
        e.currentTarget.style.backgroundPosition = '0 center';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display:       'block',
        width:         '100%',
        padding:       '0.85rem',
        background:    'transparent',
        color:         'rgba(201,169,110,0.65)',
        border:        '1px solid rgba(201,169,110,0.22)',
        fontFamily:    '"Montserrat", sans-serif',
        fontSize:      '0.7rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor:        disabled ? 'not-allowed' : 'pointer',
        transition:    'border-color 0.25s ease, color 0.25s ease',
      }}
      onMouseEnter={e => {
        if (disabled) return;
        e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)';
        e.currentTarget.style.color = '#c9a96e';
      }}
      onMouseLeave={e => {
        if (disabled) return;
        e.currentTarget.style.borderColor = 'rgba(201,169,110,0.22)';
        e.currentTarget.style.color = 'rgba(201,169,110,0.65)';
      }}
    >
      {children}
    </button>
  );
}

/* ─── Form step ──────────────────────────────────────────────────────────────── */

function FormStep({ template, formValues, errors, onChange, onSubmit }) {
  return (
    <div style={{ animation: 'fade-up 0.4s ease both' }}>
      <div className="mb-8">
        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '12px' }}>
          ✦ STEP 1 OF 3 ✦
        </p>
        <h2 className="font-cormorant font-light leading-tight mb-2"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#faf6f0' }}>
          Personalize Your Invitation
        </h2>
        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.72rem', color: 'rgba(250,246,240,0.38)', lineHeight: 1.7 }}>
          Fill in your details below — these will appear exactly on your invitation
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate>
        {template.text_fields.map(field => (
          <FieldInput
            key={field}
            field={field}
            config={FIELD_CONFIG[field]}
            value={formValues[field] ?? ''}
            error={errors[field]}
            onChange={val => onChange(field, val)}
          />
        ))}

        {/* Buyer contact section */}
        <div className="mt-10 mb-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.18))' }} />
            <span className="font-cormorant italic font-light flex-shrink-0"
              style={{ fontSize: '1.15rem', color: 'rgba(250,246,240,0.5)' }}>
              Your Contact Details
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(201,169,110,0.18), transparent)' }} />
          </div>
          <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', marginBottom: '20px', lineHeight: 1.7 }}>
            We'll send your invitation link and PDF to this email immediately after payment
          </p>
          {BUYER_FIELDS.map(field => (
            <FieldInput
              key={field}
              field={field}
              config={BUYER_CONFIG[field]}
              value={formValues[field] ?? ''}
              error={errors[field]}
              onChange={val => onChange(field, val)}
            />
          ))}
        </div>

        <GoldButton type="submit">Review My Order →</GoldButton>
      </form>
    </div>
  );
}

/* ─── Review step ────────────────────────────────────────────────────────────── */

function ReviewRow({ label, value }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '11px', marginBottom: '11px' }}>
      <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '4px' }}>
        {label}
      </p>
      <p className="font-cormorant font-light" style={{ fontSize: '1.1rem', color: 'rgba(250,246,240,0.9)' }}>
        {value || '—'}
      </p>
    </div>
  );
}

function ReviewStep({ template, formValues, onEdit, onPay, paying }) {
  return (
    <div style={{ animation: 'fade-up 0.4s ease both' }}>
      <div className="mb-8">
        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '12px' }}>
          ✦ STEP 2 OF 3 ✦
        </p>
        <h2 className="font-cormorant font-light leading-tight mb-2"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#faf6f0' }}>
          Review Your Order
        </h2>
        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.72rem', color: 'rgba(250,246,240,0.38)' }}>
          Please confirm everything looks correct before payment
        </p>
      </div>

      {/* Template badge */}
      <div style={{ padding: '14px 16px', border: '1px solid rgba(201,169,110,0.18)', background: 'rgba(201,169,110,0.04)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <p className="font-cormorant font-light" style={{ fontSize: '1.15rem', color: '#faf6f0' }}>{template.title}</p>
          <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.8rem', color: '#c9a96e', marginTop: '3px' }}>
            {template.price.toFixed(3)} TND
          </p>
        </div>
        <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.32)', padding: '0.25rem 0.6rem', flexShrink: 0 }}>
          {CATEGORY_LABELS[template.category]}
        </span>
      </div>

      {/* Invitation details */}
      <div className="mb-6">
        <h4 className="font-cormorant italic font-light mb-4" style={{ fontSize: '1.05rem', color: 'rgba(250,246,240,0.5)' }}>
          Invitation Details
        </h4>
        {template.text_fields.map(field => (
          <ReviewRow
            key={field}
            label={FIELD_CONFIG[field]?.label ?? field.replace(/_/g, ' ')}
            value={formValues[field]}
          />
        ))}
      </div>

      {/* Buyer details */}
      <div className="mb-8">
        <h4 className="font-cormorant italic font-light mb-4" style={{ fontSize: '1.05rem', color: 'rgba(250,246,240,0.5)' }}>
          Your Contact Details
        </h4>
        {BUYER_FIELDS.map(field => (
          <ReviewRow
            key={field}
            label={BUYER_CONFIG[field]?.label ?? field}
            value={formValues[field]}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <GoldButton onClick={onPay} disabled={paying}>
          {paying ? (
            <><Spinner color="#0a0812" size={16} /> Processing…</>
          ) : (
            `Proceed to Payment — ${template.price.toFixed(3)} TND`
          )}
        </GoldButton>
        <GhostButton onClick={onEdit} disabled={paying}>
          ← Edit My Details
        </GhostButton>
      </div>
    </div>
  );
}

/* ─── Order summary (right column) ──────────────────────────────────────────── */

function OrderSummary({ template }) {
  return (
    <div style={{ border: '1px solid rgba(201,169,110,0.18)', background: 'rgba(17,13,31,0.85)', padding: '24px' }}>
      <h3 className="font-cormorant font-light mb-5" style={{ fontSize: '1.55rem', color: '#faf6f0' }}>
        Order Summary
      </h3>

      {/* 9:16 thumbnail */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '177.78%', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: CATEGORY_GRADIENTS[template.category] }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'rgba(201,169,110,0.18)', fontSize: '3.5rem', lineHeight: 1 }}>✦</span>
        </div>
      </div>

      {/* Title + category */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '16px' }}>
        <p className="font-cormorant font-light" style={{ fontSize: '1.1rem', color: '#faf6f0' }}>
          {template.title}
        </p>
        <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.3)', padding: '0.2rem 0.5rem', flexShrink: 0 }}>
          {CATEGORY_LABELS[template.category]}
        </span>
      </div>

      {/* Price breakdown */}
      <div style={{ borderTop: '1px solid rgba(201,169,110,0.1)', paddingTop: '14px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
          <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>
            Template price
          </span>
          <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.55)' }}>
            {template.price.toFixed(3)} TND
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>
            Delivery
          </span>
          <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>
            Instant
          </span>
        </div>
        <div style={{ borderTop: '1px solid rgba(201,169,110,0.14)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.78rem', color: 'rgba(250,246,240,0.75)' }}>
            Total
          </span>
          <div>
            <span className="font-cormorant font-light" style={{ fontSize: '1.9rem', color: '#c9a96e', lineHeight: 1 }}>
              {template.price.toFixed(3)}
            </span>
            {' '}
            <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>
              TND
            </span>
          </div>
        </div>
      </div>

      {/* What's included */}
      <div style={{ borderTop: '1px solid rgba(201,169,110,0.1)', paddingTop: '14px', marginBottom: '14px' }}>
        {INCLUDES.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
            <span style={{ color: '#c9a96e', fontSize: '0.5rem', marginTop: '3px', flexShrink: 0 }}>✦</span>
            <span style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.5 }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Reassurance */}
      <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 1.7 }}>
        🔒 Secure payment · Instant delivery · No account needed
      </p>
    </div>
  );
}

/* ─── Breadcrumb ─────────────────────────────────────────────────────────────── */

function Breadcrumb({ template }) {
  return (
    <nav style={{ borderBottom: '1px solid rgba(201,169,110,0.07)', padding: '16px 0' }}>
      <div className="px-4 md:px-6 lg:px-10" style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"Montserrat", sans-serif', fontSize: '0.62rem', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.28)' }}>
          <li><Link to="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.25s' }} onMouseEnter={e => e.target.style.color = '#c9a96e'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.28)'}>Home</Link></li>
          <li style={{ color: 'rgba(201,169,110,0.22)' }}>/</li>
          <li><Link to="/templates" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.25s' }} onMouseEnter={e => e.target.style.color = '#c9a96e'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.28)'}>Templates</Link></li>
          <li style={{ color: 'rgba(201,169,110,0.22)' }}>/</li>
          <li><Link to={`/templates/${template.id}`} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.25s' }} onMouseEnter={e => e.target.style.color = '#c9a96e'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.28)'}>{template.title}</Link></li>
          <li style={{ color: 'rgba(201,169,110,0.22)' }}>/</li>
          <li style={{ color: 'rgba(250,246,240,0.45)' }}>Order</li>
        </ol>
      </div>
    </nav>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function OrderForm() {
  const { templateId }           = useParams();
  const navigate                 = useNavigate();
  const [template, setTemplate]  = useState(null);
  const [loading, setLoading]    = useState(true);
  const [step, setStep]          = useState(1);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors]      = useState({});
  const [paying, setPaying]      = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getTemplate(templateId).then(t => {
      if (!alive) return;
      if (!t) { navigate('/templates', { replace: true }); return; }
      setTemplate(t);
      const fields = [...(t.text_fields ?? []), ...BUYER_FIELDS];
      setFormValues(Object.fromEntries(fields.map(f => [f, ''])));
      setLoading(false);
    });
    return () => { alive = false; };
  }, [templateId, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleChange = (field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(formValues, template.text_fields);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(2);
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      const { order_id }    = await createOrder({
        template_id:  template.id,
        buyer_name:   formValues.buyer_name,
        buyer_email:  formValues.buyer_email,
        buyer_phone:  formValues.buyer_phone,
        custom_text:  Object.fromEntries(template.text_fields.map(f => [f, formValues[f]])),
      });
      const { payment_url } = await initiatePayment(order_id);
      navigate(payment_url);
    } catch {
      setPaying(false);
    }
  };

  if (loading || !template) return <LoadingScreen />;

  return (
    <div style={{ background: '#0a0812', minHeight: '100vh' }} className="pt-16 md:pt-20">
      <Breadcrumb template={template} />

      <div className="px-4 md:px-6 lg:px-10 py-10 md:py-14">
        <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%' }}>

          {/* Two-column layout — on mobile summary stacks above form via flex-col-reverse */}
          <div className="flex flex-col-reverse md:flex-row gap-10 lg:gap-14 md:items-start">

            {/* LEFT — form / review */}
            <div className="w-full md:w-[60%] shrink-0">
              <StepIndicator step={step} />
              <div key={step}>
                {step === 1 ? (
                  <FormStep
                    template={template}
                    formValues={formValues}
                    errors={errors}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                  />
                ) : (
                  <ReviewStep
                    template={template}
                    formValues={formValues}
                    onEdit={() => setStep(1)}
                    onPay={handlePay}
                    paying={paying}
                  />
                )}
              </div>
            </div>

            {/* RIGHT — sticky summary */}
            <div className="w-full md:flex-1 min-w-0 md:sticky md:self-start" style={{ top: '100px' }}>
              <OrderSummary template={template} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
