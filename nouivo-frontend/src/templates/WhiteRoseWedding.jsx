import { useEffect, useMemo, useRef, useState } from 'react';
import celebrationFlowers from '../assets/beautiful-roses-celebration.jpg';
import engagementPhoto from '../assets/engagement.jpg';
import engagementThankYou from '../assets/engagement2.jpg';

const VENUE_PHOTO = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85&fit=crop';

const TIMELINE_ITEMS = [
  ['1:00', 'SEATING BEGINS'],
  ['2:00', 'CEREMONY'],
  ['3:00', 'WEDDING LUNCH'],
  ['4:30', 'PARTY TIME'],
  ['20:00', 'FIREWORKS'],
];

const PAGE_COUNT = 7;

function parseWeddingDate(dateText) {
  const parsed = new Date(dateText);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return new Date('Sunday, November 26, 2025');
}

function splitVenue(venue) {
  const parts = venue.split(',').map(part => part.trim()).filter(Boolean);
  return {
    venueName: parts[0] || 'Villa Benezia',
    venueAddress: parts.slice(1).join(', ') || '1234 Bank St, Grass Valley California',
  };
}

function ChampagneIcon() {
  return (
    <svg className="wrw-champagne" viewBox="0 0 70 58" aria-hidden="true">
      <path d="M18 4h18v15c0 8-5 15-12 16v13h9v5H12v-5h9V35C13 34 8 27 8 19V4h10Z" />
      <path d="M34 4h18v15c0 8-5 15-12 16v13h9v5H28v-5h9V35c-8-1-12-8-12-16V4h9Z" />
      <path d="M12 15h20M30 15h18" />
    </svg>
  );
}

