import { forwardRef } from 'react';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/link/UnstyledLink';
import clsxm from '@/utils/clsxm';

const ButtonLink = forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ children, className, ...rest }, ref) => (
    <UnstyledLink
      ref={ref}
      {...rest}
      className={clsxm(
        'inline-block rounded border border-pink-500 bg-pink-400 px-2 py-1',
        'font-semibold text-white shadow-sm transition-colors duration-500',
        'hover:bg-pink-500 hover:text-white active:bg-pink-400',
        'disabled:bg-pink-300 disabled:hover:bg-pink-300',
        className
      )}
    >
      {children}
    </UnstyledLink>
  )
);

export default ButtonLink;
