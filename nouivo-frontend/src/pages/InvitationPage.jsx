import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getTemplateComponent } from '../templates';

const MOCK_INVITATIONS = {
  'white-rose-demo': {
    expired: false,
    component_name: 'WhiteRoseWedding',
    data: {
      bride_name: 'Patricia',
      groom_name: 'Adam',
      date: 'Sunday, November 26, 2025',
      time: '3:00 PM',
      venue: 'Villa Benezia, 1234 Bank St, Grass Valley',
      photo_url: null,
    },
  },
  'grand-entrance-demo': {
    expired: false,
    component_name: 'EntranceVideoWedding',
    data: {
      bride_name: 'Fatma',
      groom_name: 'Ahmed',
      date: 'Saturday, June 14, 2025',
      time: '6:00 PM',
      venue: 'Palais des Roses, Tunis, Tunisia',
    },
  },
  expired: {
    expired: true,
    component_name: 'WhiteRoseWedding',
    data: {},
  },
};

function ExpiredInvitation() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 text-center"
      style={{ background: '#faf7f2', color: '#1a1a1a' }}
    >
      <div style={{ maxWidth: '24rem' }}>
        <p className="font-vibes text-gold mb-2" style={{ fontSize: '2.4rem' }}>Nouivo</p>
        <h1 className="font-cormorant font-light mb-4" style={{ fontSize: '2rem' }}>
          This invitation has expired
        </h1>
        <p className="font-montserrat text-xs leading-relaxed tracking-wide" style={{ color: '#777' }}>
          The couple's shareable link is no longer active. Please contact your host for updated details.
        </p>
      </div>
    </main>
  );
}

export default function InvitationPage() {
  const { slug } = useParams();
  const invitation = useMemo(
    () => MOCK_INVITATIONS[slug] || MOCK_INVITATIONS['white-rose-demo'],
    [slug],
  );
  const TemplateComponent = getTemplateComponent(invitation.component_name);

  if (invitation.expired) return <ExpiredInvitation />;

  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        minHeight: '100svh',
        overflow: 'hidden',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {TemplateComponent ? (
        <TemplateComponent data={invitation.data} standalone />
      ) : (
        <ExpiredInvitation />
      )}
    </main>
  );
}
