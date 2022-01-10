import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const clsxm = (...classes: ClassValue[]) => twMerge(clsx(...classes));
export default clsxm;