export default function WhiteRoseWedding({ data = {}, standalone = false }) {
  const {
    bride_name = 'Patricia',
    groom_name = 'Adam',
    date = 'Sunday, November 26, 2025',
    time = '3:00 PM',
    venue = 'Villa Benezia, 1234 Bank St, Grass Valley',
    photo_url = null,
    venue_photo_url = null,
  } = data;

  const scrollerRef = useRef(null);
  const touchStartY = useRef(null);
  const didSwipe = useRef(false);
  const [activePage, setActivePage] = useState(0);
  const [opened, setOpened] = useState(false);

  const weddingDate = useMemo(() => parseWeddingDate(date), [date]);
  const { venueName, venueAddress } = useMemo(() => splitVenue(venue), [venue]);
  const initials = `${bride_name[0] || 'P'}|${groom_name[0] || 'A'}`.toUpperCase();
  const month = weddingDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNumber = weddingDate.toLocaleDateString('en-US', { day: '2-digit' });
  const dayName = weddingDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const year = weddingDate.getFullYear();

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActivePage(Number(entry.target.dataset.page));
            entry.target.classList.add('wrw-visible');
          }
        });
      },
      { root, threshold: 0.58 },
    );

    root.querySelectorAll('.wrw-page').forEach(page => observer.observe(page));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!opened) return undefined;
    const timer = window.setTimeout(() => {
      scrollerRef.current?.scrollTo({ top: scrollerRef.current.clientHeight, behavior: 'smooth' });
    }, 1650);
    return () => window.clearTimeout(timer);
  }, [opened]);

  const scrollToPage = page => {
    const root = scrollerRef.current;
    if (!root) return;
    root.scrollTo({ top: root.clientHeight * page, behavior: 'smooth' });
  };

  const handleTouchEnd = event => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - event.changedTouches[0].clientY;
    touchStartY.current = null;
    if (Math.abs(delta) < 45) return;
    didSwipe.current = true;
    window.setTimeout(() => {
      didSwipe.current = false;
    }, 250);
    scrollToPage(Math.min(PAGE_COUNT - 1, Math.max(0, activePage + (delta > 0 ? 1 : -1))));
  };

  const handlePageClick = event => {
    if (didSwipe.current) return;
    const clickedPage = event.target.closest('.wrw-page');
    if (!clickedPage) return;

    const page = Number(clickedPage.dataset.page);
    if (page === 0) {
      setOpened(true);
      return;
    }

    scrollToPage(Math.min(PAGE_COUNT - 1, page + 1));
  };

  return (
    <div className={`wrw-shell ${standalone ? 'wrw-standalone' : 'wrw-embedded'}`}>
      <style>{styles}</style>
      <div
        ref={scrollerRef}
        className="wrw-scroller"
        onClick={handlePageClick}
        onTouchStart={event => { touchStartY.current = event.touches[0].clientY; }}
        onTouchEnd={handleTouchEnd}
      >
        <section className={`wrw-page wrw-envelope ${opened ? 'wrw-opened' : ''}`} data-page="0">
          <div className="wrw-envelope-paper">
            <div className="wrw-paper-grain" />
            <div className="wrw-envelope-back" />
            <div className="wrw-envelope-flap wrw-flap-top" />
            <div className="wrw-envelope-flap wrw-flap-left" />
            <div className="wrw-envelope-flap wrw-flap-right" />
            <div className="wrw-envelope-flap wrw-flap-bottom" />
            <div className="wrw-envelope-crease wrw-crease-left" />
            <div className="wrw-envelope-crease wrw-crease-right" />
            <button className="wrw-wax" type="button">
              <span>{initials}</span>
            </button>
            <p className="wrw-tap-hint">Tap to open</p>
          </div>
        </section>

        <section className="wrw-page wrw-hero wrw-rose-page" data-page="1">
          <div className="wrw-content wrw-hero-content">
            <p className="wrw-outline">YOU'RE</p>
            <h1>Cordially</h1>
            <p className="wrw-outline">INVITED</p>
          </div>
        </section>

        <section className="wrw-page wrw-couple-page" data-page="2">
          <div className="wrw-content wrw-couple-content">
            <div className="wrw-couple-photo-wrap">
              <img src={photo_url || engagementPhoto} alt={`${bride_name} and ${groom_name}`} />
            </div>
            <div className="wrw-couple-copy">
              <p>TOGETHER WITH THEIR FAMILIES</p>
              <h2>{bride_name}</h2>
              <span>and</span>
              <h2>{groom_name}</h2>
            </div>
          </div>
        </section>

        <section className="wrw-page wrw-date-page wrw-rose-page" data-page="3">
          <div className="wrw-content wrw-date-content">
            <p className="wrw-invite">INVITE YOU TO CELEBRATE<br />THEIR</p>
            <h2>Wedding</h2>
            <div className="wrw-date-card">
              <div>
                <span>{month}</span>
                <strong>{dayName}</strong>
              </div>
              <p>{dayNumber}</p>
              <div>
                <span>AT {time}</span>
                <strong>{year}</strong>
              </div>
            </div>
            <p className="wrw-venue-name">{venueName}</p>
            <p className="wrw-venue-address">{venueAddress}</p>
            <p className="wrw-follow">RECEPTION TO FOLLOW</p>
            <ChampagneIcon />
          </div>
        </section>

        <section className="wrw-page wrw-timeline-page wrw-rose-page" data-page="4">
          <div className="wrw-content wrw-timeline-content">
            <h2>WEDDING<span>timeline</span></h2>
            <div className="wrw-timeline">
              {TIMELINE_ITEMS.map(([itemTime, label]) => (
                <div className="wrw-timeline-item" key={label}>
                  <strong>{itemTime}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="wrw-page wrw-info-page wrw-rose-page" data-page="5">
          <div className="wrw-content wrw-info-content">
            <div className="wrw-info-title">
              <span>the</span>
              <h2>DETAILS</h2>
            </div>
            <div className="wrw-location-card">
              <img src={venue_photo_url || VENUE_PHOTO} alt={venueName} />
              <p className="wrw-section-label">LOCATION</p>
              <p className="wrw-info-venue">{venueName}</p>
              <p className="wrw-info-address">{venueAddress}</p>
            </div>
            <div className="wrw-dress-card">
              <p className="wrw-section-label">DRESS CODE</p>
              <div className="wrw-swatches">
                <span style={{ background: '#fff' }} />
                <span style={{ background: '#d8c17d' }} />
                <span style={{ background: '#9e896c' }} />
              </div>
              <p>FORMAL ATTIRE</p>
            </div>
            <div className="wrw-hotel-card">
              <p>HOTEL RECOMMENDATIONS</p>
              <span>Hilton Garden Marina Del Rey<br />4200 Admiralty Way,<br />Los Angeles, CA 90292</span>
            </div>
          </div>
        </section>

        <section className="wrw-page wrw-thank-page" data-page="6">
          <div className="wrw-content wrw-thank-content">
            <div className="wrw-thank-photo">
              <img src={engagementThankYou} alt={`${bride_name} and ${groom_name}`} />
            </div>
            <div className="wrw-thank-copy">
              <h2>Thank you!</h2>
              <p>
                WE ARE SO GRATEFUL FOR THE LOVE, SUPPORT,
                AND JOY YOU BRING INTO OUR LIVES.
                AS WE BEGIN THIS NEW CHAPTER TOGETHER,
                YOUR PRESENCE MEANS THE WORLD TO US.
                THANK YOU FOR BEING PART OF OUR SPECIAL
                DAY - WE CAN'T WAIT TO CELEBRATE WITH
                YOU!
              </p>
              <span>WITH LOVE</span>
              <strong>{bride_name} &amp; {groom_name}</strong>
            </div>
          </div>
        </section>
      </div>

      <div className="wrw-dots" aria-label="Invitation pages">
        {Array.from({ length: PAGE_COUNT }, (_, page) => (
          <span
            key={page}
            className={activePage === page ? 'wrw-dot-active' : ''}
            aria-label={`Page ${page + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const styles = `
.wrw-shell {
  --cream: #f4efe6;
  --ivory: #fbfaf6;
  --ink: #15110d;
  --gold: #b99d63;
  --sand: #c9bea8;
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--ivory);
  color: var(--ink);
  overflow: hidden;
  font-family: "Montserrat", sans-serif;
  container-type: inline-size;
}
.wrw-standalone {
  width: min(100vw, calc(100svh * 9 / 16));
  height: min(100svh, calc(100vw * 16 / 9));
  aspect-ratio: 9 / 16;
  box-shadow: 0 22px 70px rgba(0,0,0,.12);
}
.wrw-embedded { width: 100%; height: 100%; }
.wrw-scroller {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.wrw-scroller::-webkit-scrollbar { display: none; }
.wrw-page {
  position: relative;
  height: 100%;
  min-height: 100%;
  scroll-snap-align: start;
  overflow: hidden;
  isolation: isolate;
  background: var(--ivory);
}
.wrw-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 100%;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity .85s ease, transform .85s ease;
}
.wrw-visible .wrw-content { opacity: 1; transform: translateY(0); }
.wrw-rose-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255,255,255,.16), rgba(255,255,255,.2)), url("${celebrationFlowers}");
  background-size: cover;
  background-position: center;
  z-index: 0;
}
.wrw-rose-page::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,.06), rgba(255,255,255,.46));
  z-index: 1;
  pointer-events: none;
}
.wrw-envelope {
  background: #ddd6ca;
  cursor: pointer;
  perspective: 1400px;
  transition: opacity .6s ease 1.32s;
}
.wrw-opened { opacity: 0; }
.wrw-envelope-paper {
  position: absolute;
  inset: 0;
  background: #ede8df;
  overflow: hidden;
}
.wrw-envelope-paper::before { content: none; }
.wrw-paper-grain {
  position: absolute;
  inset: -3%;
  background-image: url("${celebrationFlowers}");
  background-size: cover;
  background-position: center;
  filter: grayscale(1) contrast(.50) brightness(1.38);
  opacity: .80;
  mix-blend-mode: multiply;
}
.wrw-envelope-back {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(134deg,
      transparent 0 48.5%,
      rgba(0,0,0,.22) 48.5% 49.2%,
      rgba(255,255,255,.96) 49.2% 50.6%,
      transparent 50.6%),
    linear-gradient(226deg,
      transparent 0 48.5%,
      rgba(0,0,0,.16) 48.5% 49.2%,
      rgba(255,255,255,.90) 49.2% 50.6%,
      transparent 50.6%);
}
.wrw-envelope-flap {
  position: absolute;
  inset: 0;
  transition: transform 1.12s cubic-bezier(.18,.72,.22,1), opacity .9s ease;
}
.wrw-flap-top {
  z-index: 5;
  background: linear-gradient(183deg,
    rgba(255,252,247,.60) 0%,
    rgba(242,236,228,.26) 78%,
    rgba(228,222,212,.06) 100%);
  clip-path: polygon(0 0, 100% 0, 50% 50%);
  transform-origin: top center;
  filter: brightness(1.10) drop-shadow(0 5px 18px rgba(0,0,0,.30));
}
.wrw-flap-left {
  z-index: 4;
  background: linear-gradient(96deg,
    rgba(190,182,170,.50) 0%,
    rgba(212,206,196,.16) 100%);
  clip-path: polygon(0 0, 50% 50%, 0 100%);
  filter: brightness(.94) drop-shadow(6px 0 12px rgba(0,0,0,.20));
}
.wrw-flap-right {
  z-index: 4;
  background: linear-gradient(264deg,
    rgba(190,182,170,.50) 0%,
    rgba(212,206,196,.16) 100%);
  clip-path: polygon(100% 0, 50% 50%, 100% 100%);
  filter: brightness(.94) drop-shadow(-6px 0 12px rgba(0,0,0,.20));
}
.wrw-flap-bottom {
  z-index: 3;
  background: linear-gradient(2deg,
    rgba(168,160,148,.60) 0%,
    rgba(196,190,180,.24) 100%);
  clip-path: polygon(0 100%, 50% 50%, 100% 100%);
  filter: brightness(.87);
}
.wrw-envelope-crease { display: none; }
.wrw-envelope::after { content: none; }
.wrw-opened .wrw-flap-top { transform: rotateX(-178deg); }
.wrw-wax {
  position: absolute;
  top: calc(50% - 48px);
  left: calc(50% - 48px);
  width: 96px;
  height: 96px;
  border: 0;
  border-radius: 43% 56% 48% 54% / 54% 45% 58% 43%;
  z-index: 8;
  color: #100b06;
  font: 500 34px "Cormorant Garamond", serif;
  background:
    radial-gradient(circle at 32% 26%, rgba(255,252,195,.88), transparent 22%),
    radial-gradient(circle at 50% 52%, #ecca72 0 36%, #b89044 68%, #7c6230 100%);
  box-shadow:
    inset 0 0 0 6px rgba(90,68,30,.14),
    0 12px 32px rgba(50,38,16,.42),
    0 4px 10px rgba(0,0,0,.24);
  cursor: pointer;
  transition: opacity .5s ease, transform .85s ease;
}
.wrw-wax::before {
  content: "";
  position: absolute;
  inset: 11px;
  border: 1.5px solid rgba(84,65,29,.32);
  border-radius: 50%;
}
.wrw-wax span { position: relative; z-index: 1; letter-spacing: -.02em; }
.wrw-opened .wrw-wax { opacity: 0; transform: translateY(-120px) scale(.76); }
.wrw-tap-hint {
  position: absolute;
  bottom: 11%;
  left: 0;
  right: 0;
  z-index: 9;
  margin: 0;
  text-align: center;
  color: rgba(20,17,13,.38);
  font-size: 9px;
  letter-spacing: .22em;
  text-transform: uppercase;
  animation: wrw-pulse 1.5s ease-in-out infinite;
}
.wrw-hero-content {
  display: flex;
  height: 100%;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(38px, 12cqw, 62px);
  text-align: center;
  padding: 34px 24px;
}
.wrw-outline {
  margin: 0;
  color: rgba(255,255,255,.12);
  -webkit-text-stroke: 1px rgba(20,17,13,.58);
  text-shadow: 0 2px 3px rgba(255,255,255,.9), 0 5px 10px rgba(0,0,0,.12);
  font: 400 clamp(35px, 13cqw, 52px)/.85 "Cormorant Garamond", serif;
  letter-spacing: .03em;
}
.wrw-hero h1 {
  margin: 0;
  color: #1d1712;
  font: 400 clamp(58px, 21cqw, 84px)/.8 "Great Vibes", cursive;
  text-shadow: 0 2px 4px rgba(255,255,255,.9);
}
.wrw-couple-page { background: var(--ivory); }
.wrw-couple-content {
  display: flex;
  height: 100%;
  min-height: 100%;
  flex-direction: column;
  text-align: center;
}
.wrw-couple-photo-wrap {
  position: relative;
  width: 100%;
  height: 70%;
  flex: 0 0 70%;
  overflow: hidden;
}
.wrw-couple-photo-wrap::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 52%;
  background: linear-gradient(transparent, var(--ivory) 88%);
  pointer-events: none;
}
.wrw-couple-photo-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}
.wrw-couple-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  gap: 10px;
  padding: 2px 26px 24px;
  background: #fbfaf7;
  margin-top: -34px;
  position: relative;
  z-index: 2;
}
.wrw-couple-copy p {
  margin: 0;
  font: 600 8px "Montserrat", sans-serif;
  letter-spacing: .12em;
}
.wrw-couple-copy h2 {
  margin: 0;
  font: 500 26px/1 "Cormorant Garamond", serif;
  letter-spacing: .03em;
  text-transform: uppercase;
}
.wrw-couple-copy span {
  margin: 0;
  font: 400 29px/.8 "Great Vibes", cursive;
}
.wrw-date-content {
  display: flex;
  height: 100%;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  gap: clamp(8px, 2.5cqw, 16px);
  padding: 28px 28px;
  text-align: center;
}
.wrw-invite {
  margin: 0;
  font: 600 8px/1.8 "Montserrat", sans-serif;
  letter-spacing: .18em;
}
.wrw-date-content h2 {
  margin: 0;
  font: 400 clamp(58px, 20cqw, 78px)/.75 "Great Vibes", cursive;
}
.wrw-date-card {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  margin: 0;
}
.wrw-date-card > div {
  min-height: 54px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top: 1px solid rgba(21,17,13,.45);
  border-bottom: 1px solid rgba(21,17,13,.45);
}
.wrw-date-card span, .wrw-date-card strong {
  display: block;
  font: 500 10px "Cormorant Garamond", serif;
  letter-spacing: .02em;
}
.wrw-date-card p {
  margin: 0;
  font: 500 54px/.9 "Cormorant Garamond", serif;
}
.wrw-venue-name, .wrw-venue-address, .wrw-follow {
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.wrw-venue-name { font-size: 10px; margin-bottom: 5px; }
.wrw-venue-address { max-width: 190px; font-size: 8px; line-height: 1.35; }
.wrw-follow { margin-top: 26px; font-size: 8px; }
.wrw-champagne {
  width: 32px;
  margin-top: 0;
  fill: none;
  stroke: rgba(21,17,13,.62);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.wrw-timeline-content {
  display: flex;
  height: 100%;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  gap: clamp(12px, 4cqw, 24px);
  padding: 28px 30px;
  text-align: center;
}
.wrw-timeline-content h2 {
  margin: 0;
  font: 500 42px/.8 "Cormorant Garamond", serif;
  letter-spacing: .02em;
}
.wrw-timeline-content h2 span {
  display: block;
  margin-top: -2px;
  font: 400 34px/.8 "Great Vibes", cursive;
  letter-spacing: 0;
}
.wrw-timeline {
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 6.5cqw, 34px);
  align-items: center;
}
.wrw-timeline-item strong {
  display: block;
  margin-bottom: 2px;
  font: 700 10px "Cormorant Garamond", serif;
}
.wrw-timeline-item span {
  display: block;
  font: 500 11px/1.25 "Cormorant Garamond", serif;
  letter-spacing: .02em;
}
.wrw-info-content {
  display: flex;
  height: 100%;
  min-height: 100%;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  gap: clamp(8px, 2.8cqw, 16px);
  padding: 26px 26px;
  text-align: center;
}
.wrw-info-title { margin-bottom: 0; }
.wrw-info-title span {
  display: block;
  margin-bottom: -9px;
  font: 400 29px "Great Vibes", cursive;
}
.wrw-info-title h2 {
  margin: 0;
  font: 500 36px/.95 "Cormorant Garamond", serif;
  letter-spacing: .02em;
}
.wrw-location-card, .wrw-dress-card, .wrw-hotel-card {
  width: 100%;
  background: rgba(251,250,247,.9);
  box-shadow: 0 0 0 1px rgba(176,156,121,.18);
}
.wrw-location-card { padding: 8px 11px 13px; }
.wrw-location-card img {
  width: 100%;
  height: 96px;
  object-fit: cover;
  display: block;
  margin-bottom: 8px;
}
.wrw-section-label {
  margin: 0 0 7px;
  font: 500 11px "Cormorant Garamond", serif;
  letter-spacing: .03em;
}
.wrw-info-venue {
  margin: 0 0 2px;
  font: 500 8px "Montserrat", sans-serif;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.wrw-info-address {
  margin: 0;
  font: 500 7px/1.35 "Montserrat", sans-serif;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.wrw-dress-card {
  margin-top: 0;
  padding: 12px 12px 14px;
  background: rgba(178,158,122,.72);
}
.wrw-dress-card p:last-child {
  margin: 0;
  color: #fff;
  font: 500 8px "Montserrat", sans-serif;
  letter-spacing: .08em;
}
.wrw-swatches {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 10px 0 7px;
}
.wrw-swatches span {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.9);
  box-shadow: 0 1px 4px rgba(0,0,0,.14);
}
.wrw-hotel-card {
  margin-top: 0;
  padding: 10px 12px;
}
.wrw-hotel-card p {
  margin: 0 0 8px;
  font: 500 10px "Cormorant Garamond", serif;
}
.wrw-hotel-card span {
  display: block;
  font: 500 7px/1.45 "Montserrat", sans-serif;
  letter-spacing: .05em;
  text-transform: uppercase;
}
.wrw-thank-page { background: #fbfaf7; }
.wrw-thank-content {
  display: flex;
  height: 100%;
  min-height: 100%;
  flex-direction: column;
  text-align: center;
  background: #fbfaf7;
}
.wrw-thank-photo {
  position: relative;
  height: 48%;
  min-height: 48%;
  overflow: hidden;
}
.wrw-thank-photo::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 42%;
  background: linear-gradient(transparent 0%, rgba(251,250,247,.82) 62%, #fbfaf7 100%);
  pointer-events: none;
}
.wrw-thank-photo img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center top;
}
.wrw-thank-copy {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 0 28px 24px;
  margin-top: -35px;
  background: linear-gradient(rgba(251,250,247,0), #fbfaf7 30%);
}
.wrw-thank-copy h2 {
  margin: 0;
  color: #9c8566;
  font: 400 clamp(54px, 18cqw, 76px)/.8 "Great Vibes", cursive;
  text-shadow: 0 1px 0 rgba(255,255,255,.7);
}
.wrw-thank-copy p {
  margin: 0;
  max-width: 275px;
  color: #211c17;
  font: 600 clamp(8px, 2.65cqw, 10px)/2.05 "Cormorant Garamond", serif;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.wrw-thank-copy span {
  display: block;
  margin: 2px 0 0;
  color: #211c17;
  font: 600 9px "Cormorant Garamond", serif;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.wrw-thank-copy strong {
  display: block;
  margin: 0;
  color: #211c17;
  font: 500 clamp(18px, 5cqw, 23px)/1 "Cormorant Garamond", serif;
  letter-spacing: .03em;
  text-transform: uppercase;
}
.wrw-dots {
  position: absolute;
  z-index: 5;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.wrw-dots span {
  width: 7px;
  height: 7px;
  padding: 0;
  border: 1px solid rgba(21,17,13,.35);
  border-radius: 50%;
  background: rgba(255,255,255,.7);
}
.wrw-dots .wrw-dot-active {
  background: var(--gold);
  border-color: var(--gold);
  transform: scale(1.25);
}
@container (max-width: 330px) {
  .wrw-couple-copy h2 { font-size: 22px; }
  .wrw-date-content { padding: 24px 22px; }
  .wrw-date-content h2 { font-size: 58px; }
  .wrw-date-card p { font-size: 45px; }
  .wrw-info-content { padding: 20px 22px; }
  .wrw-location-card img { height: 78px; }
  .wrw-thank-copy { padding: 0 21px 20px; margin-top: -28px; }
  .wrw-thank-copy p { line-height: 1.86; }
}
@keyframes wrw-pulse { 0%, 100% { opacity: .34; } 50% { opacity: .9; } }
`;
