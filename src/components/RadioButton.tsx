import React, { ComponentPropsWithRef, forwardRef } from 'react';

import clsxm from '@/utils/clsxm';

type RadioButtonProps = ComponentPropsWithRef<'input'>;

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ className, ...rest }, ref) => (
    <label
      className={clsxm(
        'group-option relative mr-2 block h-4 w-4 cursor-pointer select-none',
        className
      )}
    >
      <input
        className="peer absolute h-0 w-0 cursor-pointer opacity-0"
        ref={ref}
        {...rest}
        type="radio"
        tabIndex={-1}
      />
      <span
        className={clsxm(
          'group-option-hover:bg-pink-200 group-option-hover:peer-checked:bg-white absolute left-0 top-0 h-6 w-6 rounded-full',
          'border-2 border-pink-400 bg-white transition-colors duration-200 ease-linear'
        )}
      />
      <span className="absolute top-[7px] left-1 hidden transition-colors duration-300 ease-linear peer-checked:block">
        <div className="heart before:bg-pink-300 after:bg-pink-300" />
      </span>
    </label>
  )
);

export default RadioButton;
