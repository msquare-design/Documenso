// M Square: emails in Arabic read right-to-left. Exported in place of react-email's Html and Body from
// ./components.ts; they set lang/dir from the language the email is rendered in (I18nProvider in render.tsx).
import type { ComponentProps } from 'react';
import { useContext } from 'react';

import { LinguiContext } from '@lingui/react';
import { Body as EmailBody, Html as EmailHtml } from 'react-email';

const RTL_LANGUAGES = new Set(['ar']);

const useDirection = () => {
  const locale = useContext(LinguiContext)?.i18n?.locale ?? 'en';
  const lang = locale.split('-')[0];

  return { lang, dir: RTL_LANGUAGES.has(lang) ? ('rtl' as const) : ('ltr' as const) };
};

export const Html = (props: ComponentProps<typeof EmailHtml>) => {
  const { lang, dir } = useDirection();

  return <EmailHtml lang={lang} dir={dir} {...props} />;
};

export const Body = (props: ComponentProps<typeof EmailBody>) => {
  const { lang, dir } = useDirection();

  return <EmailBody lang={lang} dir={dir} {...props} />;
};
