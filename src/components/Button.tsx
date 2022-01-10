import { ComponentPropsWithRef, forwardRef } from 'react';

import clsxm from '@/utils/clsxm';

type ButtonProps = ComponentPropsWithRef<'button'>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...rest }, ref) => (
    <button
      className={clsxm(
        'inline-block px-2 py-1 font-semibold rounded',
        'shadow-sm transition-colors duration-500',
        'bg-pink-400 text-white',
        'border border-pink-500',
        'hover:bg-pink-500 hover:text-white',
        'active:bg-pink-400',
        'disabled:bg-pink-300 disabled:hover:bg-pink-300',
        className
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  )
);

export default Button;
