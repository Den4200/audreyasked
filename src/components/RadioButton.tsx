import React, { ComponentPropsWithRef, forwardRef } from 'react';

import clsxm from '@/utils/clsxm';

type RadioButtonProps = ComponentPropsWithRef<'input'>;

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ className, ...rest }, ref) => (
    <label
      className={clsxm(
        'group-option cursor-pointer block h-4 w-4 mr-2 relative select-none',
        className
      )}
    >
      <input
        className="cursor-pointer h-0 w-0 absolute opacity-0 peer"
        ref={ref}
        {...rest}
        type="radio"
        tabIndex={-1}
      />
      <span
        className={clsxm(
          'bg-white border-2 border-pink-400 rounded-full h-6 w-6 absolute left-0 top-0 transition-colors duration-200 ease-linear',
          'group-option-hover:bg-pink-200 group-option-hover:peer-checked:bg-white'
        )}
      />
      <span className="absolute hidden peer-checked:block top-[7px] left-1 transition-colors duration-300 ease-linear">
        <div className="heart before:bg-pink-300 after:bg-pink-300" />
      </span>
    </label>
  )
);

export default RadioButton;
