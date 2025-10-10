/* eslint-disable @typescript-eslint/no-explicit-any */
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
