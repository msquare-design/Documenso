// M Square: social media icons shown at the bottom of every email (rendered by TemplateFooter).
// Edit the list here; icons are 72px PNGs in apps/remix/public/static/msquare/ shown at 24px.
import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';

import { Img, Link, Section } from './components';

const SOCIAL_LINKS = [
  { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/msquare_design/' },
  { name: 'X', icon: 'x', href: 'https://x.com/Msquare_design/' },
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/company/m-square-bahrain' },
  { name: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/channel/UCdbcUNyksvw_SEQRA80DD7A' },
  { name: 'Snapchat', icon: 'snapchat', href: 'https://snapchat.com/t/YGt6it8S' },
  { name: 'WhatsApp', icon: 'whatsapp', href: 'https://wa.me/966560992551' },
];

export const MsquareSocial = () => {
  const base = NEXT_PUBLIC_WEBAPP_URL().replace(/\/$/, '');

  return (
    <Section style={{ marginBottom: '2rem' }}>
      {SOCIAL_LINKS.map((s) => (
        <Link key={s.icon} href={s.href} target="_blank" style={{ display: 'inline-block', margin: '0 7px' }}>
          <Img src={`${base}/static/msquare/${s.icon}.png`} alt={s.name} width="24" height="24" style={{ display: 'block' }} />
        </Link>
      ))}
    </Section>
  );
};
