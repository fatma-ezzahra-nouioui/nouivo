import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import entranceVideo from '../assets/entrance1.mp4';
import bg1 from '../assets/bg1.jpeg';
import bg2 from '../assets/bg2.jpeg';

const PAGE_COUNT       = 7;

/* ── helpers ──────────────────────────────────────────────────────────────── */
const TIMELINE_ITEMS = [
  ['5:00 PM',  'GUESTS ARRIVE'],
  ['6:00 PM',  'CEREMONY'],
  ['7:30 PM',  'WEDDING DINNER'],
  ['9:00 PM',  'CELEBRATION'],
  ['11:00 PM', 'FIRST DANCE'],
];

function parseDate(s) {
  const d = new Date(s);
  return isNaN(d) ? new Date('2025-06-14') : d;
}
function splitVenue(v) {
  const p = v.split(',').map(x => x.trim()).filter(Boolean);
  return { name: p[0] || 'Palais des Roses', address: p.slice(1).join(', ') || 'Tunis, Tunisia' };
}

function Ornament({ className = '' }) {
  return (
    <svg className={`evw-ornament${className ? ' ' + className : ''}`} viewBox="0 0 120 14" fill="none" aria-hidden="true">
      <line x1="0"  y1="7" x2="44"  y2="7" stroke="currentColor" strokeWidth=".8"/>
      <circle cx="51" cy="7" r="2.2" fill="currentColor" opacity=".55"/>
      <circle cx="60" cy="7" r="3.6" fill="none" stroke="currentColor" strokeWidth=".8"/>
      <circle cx="69" cy="7" r="2.2" fill="currentColor" opacity=".55"/>
      <line x1="76" y1="7" x2="120" y2="7" stroke="currentColor" strokeWidth=".8"/>
    </svg>
  );
}

function RingIcon({ className = '' }) {
  return (
    <svg className={`evw-ring${className ? ' ' + className : ''}`} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 3"/>
      <path d="M17 18L24 12L31 18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="24" cy="12" r="2.5" fill="currentColor" opacity=".6"/>
    </svg>
  );
}

