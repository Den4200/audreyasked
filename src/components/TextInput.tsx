import React, { ComponentPropsWithRef, forwardRef } from 'react';

import clsxm from '@/utils/clsxm';

type TextInputProps = ComponentPropsWithRef<'input'>;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...rest }, ref) => (
    <input
      className={clsxm(
        'px-1 rounded-md text-sm leading-8 caret-pink-300',
        'border-2 border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-300',
        'placeholder:text-gray-400',
        className
      )}
      ref={ref}
      type="text"
      {...rest}
    />
  )
);

export default TextInput;
