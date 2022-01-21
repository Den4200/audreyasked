import { ComponentPropsWithRef, forwardRef } from 'react';

import clsxm from '@/utils/clsxm';

type DropdownProps = {
  options: string[];
} & ComponentPropsWithRef<'select'>;

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ className, options, ...rest }, ref) => (
    <select
      className={clsxm(
        'border-2 border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-300 bg-white rounded p-1',
        className
      )}
      ref={ref}
      {...rest}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
);

export default Dropdown;
