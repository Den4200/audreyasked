import { forwardRef } from 'react';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/link/UnstyledLink';
import clsxm from '@/utils/clsxm';

const UnderlineLink = forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ className, children, ...rest }, ref) => (
    <UnstyledLink
      ref={ref}
      {...rest}
      className={clsxm(
        'animated-underline font-semibold',
        'border-black border-b border-dotted hover:border-black/0',
        className
      )}
    >
      {children}
    </UnstyledLink>
  )
);

export default UnderlineLink;
