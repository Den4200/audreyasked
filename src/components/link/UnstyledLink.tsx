import { ComponentPropsWithRef, forwardRef } from 'react';

import Link, { LinkProps } from 'next/link';

export type UnstyledLinkProps = {
  href: string;
  openNewTab?: boolean;
  className?: string;
  nextLinkProps?: Omit<LinkProps, 'href'>;
} & ComponentPropsWithRef<'a'>;

const UnstyledLink = forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ children, href, openNewTab, className, nextLinkProps, ...rest }, ref) => {
    const isNewTab =
      openNewTab !== undefined
        ? openNewTab
        : href && !href.startsWith('/') && !href.startsWith('#');

    if (!isNewTab) {
      return (
        <Link href={href} {...nextLinkProps}>
          <a ref={ref} {...rest} className={className}>
            {children}
          </a>
        </Link>
      );
    }

    return (
      <a
        ref={ref}
        href={href}
        className={className}
        target="_blank"
        rel="noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }
);

export default UnstyledLink;
