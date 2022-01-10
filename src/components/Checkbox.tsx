import React, { ComponentPropsWithRef, forwardRef } from 'react';

import clsxm from '@/utils/clsxm';

type CheckboxProps = ComponentPropsWithRef<'input'>;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...rest }, ref) => (
    <label
      className={clsxm(
        'group cursor-pointer block h-4 w-4 mr-2 relative select-none',
        className
      )}
    >
      <input
        className="cursor-pointer h-0 w-0 absolute opacity-0 peer"
        ref={ref}
        {...rest}
        type="checkbox"
      />
      <span
        className={clsxm(
          'bg-white border-2 border-pink-400 rounded h-6 w-6 absolute left-0 top-0 transition-colors duration-200 ease-linear',
          'group-hover:bg-pink-200 peer-checked:bg-pink-300'
        )}
      />
      <span className="absolute hidden peer-checked:block top-[6px] left-1 transition-colors duration-300 ease-linear">
        <div className="heart" />
      </span>
    </label>
  )
);

export default Checkbox;
