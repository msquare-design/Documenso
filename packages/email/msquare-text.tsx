// M Square: email <Text> that wraps long words (e.g. file names without spaces) instead of
// running past the email's border. Exported in place of react-email's Text from ./components.ts.
import type { ComponentProps } from 'react';

import { Text as EmailText } from 'react-email';

export const Text = ({ style, ...props }: ComponentProps<typeof EmailText>) => (
  <EmailText style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', ...style }} {...props} />
);