/* ── component ────────────────────────────────────────────────────────────── */
export default function EntranceVideoWedding({ data = {}, standalone = false }) {
  const {
    bride_name      = 'Fatma',
    groom_name      = 'Ahmed',
    date            = '2025-06-14',
    time            = '6:00 PM',
    venue           = 'Palais des Roses, Tunis, Tunisia',
    photo_url       = null,
    venue_photo_url = null,
  } = data;

  const activeRef      = useRef(0);
  const flippingRef    = useRef(false);
  const scrollerRef    = useRef(null);
  const transitionRef  = useRef(null);

  const [activePage,  setActivePage]  = useState(0);
  const [enterPage,   setEnterPage]   = useState(null);
  const [videoEnded,  setVideoEnded]  = useState(false);

  const setPage = p => { activeRef.current = p; setActivePage(p); };

  const d    = useMemo(() => parseDate(date), [date]);
  const v    = useMemo(() => splitVenue(venue), [venue]);
  const mon  = d.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const day  = d.toLocaleDateString('en-US', { day: '2-digit' });
  const wday = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const yr   = d.getFullYear();

  const goTo = useCallback((next) => {
    if (flippingRef.current) return;
    const n = Math.max(0, Math.min(PAGE_COUNT - 1, next));
    if (n === activeRef.current) return;

    if (transitionRef.current) clearTimeout(transitionRef.current);

    flippingRef.current = true;
    activeRef.current = n;
    setEnterPage(n);

    // Snap the scroller immediately under the iris overlay
    const root = scrollerRef.current;
    if (root) root.scrollTop = n * root.clientHeight;

    setTimeout(() => { flippingRef.current = false; }, 500);

    transitionRef.current = setTimeout(() => {
      setEnterPage(null);
      transitionRef.current = null;
    }, 4000);
  }, []);

  // Track active page via scroll position
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const p = Number(entry.target.dataset.page);
            activeRef.current = p;
            setActivePage(p);
          }
        });
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll('.evw-snap-page').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoEnded) return;
    const t = setTimeout(() => goTo(1), 2400);
    return () => clearTimeout(t);
  }, [videoEnded, goTo]);

  const onClick = (e) => {
    if (e.target.closest('.evw-dots')) return;
    if (activeRef.current > 0) goTo(activeRef.current + 1);
  };

  /* ── page content ─────────────────────────────────────────────────────── */
  const renderPage = (i, animating = false) => {
    const a = (n) => animating ? `evw-a${n}` : '';
    switch (i) {
      case 0: return (
        <div className="evw-p0">
          <video
            src={entranceVideo} autoPlay muted playsInline
            onEnded={() => setVideoEnded(true)}
            className="evw-video"
          />
          <div className={`evw-ov ${videoEnded ? 'evw-ov-on' : ''}`}>
            <p className="evw-ov-tag">Together Forever</p>
            <h1 className="evw-ov-names">
              {bride_name}<span className="evw-ov-amp">&amp;</span>{groom_name}
            </h1>
            <Ornament />
            <p className="evw-ov-wedd">Wedding</p>
            {videoEnded && <span className="evw-hint">tap to continue ↓</span>}
          </div>
        </div>
      );

      case 1: return (
        <div className="evw-p-bg1 evw-p-center">
          <p className={`evw-outline ${a(1)}`}>YOU'RE</p>
          <h2 className={`evw-script-xl ${a(2)}`}>Cordially</h2>
          <p className={`evw-outline ${a(3)}`}>INVITED</p>
          <Ornament className={a(4)} />
          <p className={`evw-caption ${a(5)}`}>TO WITNESS THE UNION OF</p>
          <p className={`evw-couple-inline ${a(5)}`}>{bride_name} &amp; {groom_name}</p>
        </div>
      );

      case 2: return (
        <div className="evw-p-bg2 evw-p-couple">
          {photo_url
            ? <div className={`evw-photo ${a(1)}`}><img src={photo_url} alt="couple"/></div>
            : <div className={`evw-photo-ph ${a(1)}`}><RingIcon /></div>
          }
          <div className="evw-couple-copy">
            <p className={`evw-caption ${a(2)}`}>TOGETHER WITH THEIR FAMILIES</p>
            <h2 className={`evw-name ${a(3)}`}>{bride_name}</h2>
            <span className={`evw-and ${a(3)}`}>and</span>
            <h2 className={`evw-name ${a(4)}`}>{groom_name}</h2>
            <Ornament className={a(4)} />
            <p className={`evw-caption ${a(5)}`}>REQUEST THE HONOUR OF YOUR PRESENCE</p>
          </div>
        </div>
      );

      case 3: return (
        <div className="evw-p-bg1 evw-p-date">
          <p className={`evw-caption ${a(1)}`}>JOIN US TO CELEBRATE</p>
          <h2 className={`evw-script-lg ${a(2)}`}>Our Wedding</h2>
          <Ornament className={a(2)} />
          <div className={`evw-date-grid ${a(3)}`}>
            <div className="evw-date-side">
              <span>{mon}</span><strong>{wday}</strong>
            </div>
            <p className="evw-date-num">{day}</p>
            <div className="evw-date-side evw-date-r">
              <span>AT {time}</span><strong>{yr}</strong>
            </div>
          </div>
          <Ornament className={a(4)} />
          <p className={`evw-venue-n ${a(4)}`}>{v.name}</p>
          <p className={`evw-venue-a ${a(4)}`}>{v.address}</p>
          <p className={`evw-reception ${a(5)}`}>RECEPTION TO FOLLOW</p>
        </div>
      );

      case 4: return (
        <div className="evw-p-bg2 evw-p-tl">
          <p className={`evw-caption ${a(1)}`}>OUR DAY</p>
          <h2 className={`evw-script-lg ${a(2)}`}>Wedding<span className="evw-script-sub">timeline</span></h2>
          <Ornament className={a(3)} />
          <div className={`evw-tl ${a(4)}`}>
            {TIMELINE_ITEMS.map(([t, label]) => (
              <div key={label} className="evw-tl-row">
                <strong>{t}</strong>
                <div className="evw-tl-dot"/>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      );

      case 5: return (
        <div className="evw-p-bg1 evw-p-details">
          <p className={`evw-caption ${a(1)}`}>THE</p>
          <h2 className={`evw-script-lg ${a(1)}`}>Details</h2>
          <Ornament className={a(2)} />
          <div className={`evw-card ${a(3)}`}>
            {venue_photo_url && <img src={venue_photo_url} className="evw-card-img" alt="venue"/>}
            <p className="evw-card-lbl">LOCATION</p>
            <p className="evw-card-h">{v.name}</p>
            <p className="evw-card-sub">{v.address}</p>
          </div>
          <div className={`evw-card evw-dress ${a(4)}`}>
            <p className="evw-card-lbl">DRESS CODE</p>
            <div className="evw-swatches">
              <span style={{ background: '#f5e8eb' }}/>
              <span style={{ background: '#c9a96e' }}/>
              <span style={{ background: '#b08090' }}/>
            </div>
            <p className="evw-dress-txt">FORMAL ELEGANCE</p>
          </div>
          <div className={`evw-card ${a(5)}`}>
            <p className="evw-card-lbl">RSVP BY</p>
            <p className="evw-card-h">{mon} 01, {yr}</p>
          </div>
        </div>
      );

      case 6: return (
        <div className="evw-p-bg2 evw-p-thanks">
          <RingIcon className={a(1)} />
          <h2 className={`evw-script-xl ${a(2)}`}>Thank You</h2>
          <Ornament className={a(3)} />
          <p className={`evw-thanks-body ${a(4)}`}>
            WE ARE SO GRATEFUL FOR THE LOVE AND JOY YOU BRING
            INTO OUR LIVES. YOUR PRESENCE ON OUR SPECIAL DAY
            MEANS THE WORLD TO US. WE CANNOT WAIT TO CELEBRATE
            WITH YOU.
          </p>
          <Ornament className={a(4)} />
          <p className={`evw-caption ${a(5)}`}>WITH LOVE</p>
          <p className={`evw-closing ${a(5)}`}>{bride_name} &amp; {groom_name}</p>
        </div>
      );

      default: return null;
    }
  };

  /* ── render ───────────────────────────────────────────────────────────── */
  return (
    <div className={`evw-shell ${standalone ? 'evw-standalone' : 'evw-embedded'}`}>
      <style>{css(bg1, bg2)}</style>

      {/* Scroll-snap container — natural scroll, no iris */}
      <div
        ref={scrollerRef}
        className={`evw-scroller${enterPage !== null ? ' evw-scroller-locked' : ''}`}
        onClick={onClick}
      >
        {Array.from({ length: PAGE_COUNT }, (_, i) => (
          <div key={i} className="evw-snap-page" data-page={i}>
            {renderPage(i)}
          </div>
        ))}
      </div>

      {/* Iris overlay — only on tap */}
      {enterPage !== null && (
        <div key={enterPage} className="evw-pane evw-pane-enter">
          {renderPage(enterPage, true)}
        </div>
      )}

      <div className="evw-dots" aria-label="pages">
        {Array.from({ length: PAGE_COUNT }, (_, i) => (
          <span
            key={i}
            className={activePage === i ? 'evw-dot-active' : ''}
            onClick={e => { e.stopPropagation(); goTo(i); }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── styles ───────────────────────────────────────────────────────────────── */
const css = (bg1Url, bg2Url) => `
.evw-shell {
  --rose:      #b08090;
  --deep-rose: #7a4a55;
  --ink:       #3d2028;
  --gold:      #c9a96e;
  position: relative; width: 100%; height: 100%;
  background: #0a0812; overflow: hidden;
  font-family: "Montserrat", sans-serif;
  container-type: inline-size; user-select: none;
}
.evw-standalone {
  width: min(100vw, calc(100svh * 9 / 16));
  height: min(100svh, calc(100vw * 16 / 9));
  aspect-ratio: 9 / 16;
  box-shadow: 0 22px 70px rgba(0,0,0,.14);
}
.evw-embedded { width: 100%; height: 100%; }
.evw-scroller {
  position: absolute; inset: 0;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.evw-scroller::-webkit-scrollbar { display: none; }
.evw-scroller-locked { overflow: hidden; }
.evw-snap-page { position: relative; height: 100%; scroll-snap-align: start; overflow: hidden; }
.evw-pane  { position: absolute; inset: 0; overflow: hidden; }

/* ── Page transition — iris from center ── */
.evw-pane-enter {
  z-index: 20;
  animation: evw-iris-open 4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes evw-iris-open {
  from { clip-path: circle(0% at 50% 50%); }
  to   { clip-path: circle(150% at 50% 50%); }
}

/* ── Text entrance — staggered rise ── */
@keyframes evw-text-rise {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
.evw-a1 { animation: evw-text-rise 0.65s cubic-bezier(0.4,0,0.2,1) 0.30s both; }
.evw-a2 { animation: evw-text-rise 0.65s cubic-bezier(0.4,0,0.2,1) 0.55s both; }
.evw-a3 { animation: evw-text-rise 0.65s cubic-bezier(0.4,0,0.2,1) 0.80s both; }
.evw-a4 { animation: evw-text-rise 0.65s cubic-bezier(0.4,0,0.2,1) 1.05s both; }
.evw-a5 { animation: evw-text-rise 0.65s cubic-bezier(0.4,0,0.2,1) 1.30s both; }

/* ── Page backgrounds ── */
.evw-p-bg1 { position:absolute;inset:0; background:url("${bg1Url}") center/cover no-repeat; }
.evw-p-bg2 { position:absolute;inset:0; background:url("${bg2Url}") center/cover no-repeat; }

/* ── Page 0 – video ── */
.evw-p0 { position:absolute;inset:0; background:#0a0812; }
.evw-video { position:absolute;inset:0;width:100%;height:100%;object-fit:cover; }
.evw-ov {
  position:absolute;inset:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;background:rgba(0,0,0,.18);
  opacity:0;transition:opacity 1.5s ease;pointer-events:none;
  padding:0 24px;gap:clamp(5px,1.6cqw,10px);
}
.evw-ov-on { opacity:1; }
.evw-ov-tag {
  margin:0;font:500 clamp(7px,2.2cqw,9px) "Montserrat",sans-serif;
  letter-spacing:.32em;text-transform:uppercase;color:rgba(201,169,110,.9);
}
.evw-ov-names {
  margin:0;font:400 clamp(42px,14.5cqw,68px)/1.1 "Great Vibes",cursive;
  color:#f4efe6;text-shadow:0 0 40px rgba(201,169,110,.55),0 2px 6px rgba(0,0,0,.6);
  display:flex;flex-direction:column;align-items:center;
}
.evw-ov-amp { font-size:clamp(22px,7.5cqw,38px);color:#c9a96e;line-height:.95; }
.evw-ov-wedd {
  margin:0;font:400 clamp(9px,2.8cqw,13px) "Cormorant Garamond",serif;
  letter-spacing:.46em;text-transform:uppercase;color:rgba(201,169,110,.9);
}
.evw-hint {
  margin-top:6px;font:500 clamp(6px,1.8cqw,8px) "Montserrat",sans-serif;
  letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.35);
  animation:evw-pulse 2s ease-in-out infinite;
}

/* ── Shared text atoms ── */
.evw-ornament { width:clamp(80px,28cqw,116px);color:var(--rose); }
.evw-caption {
  margin:0;font:600 clamp(6px,1.9cqw,8.5px) "Montserrat",sans-serif;
  letter-spacing:.22em;color:var(--deep-rose);
}
.evw-outline {
  margin:0;color:rgba(255,255,255,.05);
  -webkit-text-stroke:1px rgba(61,32,40,.48);
  text-shadow:0 2px 4px rgba(255,255,255,.7);
  font:400 clamp(32px,11.5cqw,48px)/.9 "Cormorant Garamond",serif;letter-spacing:.04em;
}
.evw-script-xl {
  margin:0;font:400 clamp(50px,18cqw,74px)/.85 "Great Vibes",cursive;
  color:var(--ink);text-shadow:0 2px 4px rgba(255,255,255,.75);
}
.evw-script-lg {
  margin:0;font:400 clamp(38px,13.5cqw,56px)/.85 "Great Vibes",cursive;
  color:var(--ink);text-shadow:0 2px 4px rgba(255,255,255,.75);
}
.evw-script-sub { display:block;font-size:clamp(26px,9.5cqw,42px);color:var(--deep-rose); }

/* ── Page 1 ── */
.evw-p-center {
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  height:100%;gap:clamp(8px,2.8cqw,16px);padding:22cqw 12cqw 50cqw;text-align:center;
}
.evw-couple-inline { margin:0;font:400 clamp(17px,5.8cqw,27px)/1 "Great Vibes",cursive;color:var(--deep-rose); }

/* ── Page 2 ── */
.evw-p-couple { display:flex;flex-direction:column;height:100%; }
.evw-photo { width:100%;height:45%;flex:0 0 45%;overflow:hidden;position:relative; }
.evw-photo::after {
  content:"";position:absolute;left:0;right:0;bottom:0;height:42%;
  background:linear-gradient(transparent,rgba(245,232,235,.92) 88%);
}
.evw-photo img { width:100%;height:100%;object-fit:cover;object-position:center top;display:block; }
.evw-photo-ph {
  width:100%;height:40%;flex:0 0 40%;
  display:flex;align-items:flex-end;justify-content:center;padding-bottom:12px;
}
.evw-ring { width:clamp(42px,13cqw,60px);height:clamp(42px,13cqw,60px);color:var(--rose);opacity:.6; }
.evw-couple-copy {
  flex:1;display:flex;flex-direction:column;align-items:center;
  justify-content:space-evenly;padding:6cqw 12cqw 38cqw;gap:clamp(3px,1.2cqw,7px);text-align:center;
}
.evw-name { margin:0;font:500 clamp(20px,6.8cqw,30px)/1 "Cormorant Garamond",serif;letter-spacing:.05em;text-transform:uppercase;color:var(--ink); }
.evw-and  { font:400 clamp(24px,8.5cqw,36px)/.9 "Great Vibes",cursive;color:var(--rose); }

/* ── Page 3 ── */
.evw-p-date {
  display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;
  height:100%;gap:clamp(5px,1.8cqw,10px);padding:22cqw 12cqw 50cqw;text-align:center;
}
.evw-date-grid { width:100%;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px; }
.evw-date-side {
  display:flex;flex-direction:column;justify-content:center;min-height:50px;gap:2px;
  border-top:1px solid rgba(61,32,40,.38);border-bottom:1px solid rgba(61,32,40,.38);text-align:left;
}
.evw-date-r { text-align:right; }
.evw-date-side span,.evw-date-side strong { display:block;font:500 clamp(7px,2.1cqw,9px) "Cormorant Garamond",serif;letter-spacing:.04em;color:var(--deep-rose); }
.evw-date-num { margin:0;font:500 clamp(44px,15.5cqw,58px)/.9 "Cormorant Garamond",serif;color:var(--ink);text-align:center; }
.evw-venue-n  { margin:0;font:400 clamp(8px,2.5cqw,10px) "Cormorant Garamond",serif;letter-spacing:.06em;text-transform:uppercase;color:var(--ink); }
.evw-venue-a  { margin:0;max-width:190px;font:400 clamp(6.5px,2cqw,8.5px)/1.4 "Montserrat",sans-serif;letter-spacing:.04em;color:var(--deep-rose); }
.evw-reception { margin:0;font:600 clamp(6.5px,2cqw,8px) "Montserrat",sans-serif;letter-spacing:.18em;color:var(--rose); }

/* ── Page 4 ── */
.evw-p-tl {
  display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;
  height:100%;gap:clamp(6px,2.2cqw,14px);padding:22cqw 12cqw 38cqw;text-align:center;
}
.evw-tl { display:flex;flex-direction:column;width:100%;gap:clamp(10px,3.5cqw,18px); }
.evw-tl-row { display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px; }
.evw-tl-row strong { text-align:center;font:700 clamp(7.5px,2.4cqw,9.5px) "Cormorant Garamond",serif;color:var(--deep-rose);letter-spacing:.03em;background:rgba(255,255,255,.55);border-radius:6px;padding:1px 4px; }
.evw-tl-dot { width:6px;height:6px;border-radius:50%;background:var(--rose);border:1.5px solid rgba(255,255,255,.6);flex-shrink:0; }
.evw-tl-row span { text-align:center;font:500 clamp(7.5px,2.4cqw,9.5px)/1.3 "Cormorant Garamond",serif;letter-spacing:.04em;color:var(--ink);background:rgba(255,255,255,.55);border-radius:6px;padding:1px 4px; }

/* ── Page 5 ── */
.evw-p-details {
  display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;
  height:100%;gap:clamp(5px,1.8cqw,9px);padding:22cqw 12cqw 50cqw;text-align:center;
}
.evw-card { width:100%;background:rgba(255,255,255,.58);border:1px solid rgba(176,128,144,.22);padding:9px 13px 11px;backdrop-filter:blur(2px); }
.evw-card-img { width:100%;height:76px;object-fit:cover;display:block;margin-bottom:7px; }
.evw-card-lbl { margin:0 0 4px;font:600 clamp(5.5px,1.8cqw,7.5px) "Montserrat",sans-serif;letter-spacing:.2em;color:var(--rose); }
.evw-card-h   { margin:0 0 2px;font:500 clamp(7.5px,2.4cqw,10px) "Cormorant Garamond",serif;letter-spacing:.06em;text-transform:uppercase;color:var(--ink); }
.evw-card-sub { margin:0;font:400 clamp(6.5px,2cqw,8.5px)/1.35 "Montserrat",sans-serif;letter-spacing:.04em;color:var(--deep-rose); }
.evw-dress { background:rgba(176,128,144,.16); }
.evw-swatches { display:flex;justify-content:center;gap:8px;margin:7px 0 6px; }
.evw-swatches span { width:22px;height:22px;border-radius:50%;border:1.5px solid rgba(255,255,255,.8);box-shadow:0 1px 4px rgba(0,0,0,.1); }
.evw-dress-txt { margin:0;font:600 clamp(6.5px,2cqw,7.5px) "Montserrat",sans-serif;letter-spacing:.16em;color:var(--deep-rose); }

/* ── Page 6 ── */
.evw-p-thanks {
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  height:100%;gap:clamp(6px,2.2cqw,12px);padding:22cqw 12cqw 38cqw;text-align:center;
}
.evw-thanks-body { margin:0;max-width:252px;font:600 clamp(7px,2.1cqw,9px)/2 "Cormorant Garamond",serif;letter-spacing:.1em;text-transform:uppercase;color:var(--ink); }
.evw-closing { margin:0;font:500 clamp(15px,5.2cqw,21px)/1 "Cormorant Garamond",serif;letter-spacing:.05em;text-transform:uppercase;color:var(--ink); }

/* ── Dots ── */
.evw-dots {
  position:absolute;z-index:10;right:9px;top:50%;transform:translateY(-50%);
  display:flex;flex-direction:column;gap:8px;
}
.evw-dots span {
  width:7px;height:7px;border-radius:50%;cursor:pointer;
  border:1px solid rgba(61,32,40,.32);background:rgba(255,255,255,.65);
  transition:transform .25s ease,background .25s ease;
}
.evw-dots .evw-dot-active { background:var(--rose);border-color:var(--rose);transform:scale(1.3); }

@keyframes evw-pulse { 0%,100%{opacity:.28;} 50%{opacity:.85;} }
`;
